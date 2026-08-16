# Auditoría de decisiones técnicas — ClearSync

<!--
  ¿Qué? Registro de decisiones técnicas relevantes y su justificación.
  ¿Para qué? Que nadie tenga que adivinar "por qué se hizo así" leyendo solo el código.
  ¿Impacto? Sin esto, decisiones no obvias (ej. por qué no CRDT) se re-discuten innecesariamente con cada colaborador nuevo.
-->

Este documento es solo en español (instrucciones internas / bitácora técnica, ver `CLAUDE.md` § 3.1).

---

## 2026-08-15 — Detección de cambios: hash de contenido, no mtime

**Decisión:** usar SHA-256 sobre el contenido del archivo como señal de cambio, nunca `mtime`.

**Por qué:** `mtime` varía entre sistemas de archivos y dispositivos, y es la causa raíz de falsos conflictos y syncs perdidos en plugins existentes. El hash de contenido es determinista independientemente del SO o filesystem.

**Alternativas descartadas:** confiar en `mtime` + tamaño de archivo (heurística usada por varios plugins actuales) — descartada por no ser confiable entre plataformas.

---

## 2026-08-15 — Merge: three-way automático para texto, sin CRDT

**Decisión:** three-way merge (diff3) para archivos de texto cuando no hay overlap real; sin motor CRDT/vector-clock.

**Por qué:** el caso de uso típico es desktop-only, single-writer-a-la-vez. Un motor CRDT (como el que usa Livesync sobre PouchDB) agrega complejidad y consumo de CPU/batería significativos para un beneficio marginal en este escenario. El diferenciador real reportado por usuarios es "no perder cambios silenciosamente", no "resolver ediciones simultáneas en tiempo real byte a byte".

**Alternativas descartadas:** CRDT/vector-clock (Livesync/PouchDB) — descartada por complejidad/costo de recursos desproporcionado al problema real.

---

## 2026-08-15 — Cifrado E2E obligatorio desde v1 (no opcional)

**Decisión:** cifrado end-to-end (AES-256-GCM) obligatorio, no configurable como opt-out.

**Por qué:** es la deficiencia #1 reportada contra plugins actuales — hacerlo opcional diluye el diferenciador principal y crea dos clases de usuarios (protegidos / no protegidos) que complica soporte y percepción de seguridad del proyecto.

---

## 2026-08-15 — MVP: Dropbox-only, con interfaz `SyncProvider` desde el día uno

**Decisión:** un solo proveedor implementado en v1 (Dropbox), pero detrás de una interfaz abstracta desde el inicio.

**Por qué:** implementar múltiples proveedores desde v1 retrasa la entrega sin validar primero si el enfoque de merge/cifrado funciona bien en la práctica. La interfaz `SyncProvider` evita que ese MVP se convierta en deuda técnica cuando se agregue el segundo proveedor.

---

## 2026-08-15 — Documentación bilingüe (es/en) en árboles espejo

**Decisión:** `docs/es/` y `docs/en/` como árboles paralelos completos, en vez de sufijos de archivo o un único archivo con ambos idiomas.

**Por qué:** escala mejor a idiomas adicionales futuros, evita archivos gigantes con ambos idiomas mezclados, y es más fácil de mantener sincronizado (un archivo = un idioma = un diff claro por PR).

**Alcance:** aplica a `docs/` y `README.md`. `CLAUDE.md`, `AUDITORIA.md` y `BITACORA.md` quedan solo en español por ser instrucciones internas de agente / bitácora técnica, no documentación de cara al usuario final.

---

## 2026-08-16 — RD-001..003 (diseño visual) no aplican a la Settings UI dentro de Obsidian

**Decisión:** el tema oscuro plano y el acento violeta (`#7c3aed`) son solo para assets de marca (banner, ícono). La Settings UI del plugin hereda el tema activo del usuario en Obsidian vía variables CSS nativas.

**Por qué:** forzar un tema propio dentro del panel de Settings de Obsidian rompe la coherencia visual del host y es mala práctica en la comunidad de plugins. Ver `docs/es/referencia-tecnica/design-system.md`.

---

## 2026-08-16 — `classifyChange` compara hashes directos antes que histórico

**Decisión:** en `src/sync/changeDetection.ts`, comparar `localHash === remoteHash` primero; solo si difieren, consultar `baseHash`.

**Por qué:** los tests (`tests/changeDetection.test.ts`) encontraron que comparar únicamente contra `baseHash` clasifica como "conflicto" el caso de dos dispositivos que crean el mismo contenido de forma independiente sin base común todavía (ej. primer sync de un vault ya idéntico en ambos lados). Comparar primero contra el valor actual del otro lado es más fuerte que comparar contra el histórico. `docs/{es,en}/referencia-tecnica/sync-engine.md` se actualizó para reflejar el algoritmo corregido.

**Alcance no cubierto:** esta clasificación (RF-002) no distingue "el archivo nunca existió de este lado" de "el archivo se borró de este lado" — ambos casos aparecen como hash `undefined`. Propagación de borrado queda pendiente como RF futuro.

## 2026-08-16 — PBKDF2 600.000 iteraciones + `Uint8Array<ArrayBuffer>` explícito

**Decisión:** 600.000 iteraciones PBKDF2-HMAC-SHA256 (guía OWASP 2023 vigente); IV de 12 bytes para AES-GCM (recomendación NIST SP 800-38D); tipar `salt`/`iv` como `Uint8Array<ArrayBuffer>` en vez de `Uint8Array` a secas.

**Por qué:** `tsc` rechazaba pasar un `Uint8Array` (tipo por defecto, potencialmente respaldado por `SharedArrayBuffer` en los tipos de lib actuales) donde la Web Crypto API espera `BufferSource`. La opción rápida era castear con `as BufferSource` en cada call site; se prefirió tipar la fuente (`generateSalt()`, el campo `iv` de `EncryptedPayload`) para que el tipo correcto se propague solo, sin casteos dispersos.

**Rendimiento:** 600k iteraciones no volvieron lenta la suite de tests (68 tests, ~1.5s total) — Node/Electron usan la implementación nativa de Web Crypto.

## 2026-08-16 — Cobertura de tests mínima 85%

**Decisión:** cobertura mínima de 85% (líneas/branches) verificada en CI, obligatoria para hashing, merge, cifrado/descifrado y manejo de conflictos.

**Por qué:** son las rutas de código donde un bug corrompe o pierde datos reales del usuario — el costo de un bug silencioso ahí es mucho mayor que en UI.
