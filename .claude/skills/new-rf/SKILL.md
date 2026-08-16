---
name: new-rf
description: >
  Creates a new bilingual (es/en) functional requirement (RF) document for ClearSync,
  following the project's standard RF template (Identificación, Descripción, Entradas,
  Proceso, Salidas, APIs/Componentes involucrados, Reglas de negocio). Use when the user
  asks to "add a new RF", "document a new feature", "crear un RF nuevo", or before
  implementing any functional change not yet covered by an existing RF (required by RO-003).
---

Create a new functional requirement for ClearSync. This project follows a
documentation-first workflow (RO-003 in `docs/{es,en}/requisitos/restricciones.md`):
no functional change is implemented without an approved RF first.

## Steps

1. Determine the next RF number by checking the highest existing `RF-NNN` in
   `docs/es/requisitos/RFs/`.
2. Pick a short kebab-case filename matching the RF topic, e.g.
   `RF-013_nombre_descriptivo.md`. Use the **same filename** in both `docs/es/` and
   `docs/en/`.
3. Write the Spanish version first (`docs/es/requisitos/RFs/RF-NNN_....md`) using this
   structure, matching existing RFs (see RF-001 as reference):
   - `# RF-NNN — <Nombre>`
   - HTML comment: qué / para qué / impacto
   - `## Identificación` table: ID, Nombre, Módulo, Prioridad, Estado, Fecha
   - `## Descripción`
   - `## Entradas` (table, or "No aplica" if purely internal behavior)
   - `## Proceso` (numbered steps)
   - `## Salidas` (table: Escenario / Resultado)
   - `## APIs / Componentes involucrados`
   - `## Reglas de negocio` (RN-001, RN-002, ...)
4. Write the English translation at `docs/en/requisitos/RFs/` with the same filename
   and structure (see RI-002: public docs must be bilingual).
5. If the RF has a direct end-user journey (not purely internal/backend behavior),
   also create a matching HU — see the RFs without HUs (RF-002, RF-009, RF-012) for
   what counts as "internal, no HU needed".
6. Cross-reference: link the new RF from any RNF/restricciones section it satisfies,
   and update `docs/{es,en}/referencia-tecnica/architecture.md` if it introduces a
   new component.
7. Do not implement the feature in this same step — the RF must be reviewed and
   approved by the user first (RO-003).
