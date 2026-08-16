<p align="center">🇪🇸 <a href="#español">Español</a> &nbsp;·&nbsp; 🇬🇧 <a href="#english">English</a></p>

---

## Español

# Roadmap

Sin fechas comprometidas. El orden de versiones refleja dependencias reales entre RFs, no un calendario fijo. Estado detallado de cada RF: ver su campo "Estado" en `docs/es/requisitos/RFs/` y `BITACORA.md`.

### v0.1 — Núcleo de sync (MVP)

Sync completo, cifrado, con Dropbox — sin resolución de conflictos avanzada todavía. Un ítem tildado significa que el RF está implementado y testeado, no que v0.1 completo ya sincroniza de punta a punta — eso requiere RF-013 y RF-014 también tildados.

- [ ] RF-001 — Autenticación con Dropbox (OAuth2 + PKCE)
- [ ] RF-002 — Detección de cambios por hash de contenido
- [ ] RF-005 — Cifrado end-to-end
- [ ] RF-006 — Configuración inicial y vinculación del vault
- [ ] RF-007 — Estado y log de sincronización visible en UI
- [x] RF-009 — Manejo de rate-limiting y backoff
- [ ] RF-013 — Implementación de DropboxProvider
- [ ] RF-014 — Sync Engine: orquestador del ciclo de sync (sin resolución de conflictos)

### v0.2 — Resolución de conflictos

El diferenciador central del proyecto: nunca más pérdida silenciosa de datos.

- [ ] RF-003 — Merge automático de tres vías para texto
- [ ] RF-004 — Resolución de conflictos en binarios/adjuntos
- [ ] RF-010 — Restauración/rollback desde versión conflictiva

### v0.3 — Configurabilidad y accesibilidad de idioma

- [ ] RF-008 — Exclusión selectiva de archivos/carpetas
- [ ] RF-011 — Interfaz bilingüe español/inglés (i18n)

### v1.0 — Release estable

- [ ] Cobertura de tests ≥85% en todos los módulos (RNF-005.1)
- [ ] Revisión de seguridad completa (checklist OWASP, skill `security-review`)
- [ ] Publicación en el directorio oficial de community plugins de Obsidian

### Más adelante (sin RF aprobado aún)

- RF-012 — Soporte mobile (iOS/Android), documentado como futuro desde v1
- Proveedores adicionales detrás de `SyncProvider`: WebDAV, S3, Google Drive (RT-004, RNF-004.4)

### Cómo se agregan ítems a este roadmap

Ningún ítem se agrega sin su RF documentado y aprobado primero (RO-003). Ver skill `new-rf` en `.claude/skills/`.

---

## English

# Roadmap

No committed dates. Version ordering reflects real dependencies between RFs, not a fixed calendar. Per-RF detail: see each one's "Status" field under `docs/en/requisitos/RFs/` and `BITACORA.md`.

### v0.1 — Sync core (MVP)

Full encrypted sync with Dropbox — no advanced conflict resolution yet. A checked item means that RF is implemented and tested, not that all of v0.1 already syncs end to end — that also needs RF-013 and RF-014 checked.

- [ ] RF-001 — Dropbox authentication (OAuth2 + PKCE)
- [ ] RF-002 — Content-hash change detection
- [ ] RF-005 — End-to-end encryption
- [ ] RF-006 — Initial setup and vault linking
- [ ] RF-007 — Sync status and log visible in the UI
- [x] RF-009 — Rate-limiting and backoff handling
- [ ] RF-013 — DropboxProvider implementation
- [ ] RF-014 — Sync Engine: sync cycle orchestrator (no conflict resolution)

### v0.2 — Conflict resolution

The project's core differentiator: never lose data silently again.

- [ ] RF-003 — Automatic three-way merge for text
- [ ] RF-004 — Binary/attachment conflict resolution
- [ ] RF-010 — Restore/rollback from a conflicted version

### v0.3 — Configurability and language accessibility

- [ ] RF-008 — Selective file/folder exclusion
- [ ] RF-011 — Bilingual Spanish/English interface (i18n)

### v1.0 — Stable release

- [ ] ≥85% test coverage across all modules (RNF-005.1)
- [ ] Full security review (OWASP checklist, `security-review` skill)
- [ ] Submission to the official Obsidian community plugins directory

### Later (no approved RF yet)

- RF-012 — Mobile support (iOS/Android), documented as future work since v1
- Additional providers behind `SyncProvider`: WebDAV, S3, Google Drive (RT-004, RNF-004.4)

### How items get added to this roadmap

No item is added without its RF documented and approved first (RO-003). See the `new-rf` skill under `.claude/skills/`.
