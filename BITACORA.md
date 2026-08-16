# Bitácora del proyecto — ClearSync

<!--
  ¿Qué? Registro cronológico del avance del proyecto.
  ¿Para qué? Dar contexto temporal a quien retome el proyecto después de una pausa.
  ¿Impacto? Sin esto, es difícil reconstruir en qué orden y por qué se tomaron las decisiones documentadas en AUDITORIA.md.
-->

Este documento es solo en español (instrucciones internas / bitácora técnica, ver `CLAUDE.md` § 3.1).

---

## 2026-08-15 — Inicio del proyecto

- Entrevista de arquitectura inicial: alcance MVP (Dropbox-only), estrategia de sync (hash + three-way merge, sin CRDT), cifrado E2E obligatorio, plataformas (desktop-only v1), licencia (MIT), nombre (ClearSync).
- Repo creado y publicado en GitHub: `ergrato-dev/obsidian-clearsync` (público).
- `CLAUDE.md`, `LICENSE` (MIT), `docs/{es,en}/requisitos/restricciones.md`, `docs/{es,en}/requisitos/RNFs/RNF-001..006` (seguridad, rendimiento, usabilidad, compatibilidad, mantenibilidad, disponibilidad).
- Ajuste: cobertura de tests mínima 85% agregada a RNF-005.1 y restricciones (RH-003).
- Ajuste: documentación bilingüe es/en decidida — reestructuración a árboles espejo `docs/es/` y `docs/en/`.
- `README.md` principal bilingüe + `assets/banner.svg` (tema oscuro plano, sin degradados, sans-serif, acento violeta `#7c3aed`) — verificado renderizando localmente con `resvg-cli`.
- RD-001..003 (restricciones de diseño visual) agregadas a `restricciones.md`.

## 2026-08-16 — Requisitos funcionales, historias de usuario, referencia técnica

- `docs/{es,en}/requisitos/RFs/RF-001..RF-012`: autenticación Dropbox, detección de cambios por hash, merge de tres vías, conflictos binarios, cifrado E2E, configuración inicial, estado/log de sync, exclusiones selectivas, backoff de rate-limiting, restauración/rollback, i18n de UI, soporte mobile (futuro).
- `docs/{es,en}/requisitos/HUs/HU-001..HU-007`: una historia de usuario por cada RF con journey de usuario final directo (RF-002, RF-009 y RF-012 quedan sin HU por ser comportamiento interno/futuro).
- `docs/{es,en}/referencia-tecnica/`: `architecture.md` (diagrama de componentes), `api-plugin-obsidian.md` (superficie de la Obsidian Plugin API), `sync-engine.md` (algoritmo de hashing/merge/backoff), `design-system.md` (alcance de RD-001..003, aclarando que no aplica a la Settings UI dentro de Obsidian).
- `docs/{es,en}/conceptos/`: `owasp-top-10.md` (mapeo al dominio del plugin), `patrones-arquitectonicos.md` (Strategy, Adapter, Observer, Repository).
- `docs/{es,en}/setup/desarrollo.md`: flujo previsto de entorno de desarrollo (symlink a vault de prueba, watch mode, tests, lint).
- `AUDITORIA.md`, `BITACORA.md`, skills en `.claude/skills/` (`new-rf`, `new-sync-provider`, `security-review`, `commit-message`).
- **Cierre de la fase de documentación** — próximo paso: implementación de código, empezando por el andamiaje del proyecto (`package.json`, `manifest.json`, `esbuild.config.mjs`) según `docs/es/requisitos/restricciones.md`.

## 2026-08-16 (cont.) — Andamiaje de código y RF-001

- Andamiaje v0.1: `package.json`/pnpm-lock, `manifest.json`, `versions.json`, `tsconfig.json`, `esbuild.config.mjs`, `eslint.config.mjs`, `vitest.config.ts` (gate 85%), `src/main.ts`, `src/i18n/`, `src/settings/`, `src/sync/SyncProvider.ts` (contrato Strategy, sin implementación Dropbox todavía). TypeScript bajado de 7.0 a 5.9 (typescript-eslint aún no soporta TS7).
- Adoptado flujo de ramas `feature/* → develop → main` (`CLAUDE.md` § 3.2b); `develop` es la rama default en GitHub. Topics agregados al repo para descubribilidad.
- RF-001 (autenticación Dropbox, OAuth2 + PKCE) implementado en `feature/rf-001-dropbox-auth`: `src/auth/{pkce,dropboxOAuth,CallbackServer,TokenStore,DropboxAuthManager,dropboxConfig}.ts` + `src/storage/PluginDataStore.ts` (Repository genérico para `data.json`, evita que settings/tokens se pisen entre sí). 29 tests, 95.6% cobertura. Pendiente: el maintainer debe registrar la app en Dropbox App Console y reemplazar `DROPBOX_CLIENT_ID` en `dropboxConfig.ts` antes de que el flujo funcione contra la API real.
- README: agregado disclaimer de estado pre-alfa / sin afiliación con Dropbox u Obsidian (es+en).
- PR #1 (RF-001 → develop) abierto, bloqueado para merge automático por el clasificador de auto mode — queda pendiente que el usuario lo mergee manualmente.
- RF-002 (detección de cambios por hash) implementado en `feature/rf-002-hash-change-detection` (apilada sobre la rama de RF-001, porque `HashCache` depende de `PluginDataStore`): `src/sync/{hashing,changeDetection,HashCache}.ts`. Los propios tests encontraron y corrigieron un bug real: comparar solo contra `baseHash` clasificaba como conflicto el caso de contenido idéntico creado independientemente en ambos lados sin base común — ver `AUDITORIA.md`. `sync-engine.md` (es+en) actualizado con el algoritmo corregido. 49 tests, 97.67% cobertura. Sin uso de Node `fs`/mtime en ningún punto (RT-002, RT-006).

## 2026-08-16 (cont. 2) — RF-005/006/007/009 + RF-013/014 documentados

- RF-005 (cifrado E2E), RF-006 (setup wizard), RF-007 (estado/log), RF-009 (backoff) implementados en ramas apiladas sucesivas (`feature/rf-005-e2e-encryption` → `.../rf-006-setup-wizard` → `.../rf-007-status-log` → `.../rf-009-backoff`), cada una con su PR contra la anterior (#4, #5, #6, #7 — ninguno mergeado todavía salvo #1/#3 que ya están en `develop`). Detalle completo de cada uno en las entradas de arriba de esas ramas y en sus respectivos PRs. RF-009 quedó **Implementado** de verdad (conectado a las llamadas reales de RF-001 vía `withBackoff`), los otros cuatro "en progreso" (bloqueados en un `SyncProvider`/Sync Engine real).
- Al terminar RF-009, quedó claro que v0.1 no sincroniza nada de verdad todavía — faltaba una pieza no listada en RF-001..012 original. Documentados **RF-013** (`DropboxProvider`, implementación concreta de `SyncProvider`) y **RF-014** (Sync Engine, el orquestador del ciclo — v0.1 sin resolución de conflictos, esa es v0.2) en rama `docs/rf-013-014-sync-engine`. Solo documentación (RO-003), sin implementar. `ROADMAP.md` (es/en) actualizado: v0.1 ahora lista 8 RFs, con RF-009 tildado.
