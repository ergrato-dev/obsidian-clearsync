# OWASP Top 10 aplicado a ClearSync

<!--
  ¿Qué? Mapeo del OWASP Top 10 (2021) al dominio de un plugin cliente de sync cifrado.
  ¿Para qué? Que cada decisión de seguridad se pueda contrastar contra una checklist reconocida, no solo intuición.
  ¿Impacto? La mayoría de las categorías OWASP asumen un backend — acá hay que reinterpretarlas para un cliente puro (RO-004).
-->

---

## A01 — Broken Access Control (Control de acceso roto)

No hay backend propio con roles/permisos que romper (RO-004). El equivalente aquí es: acceso al contenido descifrado depende exclusivamente de la contraseña de cifrado del usuario (RF-005). Mitigación: la clave nunca se deriva ni se cachea de forma que sobreviva sin la contraseña activa.

## A02 — Cryptographic Failures (Fallas criptográficas)

**La categoría más relevante del proyecto.** Mitigado por RF-005: AES-256-GCM, derivación de clave con PBKDF2/scrypt, salt único por vault, nunca se sube contenido sin cifrar (RT-005, RS-004). Ver `docs/es/referencia-tecnica/sync-engine.md` para dónde exactamente ocurre el cifrado en el pipeline.

## A03 — Injection (Inyección)

Sin SQL ni shell en el cliente. Superficie real: nombres de archivo/rutas recibidos del proveedor remoto podrían usarse para path traversal al escribir en el Vault local. Mitigación: toda ruta remota se normaliza y valida contra el alcance del vault antes de usarse en `app.vault.create()`/`modify()`.

## A04 — Insecure Design (Diseño inseguro)

Mitigado estructuralmente por el flujo documentación-primero (RO-003): ningún RF se implementa sin especificar su modelo de amenaza. El modelo de amenaza central del proyecto — "el proveedor de nube no es confiable" (RS-004) — es una decisión de diseño explícita, no un parche posterior.

## A05 — Security Misconfiguration (Configuración de seguridad incorrecta)

Relevante en el scope de permisos solicitados a la app de Dropbox: se debe pedir el mínimo scope necesario (ej. `files.content.write`/`files.content.read` sobre la carpeta de la app), nunca acceso completo a la cuenta, siguiendo principio de menor privilegio.

## A06 — Vulnerable and Outdated Components (Componentes vulnerables)

Mitigado por RH-001/002 (pnpm, dependencias mínimas) y por mantener actualizado el lockfile. Recomendado: Dependabot o equivalente habilitado en el repo una vez exista `package.json`.

## A07 — Identification and Authentication Failures (Fallas de autenticación)

Mitigado por RF-001: OAuth2 + PKCE (sin client secret embebido), sin Implicit Grant, tokens nunca hardcodeados ni logueados (RS-001), renovación vía refresh token.

## A08 — Software and Data Integrity Failures (Fallas de integridad)

Mitigado por RF-002 (hash de contenido para detectar cambios) y RF-003/RF-004 (ningún conflicto se resuelve sobrescribiendo silenciosamente). A futuro: firmar/verificar los artefactos de release antes de publicar en el directorio de community plugins.

## A09 — Security Logging and Monitoring Failures (Fallas de logging y monitoreo)

Adaptado al contexto cliente: no hay monitoreo centralizado (no hay servidor, RO-004), pero sí un log local visible para el usuario (RF-007) que cumple el mismo propósito — ninguna operación de sync ocurre sin dejar rastro.

## A10 — Server-Side Request Forgery (SSRF)

No aplica — no hay componente server-side en el proyecto (RO-004).
