# Sistema de diseño — Settings UI

<!--
  ¿Qué? Cómo se aplican las restricciones de diseño visual (RD-001..003) dentro del plugin.
  ¿Para qué? Diferenciar la identidad de marca (assets públicos) del comportamiento correcto de un plugin dentro de Obsidian.
  ¿Impacto? Forzar un tema oscuro dentro del panel de Settings, ignorando el tema del usuario, es un anti-patrón que rompe la experiencia nativa de Obsidian.
-->

---

## Alcance de RD-001..003

Las restricciones de diseño visual (`docs/es/requisitos/restricciones.md`, sección 3) se dividen en dos alcances distintos:

| Alcance                            | Dónde aplica                                               | Cómo aplica                                                                                                      |
| ---------------------------------- | ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **Identidad de marca**             | `assets/banner.svg`, ícono del plugin, capturas del README | Tema oscuro plano fijo, acento violeta `#7c3aed`, sin degradados (RD-001, RD-002)                                |
| **Settings UI dentro de Obsidian** | Panel de configuración del plugin                          | Respeta el tema activo del usuario (claro u oscuro) vía variables CSS de Obsidian — **nunca fuerza modo oscuro** |

Un plugin que ignora el tema del host y fuerza su propio tema oscuro dentro del panel de Settings rompe la coherencia visual de Obsidian y es una mala práctica de la comunidad de plugins.

## Settings UI — componentes

Construidos con la API nativa `Setting` de Obsidian (`PluginSettingTab`), que ya hereda el tema activo automáticamente:

- **Sección Cuenta** — estado de conexión Dropbox, botón conectar/desconectar (RF-001).
- **Sección Cifrado** — definir/cambiar contraseña de cifrado, advertencia de pérdida de acceso (RF-005, RF-006).
- **Sección Sync** — carpeta remota, patrones de exclusión (RF-008), botón "Sincronizar ahora".
- **Sección Idioma** — selector Automático/Español/English (RF-011).
- **Panel de Log** — historial de operaciones de sync (RF-007), con estados de color usando variables semánticas de Obsidian (`--text-success`, `--text-error`, `--text-warning`), no colores hardcodeados.

## Ícono de barra de estado

Ícono monocromático simple (idle/syncing/error/conflict) que usa `currentColor`/variables de Obsidian para heredar el color de texto del tema activo — el acento violeta de marca (`#7c3aed`) se reserva para elementos que sí son "marca" (ej. un ícono de badge en el README, no la UI funcional dentro de Obsidian).

## Tipografía

Toda la Settings UI usa la tipografía del tema activo de Obsidian (heredada, sin `font-family` propio) — cumple RD-003 (sans-serif) porque prácticamente todos los temas de Obsidian usan sans-serif por defecto, y el plugin no debe imponer una fuente distinta a la del resto de la aplicación.
