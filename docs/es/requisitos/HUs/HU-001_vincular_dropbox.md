# HU-001 — Vincular cuenta de Dropbox

<!--
  ¿Qué? Historia de usuario sobre conectar la cuenta de Dropbox desde el plugin.
  ¿Para qué? Es el primer paso obligatorio para que ClearSync pueda operar.
  ¿Impacto? Sin una conexión clara y confiable, el usuario no puede avanzar a ningún otro flujo del plugin.
-->

---

## Identificación

| Campo            | Valor                      |
| ---------------- | -------------------------- |
| **ID**           | HU-001                     |
| **Título**       | Vincular cuenta de Dropbox |
| **Módulo**       | Autenticación              |
| **Prioridad**    | Alta                       |
| **Estado**       | Planificada                |
| **RF asociados** | RF-001                     |

---

## Historia

**Como** usuario de Obsidian,
**quiero** conectar mi cuenta de Dropbox desde la configuración del plugin,
**para** que ClearSync pueda sincronizar mi vault sin que yo maneje tokens manualmente.

---

## Criterios de aceptación

### CA-001.1 — Botón de conexión visible

- **Dado que** abro Settings > ClearSync sin conexión activa,
- **cuando** veo la sección de cuenta,
- **entonces** encuentro un botón "Conectar Dropbox" claramente visible.

### CA-001.2 — Flujo de autorización en navegador

- **Dado que** hago clic en "Conectar Dropbox",
- **cuando** se inicia el flujo,
- **entonces** se abre mi navegador del sistema en la página de autorización de Dropbox.

### CA-001.3 — Confirmación de conexión

- **Dado que** autorizo la app en Dropbox,
- **cuando** vuelvo a Obsidian,
- **entonces** Settings muestra "Conectado como {email}".

### CA-001.4 — Cancelación sin error bloqueante

- **Dado que** cancelo la autorización en Dropbox,
- **cuando** vuelvo a Obsidian,
- **entonces** Settings permanece en "No conectado" sin mensaje de error alarmante.

### CA-001.5 — Desconexión explícita

- **Dado que** ya estoy conectado,
- **cuando** hago clic en "Desconectar",
- **entonces** mis tokens se eliminan localmente y el sync se detiene.

### CA-001.6 — Reconexión tras expiración

- **Dado que** mi sesión expiró y la renovación automática falló,
- **cuando** abro Settings,
- **entonces** veo "Sesión expirada, reconectar" con un botón para volver a autorizar.
