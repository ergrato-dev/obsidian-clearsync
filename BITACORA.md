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
