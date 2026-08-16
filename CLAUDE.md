# Instrucciones del Proyecto — ClearSync

<!--
  ¿Qué? Archivo de instrucciones para Claude Code y colaboradores del proyecto.
  ¿Para qué? Define las reglas, convenciones, tecnologías y estándares que se
  deben seguir en cada archivo, commit y decisión técnica del proyecto.
  ¿Impacto? Garantiza consistencia y calidad en todo el código y documentación generados.
-->

---

## 1. Identidad del Proyecto

| Campo              | Valor                                                                                                                                                                                                                                                                  |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Nombre**         | ClearSync                                                                                                                                                                                                                                                              |
| **ID/manifest**    | `obsidian-clearsync`                                                                                                                                                                                                                                                   |
| **Tipo**           | Plugin open source para Obsidian                                                                                                                                                                                                                                       |
| **Propósito**      | Sincronizar vaults de Obsidian entre dispositivos vía Dropbox (y proveedores futuros), con cifrado end-to-end, detección de cambios por hash y merge automático de conflictos de texto                                                                                 |
| **Por qué existe** | Alternativas actuales: una de pago (código cerrado, sin transparencia de conflictos) y una gratuita sin mantenimiento hace 2 años. Ninguna resuelve bien: detección de cambios confiable, pérdida silenciosa de datos, cifrado E2E real, visibilidad de estado de sync |
| **Fase actual**    | Documentación (RFs/RNFs/HUs/restricciones) antes de escribir código — ver `docs/es/requisitos/` (español) y `docs/en/requisitos/` (inglés)                                                                                                                             |
| **Licencia**       | MIT                                                                                                                                                                                                                                                                    |

---

## 2. Stack Tecnológico

| Tecnología            | Propósito                                                    |
| --------------------- | ------------------------------------------------------------ |
| TypeScript (estricto) | Lenguaje del plugin, tipado por `obsidian.d.ts`              |
| Obsidian Plugin API   | Vault, eventos de archivos, panel de Settings, manifest.json |
| esbuild               | Bundler/build del plugin (estándar de la comunidad Obsidian) |
| pnpm                  | Gestor de paquetes exclusivo                                 |
| ESLint + Prettier     | Linter y formatter                                           |
| Vitest                | Tests unitarios (lógica de hashing, merge, cifrado)          |
| Dropbox API v2        | Proveedor de sync del MVP (OAuth2 + PKCE)                    |

Detalle completo de restricciones técnicas en [`docs/es/requisitos/restricciones.md`](docs/es/requisitos/restricciones.md) ([EN](docs/en/requisitos/restricciones.md)).

---

## 3. Convenciones

### 3.1 Idioma

- Código (variables, funciones, clases, nombres de archivo, commits, ramas): **inglés**.
- Documentación pública (`docs/`, README): **bilingüe**, árboles espejo `docs/es/` y `docs/en/` — todo doc nuevo se crea en ambos idiomas antes de darse por terminado.
- Instrucciones internas de agente y bitácoras (`CLAUDE.md`, `AUDITORIA.md`, `BITACORA.md`) y comentarios/docstrings en código: **español**.
- Interfaz de usuario del plugin (i18n): **español + inglés**, sin textos hardcodeados — todo string visible pasa por el sistema de i18n.

### 3.2 Commits

Conventional Commits, con cuerpo que explique **qué**, **para qué** e **impacto** del cambio.

### 3.2b Ramas

Flujo `feature/* → develop → main`:

- `main` — solo releases estables (tags de versión, ver `ROADMAP.md`). Nunca se commitea directo acá.
- `develop` — rama default del repo, integra features terminadas. Base de todo `feature/*` nuevo.
- `feature/<rf-o-tema>` — una por RF/tarea (ej. `feature/rf-001-dropbox-auth`), sale de `develop`, vuelve a `develop` vía PR.

`develop → main` solo al cerrar un milestone del roadmap (v0.1, v0.2, ...), no por cada feature.

### 3.3 Documentación de requisitos

Todo cambio funcional relevante debe tener su RF/RNF/HU correspondiente en `docs/{es,en}/requisitos/` **antes** de implementarse — ambos idiomas, no solo español. Formato: ver ejemplos existentes en esa carpeta (tabla de identificación + descripción + criterios).

### 3.4 Seguridad

- Ningún secreto (tokens Dropbox, claves derivadas) se hardcodea ni se loguea.
- Toda decisión de seguridad se contrasta contra [`docs/es/conceptos/owasp-top-10.md`](docs/es/conceptos/owasp-top-10.md) ([EN](docs/en/conceptos/owasp-top-10.md)).
- El contenido del vault se cifra localmente (E2E) antes de salir del dispositivo — ver RF-005 y RNF-001.

### 3.5 Arquitectura

- Todo proveedor de sync implementa la interfaz `SyncProvider` (patrón Strategy) — no acoplar lógica de negocio a Dropbox directamente. Ver [`docs/es/referencia-tecnica/architecture.md`](docs/es/referencia-tecnica/architecture.md) ([EN](docs/en/referencia-tecnica/architecture.md)).
- Sin backend propio: el plugin es cliente puro, el "servidor" es la cuenta de nube del usuario.

---

## 4. Qué NO hacer

- No agregar dependencias de gestión de paquetes distintas a pnpm.
- No usar mtime como única señal de cambio (usar hash de contenido — ver `docs/{es,en}/referencia-tecnica/sync-engine.md`).
- No implementar last-write-wins silencioso — todo conflicto real debe quedar visible o resuelto por merge automático explícito.
- No subir contenido sin cifrar.
- No hardcodear strings de UI — deben pasar por i18n es/en.
