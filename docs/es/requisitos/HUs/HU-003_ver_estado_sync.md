# HU-003 — Ver estado y progreso de sincronización

<!--
  ¿Qué? Historia de usuario sobre visibilidad del estado de sync.
  ¿Para qué? Ningún fallo debe pasar desapercibido para el usuario.
  ¿Impacto? Sin esto, el usuario descubre pérdida de datos días después, cuando ya es tarde para reaccionar.
-->

---

## Identificación

| Campo            | Valor                                   |
| ---------------- | --------------------------------------- |
| **ID**           | HU-003                                  |
| **Título**       | Ver estado y progreso de sincronización |
| **Módulo**       | UI / Estado                             |
| **Prioridad**    | Alta                                    |
| **Estado**       | Planificada                             |
| **RF asociados** | RF-007                                  |

---

## Historia

**Como** usuario de ClearSync,
**quiero** ver en todo momento si mi vault está sincronizado, sincronizando, o con errores,
**para** confiar en que mis notas están seguras sin tener que adivinar.

---

## Criterios de aceptación

### CA-003.1 — Ícono de estado en barra inferior

- **Dado que** el plugin está activo,
- **cuando** reviso la barra de estado de Obsidian,
- **entonces** veo un ícono que indica idle/sincronizando/error.

### CA-003.2 — Panel de log accesible

- **Dado que** quiero ver el historial de sync,
- **cuando** abro el panel de log de ClearSync,
- **entonces** veo las últimas operaciones con archivo, acción, resultado y fecha/hora.

### CA-003.3 — Notificación ante error

- **Dado que** ocurre un error de red o de la API,
- **cuando** el sync falla,
- **entonces** recibo una notificación visible además del registro en el log.

### CA-003.4 — Notificación persistente ante conflicto

- **Dado que** hay un conflicto sin resolver,
- **cuando** reviso el estado,
- **entonces** la notificación permanece visible hasta que resuelvo el conflicto.

### CA-003.5 — Sin fallos silenciosos

- **Dado que** cualquier operación de sync falla,
- **cuando** reviso el log,
- **entonces** siempre encuentro un registro de esa falla, nunca ausencia de información.
