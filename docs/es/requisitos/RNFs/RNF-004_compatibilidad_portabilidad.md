# RNF-004 — Compatibilidad y Portabilidad

<!--
  ¿Qué? Requisito no funcional sobre soporte multiplataforma y preparación para mobile futuro.
  ¿Para qué? Evitar decisiones técnicas en v1 que bloqueen el soporte mobile documentado como RF futuro.
  ¿Impacto? Reescribir I/O más adelante para soportar mobile es costoso si no se diseña bien desde el inicio.
-->

---

## Identificación

| Campo         | Valor                         |
| ------------- | ----------------------------- |
| **ID**        | RNF-004                       |
| **Nombre**    | Compatibilidad y Portabilidad |
| **Categoría** | Compatibilidad                |
| **Prioridad** | Media                         |
| **Estado**    | Planificado                   |
| **Fecha**     | Agosto 2026                   |

---

## Requisitos

### RNF-004.1 — Desktop multiplataforma

El plugin funciona igual en Windows, macOS y Linux vía Obsidian desktop.

### RNF-004.2 — Sin APIs específicas de SO

Toda operación de I/O pasa por `Vault`/`Adapter` de Obsidian, nunca Node `fs` directo, para no bloquear la portabilidad mobile futura (RT-002, RF-012).

### RNF-004.3 — Versión mínima de Obsidian soportada

Se define y documenta `minAppVersion` en `manifest.json`.

### RNF-004.4 — Arquitectura extensible a proveedores

La interfaz `SyncProvider` desacoplada permite agregar WebDAV/S3/Google Drive sin romper el core (ver RT-004).
