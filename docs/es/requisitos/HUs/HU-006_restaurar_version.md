# HU-006 — Restaurar versión anterior de una nota

<!--
  ¿Qué? Historia de usuario sobre deshacer un merge o resolución de conflicto no deseado.
  ¿Para qué? El auto-merge puede producir un resultado técnicamente limpio pero indeseado.
  ¿Impacto? Sin esto, un merge automático de bajo riesgo podría sentirse irreversible y generar desconfianza.
-->

---

## Identificación

| Campo            | Valor                                  |
| ---------------- | -------------------------------------- |
| **ID**           | HU-006                                 |
| **Título**       | Restaurar versión anterior de una nota |
| **Módulo**       | Conflictos / Recuperación              |
| **Prioridad**    | Media                                  |
| **Estado**       | Planificada                            |
| **RF asociados** | RF-010                                 |

---

## Historia

**Como** usuario que no está conforme con el resultado de un merge automático o una resolución de conflicto,
**quiero** restaurar una versión anterior conocida de la nota,
**para** deshacer un resultado no deseado sin perder mi trabajo.

---

## Criterios de aceptación

### CA-006.1 — Ver versiones disponibles

- **Dado que** reviso el log de sync o una copia conflictiva,
- **cuando** busco una nota específica,
- **entonces** puedo ver las versiones anteriores disponibles para restaurar.

### CA-006.2 — Restaurar con un clic

- **Dado que** encontré la versión que quiero recuperar,
- **cuando** elijo "restaurar esta versión",
- **entonces** mi nota actual se reemplaza por esa versión.

### CA-006.3 — La restauración se sincroniza

- **Dado que** restauré una versión,
- **cuando** el siguiente ciclo de sync corre,
- **entonces** ese cambio se propaga a mis otros dispositivos como una edición normal.

### CA-006.4 — No se pierden copias conflictivas

- **Dado que** restauré una versión desde una copia conflictiva,
- **cuando** reviso mi vault,
- **entonces** las demás copias conflictivas siguen existiendo hasta que yo las borre.
