# RF-013 — Implementación de DropboxProvider

<!--
  ¿Qué? Requisito funcional que define la implementación concreta de la interfaz SyncProvider para Dropbox.
  ¿Para qué? RF-001/002/005/006/007/009 ya están construidos pero ninguno mueve un archivo real todavía — falta la pieza que habla con la API de Dropbox.
  ¿Impacto? Sin esto, v0.1 completo (RF-001,002,005,006,007,009) sigue siendo infraestructura sin conectar; el plugin no sincroniza nada de verdad.
-->

---

## Identificación

| Campo         | Valor                             |
| ------------- | --------------------------------- |
| **ID**        | RF-013                            |
| **Nombre**    | Implementación de DropboxProvider |
| **Módulo**    | Sync Engine / Proveedor           |
| **Prioridad** | Alta                              |
| **Estado**    | Planificado                       |
| **Fecha**     | Agosto 2026                       |

---

## Descripción

Implementación concreta de la interfaz `SyncProvider` (`src/sync/SyncProvider.ts`, RT-004) contra la API v2 de Dropbox: listar cambios remotos, subir, descargar y eliminar archivos. Se autentica con los tokens de RF-001 y toda llamada HTTP pasa por el wrapper de backoff de RF-009. No decide qué sincronizar ni resuelve conflictos — esa es responsabilidad de RF-014 (Sync Engine); `DropboxProvider` solo ejecuta las operaciones remotas que se le piden (patrón Strategy, ver `docs/es/conceptos/patrones-arquitectonicos.md`).

---

## Entradas

| Campo                           | Tipo  | Obligatorio | Notas                                                       |
| ------------------------------- | ----- | ----------- | ----------------------------------------------------------- |
| Access token vigente            | Datos | Sí          | Vía `DropboxAuthManager.ensureFreshAccessToken()` (RF-001)  |
| Carpeta remota base             | Texto | Sí          | `settings.remoteFolder` (RF-006)                            |
| Cursor de paginación (opcional) | Texto | No          | Devuelto por `listChanges()`, usado en la siguiente llamada |

---

## Proceso

1. Cada método de `DropboxProvider` (`listChanges`, `upload`, `download`, `delete`) llama primero a `dropboxAuth.ensureFreshAccessToken()` para obtener un access token vigente (RF-001 RN-002).
2. `listChanges(cursor?)` usa `/files/list_folder` (primera llamada) o `/files/list_folder/continue` (con cursor) para enumerar archivos bajo la carpeta remota, devolviendo `path`, `content_hash` (propio de Dropbox) y `modifiedAt` por archivo, más un cursor para la próxima llamada.
3. `upload(path, content)` usa `/files/upload` con el contenido ya cifrado (RF-005) que recibe de Sync Engine — nunca cifra ni descifra por su cuenta. Archivos grandes (`/files/upload_session/*`) quedan para cuando el umbral se defina en implementación.
4. `download(path)` usa `/files/download` y devuelve el `ArrayBuffer` cifrado tal cual viene — el descifrado lo hace Sync Engine (RF-005), no este módulo.
5. `delete(path)` usa `/files/delete_v2`.
6. Todas las llamadas pasan por `withBackoff` (RF-009) — `DropboxProvider` nunca llama a la API de Dropbox sin ese wrapper.

---

## Salidas

| Escenario                                       | Resultado                                                                           |
| ----------------------------------------------- | ----------------------------------------------------------------------------------- |
| Operación exitosa                               | Devuelve los datos/confirmación esperados por la interfaz `SyncProvider`            |
| Token expirado y sin refresh posible            | Propaga `DropboxSessionExpiredError` (RF-001) — Sync Engine decide cómo reaccionar  |
| Rate-limit (429) o error transitorio (5xx)      | Manejado de forma transparente por `withBackoff` (RF-009), invisible para el caller |
| Error de red persistente tras agotar reintentos | Falla de forma visible — Sync Engine la registra vía RF-007                         |

---

## APIs / Componentes involucrados

- Dropbox API v2: `files/list_folder`, `files/list_folder/continue`, `files/upload`, `files/download`, `files/delete_v2`
- `DropboxAuthManager` (RF-001), `withBackoff` (RF-009)

---

## Reglas de negocio

- RN-001: `DropboxProvider` nunca decide qué sincronizar ni resuelve conflictos — solo ejecuta las operaciones de lectura/escritura remota que Sync Engine (RF-014) le pide.
- RN-002: El contenido que sube/baja siempre es tal cual lo recibe/entrega — nunca cifra ni descifra (RF-005/RF-014 son responsables de eso).
- RN-003: El `content_hash` propio de Dropbox no se usa como fuente de verdad para clasificación de cambios (ver nota de RT-006 en `docs/es/referencia-tecnica/sync-engine.md`) — como mucho, una optimización opcional para evitar descargas innecesarias, si se implementa.
