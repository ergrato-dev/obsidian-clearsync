# Sync Engine — Algoritmo de detección y resolución

<!--
  ¿Qué? Detalle del algoritmo de hashing, detección de conflictos, merge y backoff.
  ¿Para qué? Es el corazón técnico del diferenciador del proyecto — debe quedar documentado antes de codearse (RO-003).
  ¿Impacto? Un error de diseño acá (ej. hash sobre contenido cifrado) rompe el merge de texto o genera falsos conflictos.
-->

---

## Estructuras de datos

**Entrada de Hash Cache** (una por archivo, persistida localmente vía `saveData()`):

```
{
  path: string
  baseHash: string       // último hash sincronizado en común (local == remoto)
  lastSyncedAt: number    // timestamp epoch
}
```

**Entrada de Sync Log** (RF-007):

```
{
  timestamp: number
  path: string
  action: "uploaded" | "downloaded" | "merged" | "conflict" | "restored"
  result: "ok" | "error"
  detail?: string
}
```

## Detección de cambios (RF-002)

1. Para cada archivo dentro del alcance (excluyendo patrones de RF-008), calcular `localHash = SHA-256(contenido en claro)` vía Web Crypto `subtle.digest`.
2. Obtener `remoteHash` — calculado igual al descargar metadata/contenido del proveedor, o vía hash provisto por la API si es confiable (a validar contra Dropbox API v2 `content_hash`, que usa un algoritmo propio distinto de SHA-256 — **no asumir compatibilidad directa**, recalcular localmente tras descarga si es necesario).
3. Comparar `localHash`, `remoteHash` contra `baseHash` de la Hash Cache:

| localHash == baseHash | remoteHash == baseHash | Resultado                          |
| --------------------- | ---------------------- | ---------------------------------- |
| Sí                    | Sí                     | Sin cambios — se omite             |
| No                    | Sí                     | Cambio local — subir               |
| Sí                    | No                     | Cambio remoto — descargar          |
| No                    | No                     | Conflicto real — ver merge/binario |

## Merge de tres vías (RF-003)

Solo para extensiones de texto plano (`.md`, `.txt`):

1. Recuperar `baseContent` (última versión sincronizada en común, cacheada localmente o reconstruible).
2. Ejecutar diff3 línea a línea entre `baseContent`, `localContent`, `remoteContent`.
3. Si ningún hunk modificado se superpone entre local y remoto → aplicar merge, resultado pasa a ser la nueva versión sincronizada.
4. Si hay superposición → marcar como conflicto sin resolver (RF-003.4), no tocar el archivo local hasta que el usuario decida.

## Conflictos binarios (RF-004)

Para archivos no soportados por diff3:

1. Conservar la versión remota con el nombre original.
2. Guardar la versión local como `nombre (conflicto {deviceId} {timestampISO}).ext`.
3. Registrar ambas rutas en el Sync Log.

## Backoff ante rate-limiting (RF-009)

Wrapper HTTP alrededor de toda llamada a `SyncProvider`:

- 429 con header `Retry-After` → esperar exactamente ese tiempo.
- 429 sin header → backoff exponencial con jitter: `min(baseDelay * 2^intento + jitter, maxDelay)`.
- 5xx → mismo backoff exponencial, hasta `maxRetries` (configurable, default a definir en implementación).
- Agotados los reintentos → falla visible (RF-007), el resto del ciclo continúa con otros archivos.

## Nota sobre cifrado y hashing

El hash de integridad de sync (RF-002) se calcula **sobre el contenido en claro**, nunca sobre el contenido cifrado — el cifrado (RF-005) ocurre en un paso posterior del pipeline, exclusivamente para el transporte/almacenamiento remoto. Si se hasheara el contenido cifrado, un nonce/IV distinto en cada cifrado produciría hashes distintos para contenido idéntico, rompiendo la detección de "sin cambios".
