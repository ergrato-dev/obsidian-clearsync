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
- PR #1 mergeado a `develop`. PR #2 quedó cerrado automáticamente por GitHub al borrarse su rama base (`feature/rf-001-dropbox-auth`, borrada al mergear #1 con `--delete-branch`) — reemplazado por PR #3 (mismo commit, contra `develop` directo), que sí se mergeó. Lección: con ramas apiladas, no usar `--delete-branch` hasta que la rama dependiente ya haya sido retargeteada.
- `develop` y `main` protegidas en GitHub (PR obligatorio, sin force-push ni borrado) a pedido del usuario, tras el banner nativo de GitHub sugiriéndolo.
- RF-005 (cifrado end-to-end) implementado en `feature/rf-005-e2e-encryption`: `src/crypto/{params,salt,deriveKey,encryption,SaltStore,EncryptionManager}.ts` — AES-256-GCM, PBKDF2 600k iteraciones (SHA-256), salt persistido vía `PluginDataStore`, clave derivada no-extraíble que vive solo en memoria de sesión. `DecryptionError` explícito ante contraseña incorrecta o ciphertext corrupto (nunca contenido corrupto silencioso). Tests cubren el escenario de "segundo dispositivo" de HU-002 CA-002.4/CA-002.5 (misma contraseña+salt → descifra; contraseña distinta → falla explícito). 68 tests totales, 97.48% cobertura. Bug de tipos de TypeScript (`Uint8Array` vs `BufferSource`) resuelto tipando `Uint8Array<ArrayBuffer>` en el origen en vez de castear — ver `AUDITORIA.md`.
- RF-006 (configuración inicial) implementado en `feature/rf-006-setup-wizard` (apilada sobre RF-005): `src/setup/{SetupWizard,passwordConfirmation,vaultLinkMode}.ts` + `SettingsTab.ts` reescrito como wizard real de 3 pasos (conectar Dropbox → contraseña de cifrado → carpeta remota), con `RN-001` (sin activar sync hasta completar los tres) y `RN-002` (contraseña con confirmación + advertencia solo la primera vez, un solo campo al reingresar en sesiones futuras — `EncryptionManager.hasExistingPassword()`). Al implementar el paso "vincular a vault existente" encontré un bug de arquitectura real en RF-005: el salt vivía solo local, rompiendo el descifrado multi-dispositivo — corregido con `SaltStore.set()`/`.has()` y documentado como RN-004 en RF-005 (ver `AUDITORIA.md`). Los pasos 4/5 (detectar vault existente, verificar contraseña contra el remoto) quedan explícitamente bloqueados hasta que exista un `SyncProvider` real. 82 tests totales, 97.7% cobertura.
- RF-007 (estado y log de sync) implementado en `feature/rf-007-status-log` (apilada sobre RF-006): `src/sync/{SyncStatus,SyncLog,statusBarText,formatLogEntry,logSyncEvent}.ts`. Barra de estado ahora reactiva vía `SyncStatus.subscribe()` (antes texto fijo "idle"); panel de log en Settings con rotación a 100 entradas (RN-002). `logSyncEvent()` es el único punto de entrada previsto para loguear, para que RN-001 (ningún fallo sin notificación) no dependa de que cada call site futuro se acuerde de llamar `Notice` — ver `AUDITORIA.md`. Log y estado quedan vacíos/idle hasta que exista un Sync Engine real que los alimente. 94 tests totales, 97.96% cobertura.
- RF-009 (backoff de rate-limiting) implementado en `feature/rf-009-backoff` (apilada sobre RF-007): `src/net/{backoff,withBackoff}.ts`. A diferencia de RF-001/002/005/006/007, este quedó realmente conectado al código en vivo — `DropboxAuthManager` arma un `resilientRequester = withBackoff(obsidianRequester)` y lo usa en las tres llamadas reales a Dropbox (exchange, refresh, cuenta), así que la protección contra 429/5xx ya corre en el flujo de auth de RF-001, no solo en tests aislados. `HttpResponse` de `dropboxOAuth.ts` ganó un campo `headers?` opcional (retrocompatible) para poder leer `Retry-After`. RF-009 marcado **Implementado** (pasos 1-4) — solo el paso 5 (no bloquear el resto del ciclo por un archivo) queda pendiente porque no existe todavía un ciclo de sync multi-archivo al que aplicarlo. 110 tests totales, 97.4% cobertura.
- Con esto, v0.1 del roadmap tiene sus 6 RFs con código real: RF-001/002/005/006/007 en progreso (bloqueados en un `SyncProvider`/Sync Engine real), RF-009 implementado. Siguiente paso natural: construir un `DropboxProvider` real (RT-004) y el orquestador de Sync Engine que conecte todo lo ya construido.
