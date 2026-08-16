# HU-007 — Cambiar idioma de la interfaz

<!--
  ¿Qué? Historia de usuario sobre el soporte bilingüe de la interfaz del plugin.
  ¿Para qué? Un plugin de sync se usa a diario — la barrera de idioma es fricción constante.
  ¿Impacto? Sin esto, una parte de la comunidad hispanohablante usa una herramienta que no entiende del todo.
-->

---

## Identificación

| Campo            | Valor                         |
| ---------------- | ----------------------------- |
| **ID**           | HU-007                        |
| **Título**       | Cambiar idioma de la interfaz |
| **Módulo**       | UI / i18n                     |
| **Prioridad**    | Media                         |
| **Estado**       | Planificada                   |
| **RF asociados** | RF-011                        |

---

## Historia

**Como** usuario que prefiere español o inglés,
**quiero** que la interfaz del plugin respete el idioma de Obsidian o me deje elegirlo manualmente,
**para** usar el plugin cómodamente en mi idioma.

---

## Criterios de aceptación

### CA-007.1 — Detección automática

- **Dado que** Obsidian está configurado en español,
- **cuando** abro Settings > ClearSync,
- **entonces** toda la interfaz del plugin aparece en español.

### CA-007.2 — Override manual

- **Dado que** quiero forzar un idioma distinto al de Obsidian,
- **cuando** cambio el selector de idioma en Settings,
- **entonces** la interfaz del plugin cambia inmediatamente sin reiniciar Obsidian.

### CA-007.3 — Fallback a inglés

- **Dado que** Obsidian está configurado en un idioma no soportado (ej. francés),
- **cuando** abro el plugin,
- **entonces** la interfaz se muestra en inglés por defecto.

### CA-007.4 — Sin claves crudas visibles

- **Dado que** falta una traducción para un string específico,
- **cuando** ese texto se muestra,
- **entonces** veo el texto en inglés como fallback, nunca una clave técnica sin traducir.
