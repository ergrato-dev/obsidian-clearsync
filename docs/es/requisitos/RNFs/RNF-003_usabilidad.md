# RNF-003 — Usabilidad

<!--
  ¿Qué? Requisito no funcional sobre experiencia de usuario y accesibilidad de idioma.
  ¿Para qué? Evitar fallos silenciosos y barreras de idioma, dos quejas recurrentes contra plugins de sync actuales.
  ¿Impacto? Sin feedback claro, el usuario pierde confianza en que sus datos están sincronizados correctamente.
-->

---

## Identificación

| Campo         | Valor        |
| ------------- | ------------- |
| **ID**        | RNF-003       |
| **Nombre**    | Usabilidad    |
| **Categoría** | Usabilidad/UX |
| **Prioridad** | Alta          |
| **Estado**    | Planificado   |
| **Fecha**     | Agosto 2026   |

---

## Requisitos

### RNF-003.1 — Feedback de estado
El usuario siempre puede ver si el sync está en curso, completado o con error. Ningún fallo debe pasar en silencio (RF-007).

### RNF-003.2 — i18n español/inglés
Toda la interfaz (Settings, notificaciones, mensajes de estado) pasa por el sistema de i18n, sin strings hardcodeados (RF-011, RI-003).

### RNF-003.3 — Mensajes de conflicto claros
Cuando el auto-merge falla, el usuario ve qué archivo está en conflicto, qué cambió, y opciones claras de resolución.

### RNF-003.4 — Configuración mínima viable
Vincular Dropbox y empezar a sincronizar debe tomar pocos pasos: autorizar OAuth y confirmar la carpeta del vault.
