# Patrones arquitectónicos usados en ClearSync

<!--
  ¿Qué? Los patrones de diseño de software que estructuran el plugin.
  ¿Para qué? Justificar decisiones de arquitectura con vocabulario compartido, no solo "porque sí".
  ¿Impacto? Sin estos patrones, Sync Engine terminaría acoplado a Dropbox y RT-004/RNF-004.4 se romperían en la práctica.
-->

---

## Strategy — `SyncProvider`

El proveedor de sync (Dropbox en el MVP) se implementa detrás de una interfaz `SyncProvider` con un contrato común (`upload`, `download`, `listChanges`, `delete`, etc.). El Sync Engine solo conoce esa interfaz, nunca la API concreta de Dropbox.

**Por qué:** permite agregar WebDAV/S3/Google Drive (RF futuro) implementando un nuevo `SyncProvider` sin tocar Sync Engine, Crypto Layer ni Conflict Resolver (RT-004, RNF-004.4).

## Adapter — traducción de la API de Dropbox

`DropboxProvider` actúa como adapter entre la semántica específica de Dropbox API v2 (cursores de paginación, `content_hash` propio, códigos de error particulares) y el contrato genérico de `SyncProvider` que espera el resto del sistema.

**Por qué:** aísla los detalles de una API externa concreta en un solo módulo, en vez de filtrarlos por todo el codebase.

## Observer — eventos del Vault

El Sync Engine se suscribe a los eventos de `app.vault.on('create' | 'modify' | 'delete' | 'rename', callback)` de Obsidian para reaccionar a cambios locales sin tener que hacer polling constante del sistema de archivos.

**Por qué:** es el mecanismo nativo que expone la Obsidian Plugin API — reutilizarlo evita reinventar detección de cambios a nivel de archivo (RT-002).

## Repository — estado local (Hash Cache / Sync Log)

El acceso a la Hash Cache y al Sync Log (RF-002, RF-007) se encapsula detrás de un módulo de persistencia dedicado, en vez de que Sync Engine llame directamente a `this.saveData()`.

**Por qué:** permite cambiar el mecanismo de almacenamiento local en el futuro (ej. mover de `saveData()` a IndexedDB si el log crece mucho) sin tocar la lógica de negocio de Sync Engine (RNF-005.3).
