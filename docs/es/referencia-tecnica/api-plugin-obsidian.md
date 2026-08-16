# Superficie de la Obsidian Plugin API usada — ClearSync

<!--
  ¿Qué? Qué partes concretas de la Obsidian Plugin API usa (o usará) el plugin.
  ¿Para qué? Delimitar la superficie de API para no depender de nada fuera de lo documentado (RT-002).
  ¿Impacto? Usar una API no listada aquí sin actualizar este documento rompe la trazabilidad de RO-003.
-->

> Nota: los nombres exactos de clases/métodos deben verificarse contra `obsidian.d.ts` de la versión de Obsidian vigente al implementar — este documento fija la intención, no es código final.

---

## Ciclo de vida del plugin

| API                                   | Uso en ClearSync                                                                |
| ------------------------------------- | ------------------------------------------------------------------------------- |
| `Plugin.onload()`                     | Registra Settings tab, status bar item, listeners del Vault, inicia Sync Engine |
| `Plugin.onunload()`                   | Detiene listeners y cualquier sync en curso de forma limpia                     |
| `this.saveData()` / `this.loadData()` | Persistencia de tokens OAuth (RS-002), hash cache, configuración de exclusiones |

## Vault

| API                                                                    | Uso en ClearSync                                                       |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `app.vault.getFiles()` / `getAbstractFileByPath()`                     | Recorrido inicial del vault para el primer sync (RF-002, RF-006)       |
| `app.vault.read()` / `app.vault.cachedRead()`                          | Lectura de contenido para hashear/cifrar                               |
| `app.vault.create()` / `modify()` / `delete()`                         | Aplicar cambios remotos localmente, crear copias conflictivas (RF-004) |
| `app.vault.on('create' \| 'modify' \| 'delete' \| 'rename', callback)` | Disparadores reactivos para el Sync Engine (patrón Observer)           |

## UI

| API                            | Uso en ClearSync                                                                      |
| ------------------------------ | ------------------------------------------------------------------------------------- |
| `PluginSettingTab` + `Setting` | Panel de Settings: cuenta, cifrado, exclusiones, idioma, log (RF-006, RF-008, RF-011) |
| `Plugin.addStatusBarItem()`    | Ícono de estado idle/syncing/error/conflict (RF-007)                                  |
| `Notice`                       | Notificaciones de error/conflicto (RF-007)                                            |

## Red

| API            | Uso en ClearSync                                                                                                 |
| -------------- | ---------------------------------------------------------------------------------------------------------------- |
| `requestUrl()` | Llamadas a la API de Dropbox — evita restricciones CORS del `fetch` estándar dentro de Obsidian (RF-001, RF-009) |

## Manifest y compatibilidad

| Campo (`manifest.json`) | Uso                                                                      |
| ----------------------- | ------------------------------------------------------------------------ |
| `id`                    | `clearsync`                                                              |
| `minAppVersion`         | Versión mínima soportada de Obsidian (RNF-004.3), a fijar al implementar |
| `isDesktopOnly`         | `true` en v1 (RNF-004.1, RF-012 es futuro)                               |

## Fuera de alcance explícito

- Sin acceso a Node.js `fs`/`path`/`child_process` — toda I/O pasa por `Vault`/`Adapter` (RT-002).
- Sin `fetch()` directo para llamadas a Dropbox — se usa `requestUrl()` de Obsidian.
