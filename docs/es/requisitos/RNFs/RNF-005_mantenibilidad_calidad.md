# RNF-005 — Mantenibilidad y Calidad

<!--
  ¿Qué? Requisito no funcional sobre calidad interna del código.
  ¿Para qué? Que un colaborador nuevo pueda entender y extender el proyecto sin romper la lógica de sync/merge/cifrado.
  ¿Impacto? Sin tests ni separación de responsabilidades, un bug en el merge automático puede corromper vaults de usuarios reales.
-->

---

## Identificación

| Campo         | Valor                    |
| ------------- | -------------------------- |
| **ID**        | RNF-005                    |
| **Nombre**    | Mantenibilidad y Calidad   |
| **Categoría** | Calidad de código          |
| **Prioridad** | Alta                       |
| **Estado**    | Planificado                |
| **Fecha**     | Agosto 2026                |

---

## Requisitos

### RNF-005.1 — Cobertura de tests
La lógica de hashing, merge de tres vías, cifrado/descifrado y manejo de conflictos debe tener tests unitarios obligatorios con Vitest (RH-003). Cobertura mínima de código: **85%** (líneas/branches), verificada en CI; el build falla si cae por debajo del umbral.

### RNF-005.2 — Tipado estricto
TypeScript en modo `strict`, sin `any` implícito (RT-001).

### RNF-005.3 — Separación de responsabilidades
Sync Engine, SyncProvider, Crypto Layer y Conflict Resolver son módulos independientes, testeables por separado.

### RNF-005.4 — Documentación de requisitos primero
Todo cambio funcional relevante tiene su RF/RNF documentado y aprobado antes de implementarse (RO-003).

### RNF-005.5 — Lint/format consistente
ESLint + Prettier se ejecutan en CI, sin excepciones ni código sin formatear en `main`.
