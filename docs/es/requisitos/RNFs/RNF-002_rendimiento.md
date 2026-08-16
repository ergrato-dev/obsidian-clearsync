# RNF-002 — Rendimiento

<!--
  ¿Qué? Requisito no funcional sobre eficiencia de la sincronización.
  ¿Para qué? Evitar el consumo excesivo de batería/CPU y los re-scans completos que penalizan a alternativas como Livesync.
  ¿Impacto? Un sync lento o pesado hace que el usuario desactive el plugin, sin importar cuán segura sea la implementación.
-->

---

## Identificación

| Campo         | Valor        |
| ------------- | ------------- |
| **ID**        | RNF-002       |
| **Nombre**    | Rendimiento   |
| **Categoría** | Rendimiento   |
| **Prioridad** | Alta          |
| **Estado**    | Planificado   |
| **Fecha**     | Agosto 2026   |

---

## Requisitos

### RNF-002.1 — Sync incremental
Nunca se re-escanea el vault completo. La detección de cambios usa hash de contenido contra el último estado conocido (RT-006).

### RNF-002.2 — Sin bloqueo de UI
Las operaciones de sync se ejecutan de forma asíncrona y no bloquean el hilo principal de Obsidian.

### RNF-002.3 — Límite de tamaño de archivo
El plugin advierte o permite configurar un umbral de tamaño para adjuntos grandes antes de subirlos.

### RNF-002.4 — Backoff ante rate-limiting
Ante respuestas de rate-limit de la API de Dropbox, el plugin espera con backoff exponencial en vez de reintentar agresivamente (ver RF-009).

### RNF-002.5 — Batch de operaciones
Múltiples cambios pequeños se agrupan en una sola pasada de sync en vez de generar una request por archivo.
