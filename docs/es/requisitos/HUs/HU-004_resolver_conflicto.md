# HU-004 — Resolver conflicto de fusión de notas

<!--
  ¿Qué? Historia de usuario sobre cómo se viven los conflictos de sync desde la perspectiva del usuario.
  ¿Para qué? El diferenciador central del proyecto: auto-merge cuando es seguro, intervención solo si es real.
  ¿Impacto? Es la experiencia que directamente ataca la pérdida silenciosa de datos de plugins actuales.
-->

---

## Identificación

| Campo            | Valor                                       |
| ----------------- | ---------------------------------------------- |
| **ID**            | HU-004                                          |
| **Título**        | Resolver conflicto de fusión de notas              |
| **Módulo**        | Sync Engine / Conflictos                             |
| **Prioridad**     | Alta                                                    |
| **Estado**        | Planificada                                               |
| **RF asociados**  | RF-003, RF-004                                               |

---

## Historia

**Como** usuario que edita notas desde varios dispositivos,
**quiero** que los conflictos de texto se resuelvan automáticamente cuando es seguro, y que se me pida decidir solo cuando hay un choque real,
**para** no perder ediciones ni gastar tiempo revisando conflictos falsos.

---

## Criterios de aceptación

### CA-004.1 — Merge automático transparente
- **Dado que** edité una nota en dos dispositivos sin tocar las mismas líneas,
- **cuando** el sync corre,
- **entonces** la nota se fusiona automáticamente sin pedirme nada.

### CA-004.2 — Notificación de merge automático
- **Dado que** ocurrió un merge automático,
- **cuando** reviso el log,
- **entonces** veo registrado que esa nota se fusionó automáticamente.

### CA-004.3 — Alerta de conflicto real
- **Dado que** edité la misma línea de una nota en dos dispositivos,
- **cuando** el sync corre,
- **entonces** recibo una notificación de conflicto sin resolver, con ambas versiones disponibles.

### CA-004.4 — Resolución manual
- **Dado que** tengo un conflicto real pendiente,
- **cuando** abro la nota en conflicto,
- **entonces** puedo elegir qué versión conservar o combinar manualmente.

### CA-004.5 — Conflicto binario conserva ambas copias
- **Dado que** un adjunto (imagen/PDF) cambió en ambos dispositivos,
- **cuando** el sync corre,
- **entonces** encuentro ambos archivos en mi vault, uno con sufijo de copia conflictiva.

### CA-004.6 — Sin sobrescritura silenciosa
- **Dado que** hay cualquier tipo de conflicto real,
- **cuando** el sync corre,
- **entonces** ninguna versión se sobrescribe sin que yo lo sepa.
