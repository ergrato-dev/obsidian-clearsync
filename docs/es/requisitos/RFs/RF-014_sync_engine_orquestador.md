# RF-014 — Sync Engine: orquestador del ciclo de sync (v0.1, sin resolución de conflictos)

<!--
  ¿Qué? Requisito funcional que define el ciclo que conecta RF-002/005/007/009/013 en una sincronización real.
  ¿Para qué? Es la pieza que falta para que v0.1 deje de ser infraestructura aislada y sincronice archivos de verdad.
  ¿Impacto? Sin esto, ningún RF de v0.1 tiene efecto observable — el usuario puede configurar todo y nada se sincroniza.
-->

---

## Identificación

| Campo         | Valor                                                                           |
| ------------- | ------------------------------------------------------------------------------- |
| **ID**        | RF-014                                                                          |
| **Nombre**    | Sync Engine: orquestador del ciclo de sync (v0.1, sin resolución de conflictos) |
| **Módulo**    | Sync Engine                                                                     |
| **Prioridad** | Alta                                                                            |
| **Estado**    | Planificado                                                                     |
| **Fecha**     | Agosto 2026                                                                     |

---

## Descripción

Orquesta un ciclo completo de sincronización: recorre el vault, clasifica cada archivo contra el estado remoto (RF-002), cifra/descifra contenido (RF-005), sube/baja vía un `SyncProvider` (RF-013), y registra cada operación (RF-007). **Alcance de v0.1:** los archivos clasificados como `conflict` se detectan y se dejan intactos, sin fusionar — la resolución automática de texto (RF-003) y de binarios (RF-004) es v0.2 del roadmap. En v0.1 el ciclo se dispara manualmente (botón en Settings), no en background.

---

## Entradas

| Campo                            | Tipo   | Obligatorio | Notas                                                                      |
| -------------------------------- | ------ | ----------- | -------------------------------------------------------------------------- |
| Instancia de `SyncProvider`      | Objeto | Sí          | `DropboxProvider` (RF-013)                                                 |
| `HashCache`                      | Objeto | Sí          | RF-002                                                                     |
| `EncryptionManager` desbloqueada | Objeto | Sí          | RF-005 — el ciclo no arranca si `isUnlocked()` es falso                    |
| `SyncLog`/`SyncStatus`           | Objeto | Sí          | RF-007                                                                     |
| Archivos del vault               | Datos  | Sí          | Vía `app.vault.getFiles()`, alcance con exclusión básica de `.obsidian/**` |

---

## Proceso

1. `syncStatus.set("syncing")`.
2. Recorre `app.vault.getFiles()` dentro del alcance (solo la exclusión por defecto de `.obsidian/**` en v0.1 — patrones configurables completos son RF-008, v0.3 del roadmap).
3. Para cada archivo, calcula `localHash` (RF-002 `hashContent`).
4. Llama a `syncProvider.listChanges()` para obtener el estado remoto (maneja el cursor de paginación si el vault es grande).
5. Por archivo, obtiene `baseHash` desde `HashCache` y clasifica con `classifyChange({localHash, remoteHash, baseHash})` (RF-002).
6. **`upload`**: cifra el contenido (`encryption.encryptContent`) → `syncProvider.upload()` → actualiza `HashCache` → `logSyncEvent(action: "uploaded", result: "ok")`.
7. **`download`**: `syncProvider.download()` → descifra (`encryption.decryptContent`; si lanza `DecryptionError`, `logSyncEvent` con `result: "error"` y detalle de contraseña incorrecta) → escribe con la Vault API → actualiza `HashCache` → `logSyncEvent("downloaded")`.
8. **`conflict`**: v0.1 no fusiona — `logSyncEvent(action: "conflict", result: "error", detail: "pendiente de merge — v0.2")` y continúa con el resto de archivos sin abortar el ciclo (primera vez que RF-009 paso 5 aplica de verdad).
9. **`unchanged`**: se omite sin loguear, para no generar ruido.
10. Al terminar: `syncStatus.set("idle")`, o `"error"` si ocurrió algo no recuperable fuera del manejo por-archivo del paso 8.

---

## Salidas

| Escenario                              | Resultado                                                                         |
| -------------------------------------- | --------------------------------------------------------------------------------- |
| Ciclo completo sin conflictos          | Todos los archivos sincronizados, `syncStatus` vuelve a `"idle"`, log actualizado |
| Archivo(s) en conflicto detectados     | Se dejan intactos, quedan logueados como pendientes, el resto del ciclo continúa  |
| Cifrado no desbloqueado                | El ciclo no arranca; mensaje pidiendo desbloquear (reutiliza el paso de RF-006)   |
| Fallo de red persistente en un archivo | Ese archivo falla y se loguea (RF-009 paso 4); el ciclo sigue con los demás       |

---

## APIs / Componentes involucrados

- `SyncProvider`/`DropboxProvider` (RF-013), `HashCache`/`classifyChange`/`hashContent` (RF-002), `EncryptionManager` (RF-005), `SyncLog`/`SyncStatus`/`logSyncEvent` (RF-007), Vault API de Obsidian (`getFiles`, `read`, `create`/`modify`)

---

## Reglas de negocio

- RN-001: Ningún archivo clasificado como `conflict` se sobrescribe automáticamente en v0.1 — la única acción permitida es dejarlo intacto y loguearlo. RF-003/RF-004 lo resuelven en v0.2.
- RN-002: Un error en un archivo individual (ej. fallo de red en su upload) no aborta el ciclo completo — se loguea y se continúa con el resto.
- RN-003: El ciclo no corre automáticamente en v0.1 — se dispara manualmente desde Settings. Sync automático en background (usando el flag `autoSyncEnabled` ya existente desde RF-006) queda como RF futuro no documentado todavía.
