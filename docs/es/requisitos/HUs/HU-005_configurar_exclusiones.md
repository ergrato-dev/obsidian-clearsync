# HU-005 — Configurar exclusiones de sync

<!--
  ¿Qué? Historia de usuario sobre excluir carpetas/archivos del proceso de sync.
  ¿Para qué? No todo el contenido de un vault necesita o debe sincronizarse.
  ¿Impacto? Sin control de exclusiones, el usuario sube contenido innecesario o sensible sin poder evitarlo.
-->

---

## Identificación

| Campo            | Valor                          |
| ---------------- | ------------------------------ |
| **ID**           | HU-005                         |
| **Título**       | Configurar exclusiones de sync |
| **Módulo**       | Configuración                  |
| **Prioridad**    | Media                          |
| **Estado**       | Planificada                    |
| **RF asociados** | RF-008                         |

---

## Historia

**Como** usuario con carpetas pesadas o sensibles en mi vault,
**quiero** excluir carpetas o patrones de archivo del sync,
**para** controlar qué contenido se sube a la nube.

---

## Criterios de aceptación

### CA-005.1 — Agregar patrón de exclusión

- **Dado que** estoy en Settings > ClearSync,
- **cuando** agrego un patrón como `attachments/videos/**`,
- **entonces** se guarda en la lista de exclusiones.

### CA-005.2 — Validación de sintaxis

- **Dado que** ingreso un patrón glob inválido,
- **cuando** intento guardarlo,
- **entonces** veo un error de sintaxis antes de que se aplique.

### CA-005.3 — Exclusión por defecto de configuración local

- **Dado que** no toqué la configuración de exclusiones,
- **cuando** reviso la lista,
- **entonces** `.obsidian/` ya está excluida por defecto.

### CA-005.4 — Archivos excluidos no se suben

- **Dado que** agregué un patrón de exclusión,
- **cuando** corre el siguiente sync,
- **entonces** los archivos coincidentes no se transfieren.

### CA-005.5 — Excluir no borra lo ya sincronizado

- **Dado que** excluyo una carpeta que ya estaba sincronizada,
- **cuando** reviso el remoto,
- **entonces** los archivos previamente subidos siguen ahí hasta que los borre manualmente.
