# HU-002 — Completar configuración inicial del vault

<!--
  ¿Qué? Historia de usuario sobre el asistente de primera configuración (Dropbox + cifrado + carpeta remota).
  ¿Para qué? Reducir la fricción de setup sin saltarse pasos críticos de seguridad.
  ¿Impacto? Un onboarding confuso hace que el usuario configure mal el cifrado y pierda acceso a sus propios datos.
-->

---

## Identificación

| Campo            | Valor                                       |
| ----------------- | ---------------------------------------------- |
| **ID**            | HU-002                                          |
| **Título**        | Completar configuración inicial del vault         |
| **Módulo**        | Configuración                                       |
| **Prioridad**     | Alta                                                  |
| **Estado**        | Planificada                                             |
| **RF asociados**  | RF-005, RF-006                                            |

---

## Historia

**Como** usuario nuevo del plugin,
**quiero** completar un asistente de configuración inicial (Dropbox + cifrado + carpeta remota),
**para** empezar a sincronizar mi vault de forma segura sin pasos confusos.

---

## Criterios de aceptación

### CA-002.1 — Asistente guiado
- **Dado que** instalo el plugin por primera vez,
- **cuando** abro Settings,
- **entonces** veo un asistente paso a paso: conectar Dropbox, definir contraseña de cifrado, elegir carpeta remota.

### CA-002.2 — Confirmación de contraseña de cifrado
- **Dado que** estoy definiendo mi contraseña de cifrado,
- **cuando** la ingreso y confirmo,
- **entonces** el asistente valida que ambos campos coincidan antes de avanzar.

### CA-002.3 — Advertencia de pérdida de acceso
- **Dado que** estoy definiendo la contraseña de cifrado,
- **cuando** la confirmo,
- **entonces** veo una advertencia explícita de que perderla implica perder acceso al contenido remoto.

### CA-002.4 — Vincular a vault existente
- **Dado que** la carpeta remota elegida ya contiene un vault sincronizado desde otro dispositivo,
- **cuando** la selecciono,
- **entonces** el asistente me ofrece "vincular a vault existente" en vez de crear uno nuevo.

### CA-002.5 — Error de contraseña incorrecta al vincular
- **Dado que** vinculo a un vault remoto existente con una contraseña de cifrado distinta a la original,
- **cuando** el plugin intenta descifrar el primer archivo,
- **entonces** veo un error explícito y la configuración no se completa.

### CA-002.6 — Activación tras completar todos los pasos
- **Dado que** completé Dropbox, cifrado y carpeta remota,
- **cuando** termino el asistente,
- **entonces** el sync automático queda habilitado.
