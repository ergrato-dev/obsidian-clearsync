# Restricciones del Proyecto — ClearSync

<!--
  ¿Qué? Documento que define las restricciones técnicas, organizacionales y de seguridad del proyecto.
  ¿Para qué? Establecer los límites y condiciones no negociables bajo las cuales se desarrolla el plugin.
  ¿Impacto? Violar una restricción puede comprometer la seguridad, portabilidad o adopción del plugin en la comunidad Obsidian.
-->

---

## 1. Restricciones Tecnológicas

### RT-001 — Lenguaje y tipado

El plugin debe desarrollarse en **TypeScript** en modo estricto (`strict: true`). No se permite JavaScript sin tipar.

### RT-002 — Plataforma

El plugin debe implementarse exclusivamente sobre la **Obsidian Plugin API** (`obsidian.d.ts`). No se permite acceso a APIs de Node.js/filesystem fuera de las expuestas por `Vault`/`Adapter` de Obsidian, para no comprometer la futura portabilidad a mobile (RF-012).

### RT-003 — Bundler

El build debe usarse con **esbuild**, siguiendo el patrón estándar de la comunidad de plugins Obsidian (`esbuild.config.mjs`).

### RT-004 — Proveedor de sync del MVP

El MVP debe soportar exclusivamente **Dropbox** (API v2, OAuth2 + PKCE) detrás de la interfaz `SyncProvider`. No se implementan otros proveedores en v1; deben quedar como RF futuro sin bloquear la interfaz.

### RT-005 — Cifrado

El cifrado end-to-end debe implementarse con **AES-256-GCM**, con clave derivada de la contraseña del usuario vía **PBKDF2** o **scrypt** (Web Crypto API, sin librerías de cifrado propias). No se permite subir contenido del vault sin cifrar.

### RT-006 — Detección de cambios

La detección de cambios debe basarse en **hash de contenido** (ej. SHA-256), nunca únicamente en `mtime`. Ver `docs/{es,en}/referencia-tecnica/sync-engine.md`.

---

## 2. Restricciones de Herramientas y Entorno

### RH-001 — Gestor de paquetes

Las dependencias deben gestionarse exclusivamente con **pnpm**. Prohibido `npm` o `yarn`.

### RH-002 — Linter y formatter

**ESLint** + **Prettier**, configuración estándar de plugins Obsidian community.

### RH-003 — Testing

**Vitest** para tests unitarios, obligatorio para: lógica de hashing, three-way merge, cifrado/descifrado, manejo de conflictos. Cobertura mínima **85%**, verificada en CI (ver RNF-005.1).

---

## 3. Restricciones de Diseño Visual

### RD-001 — Prohibición de degradados

Queda prohibido el uso de degradados (`gradient`) en cualquier asset o elemento de interfaz (banner, íconos, Settings UI). Fondos y colores siempre sólidos y planos.

### RD-002 — Tema oscuro por defecto

La identidad visual del proyecto (assets de marca, Settings UI) usa fondo oscuro plano como base, con un único color de acento sólido (violeta `#7c3aed`) — sin paletas múltiples sin justificar.

### RD-003 — Tipografía sans-serif exclusiva

Solo se permiten fuentes de la familia **sans-serif** en cualquier asset o UI del proyecto. Prohibidas fuentes serif u ornamentales; monospace solo permitida en bloques de código.

---

## 4. Restricciones de Idioma

### RI-001 — Código en inglés

Variables, funciones, clases, nombres de archivo/carpeta de código, endpoints internos, mensajes de commit y nombres de rama: **inglés**.

### RI-002 — Documentación bilingüe (español + inglés)

La documentación de cara al proyecto (`docs/`, README) se mantiene en **español e inglés**, en árboles espejo bajo `docs/es/` y `docs/en/`. Las instrucciones internas de agente y bitácoras (`CLAUDE.md`, `AUDITORIA.md`, `BITACORA.md`) quedan solo en español. Comentarios y docstrings en el código: español.

### RI-003 — Interfaz de usuario bilingüe (i18n)

Toda la interfaz visible del plugin (Settings, notificaciones, mensajes de estado) debe soportar **español e inglés** desde v1, sin strings hardcodeados fuera del sistema de i18n. Ver RF-011 y RNF-003.

---

## 5. Restricciones Organizacionales

### RO-001 — Proyecto open source

Licencia **MIT**. Debe ser compatible con el directorio oficial de community plugins de Obsidian.

### RO-002 — Conventional Commits

Todos los commits siguen **Conventional Commits**, con cuerpo que incluya Qué, Para qué e Impacto.

### RO-003 — Documentación antes que código

Ningún RF se implementa sin su documento correspondiente en `docs/{es,en}/requisitos/` revisado y aprobado primero.

### RO-004 — Sin backend propio

El plugin es cliente puro; no se opera infraestructura propia. El "servidor" es la cuenta de nube del usuario (Dropbox u otro proveedor futuro).

---

## 6. Restricciones de Seguridad

### RS-001 — Sin secretos hardcodeados

Tokens OAuth y claves derivadas nunca se hardcodean ni se registran en logs.

### RS-002 — Almacenamiento de tokens

Los tokens de Dropbox se almacenan usando el mecanismo de almacenamiento local del plugin (`this.saveData()` de Obsidian), nunca en texto plano visible en configuración exportable sin cifrar.

### RS-003 — Sin telemetría

El plugin no envía datos de uso ni analytics a servicios de terceros.

### RS-004 — Confidencialidad ante el proveedor de nube

El proveedor de sync (Dropbox u otro) nunca debe recibir contenido del vault sin cifrar — el modelo de amenaza asume que el proveedor de nube no es confiable.
