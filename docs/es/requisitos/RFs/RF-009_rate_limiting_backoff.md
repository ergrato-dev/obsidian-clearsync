# RF-009 — Manejo de rate-limiting y backoff de la API de Dropbox

<!--
  ¿Qué? Requisito funcional sobre cómo el plugin reacciona ante límites de tasa o errores transitorios de Dropbox.
  ¿Para qué? Un reintento agresivo agrava el rate-limit y puede bloquear al usuario de la API por más tiempo.
  ¿Impacto? Sin backoff, un vault grande con muchos archivos puede fallar en cadena durante el primer sync completo.
-->

---

## Identificación

| Campo         | Valor                                                  |
| ------------- | ------------------------------------------------------ |
| **ID**        | RF-009                                                 |
| **Nombre**    | Manejo de rate-limiting y backoff de la API de Dropbox |
| **Módulo**    | Sync Engine / Resiliencia                              |
| **Prioridad** | Media                                                  |
| **Estado**    | Implementado (pasos 1-4) — `src/net/{backoff,withBackoff}.ts`, ya conectado a las llamadas reales de RF-001. Paso 5 ("resto del ciclo no se bloquea por un archivo") no aplica todavía: no existe un ciclo de sync multi-archivo (Sync Engine) al que aplicarlo |
| **Fecha**     | Agosto 2026                                            |

---

## Descripción

Ante respuestas de rate-limit (429) o errores transitorios (5xx) de la API de Dropbox, el plugin debe reintentar con backoff exponencial en vez de fallar o reintentar agresivamente.

---

## Entradas

Respuestas HTTP de la API de Dropbox durante el ciclo de sync.

---

## Proceso

1. Cada request a la API de Dropbox pasa por un wrapper que intercepta códigos 429/5xx.
2. Ante 429, se respeta el header `Retry-After` si está presente; si no, se aplica backoff exponencial con jitter.
3. Ante 5xx, se reintenta hasta un máximo de intentos configurado, con backoff exponencial.
4. Si se agotan los reintentos, la operación falla de forma visible (RF-007), nunca silenciosa.
5. El resto del ciclo de sync no se bloquea por un archivo individual que esté reintentando — se continúa con otros archivos cuando es posible.

---

## Salidas

| Escenario                | Resultado                                                                                |
| ------------------------ | ---------------------------------------------------------------------------------------- |
| Rate-limit transitorio   | El sync se completa igual, con demora, sin intervención del usuario                      |
| Fallo persistente de API | Error visible en log/estado; el sync de ese archivo queda pausado hasta el próximo ciclo |

---

## APIs / Componentes involucrados

- SyncProvider (implementación Dropbox), capa HTTP con retry/backoff

---

## Reglas de negocio

- RN-001: Nunca se reintenta sin backoff ante un 429 — agrava el rate-limit.
- RN-002: El número máximo de reintentos y el backoff base son configurables, con valores por defecto documentados en `docs/{es,en}/referencia-tecnica/sync-engine.md`.
