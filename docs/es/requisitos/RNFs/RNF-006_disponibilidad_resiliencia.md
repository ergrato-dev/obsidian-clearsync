# RNF-006 — Disponibilidad y Resiliencia

<!--
  ¿Qué? Requisito no funcional sobre comportamiento ante fallos de red o de la API del proveedor.
  ¿Para qué? Que un fallo de conexión o de Dropbox nunca resulte en pérdida o corrupción de datos del vault.
  ¿Impacto? La confianza del usuario en una herramienta de sync depende enteramente de que nunca pierda datos.
-->

---

## Identificación

| Campo         | Valor                        |
| ------------- | ---------------------------- |
| **ID**        | RNF-006                      |
| **Nombre**    | Disponibilidad y Resiliencia |
| **Categoría** | Confiabilidad                |
| **Prioridad** | Alta                         |
| **Estado**    | Planificado                  |
| **Fecha**     | Agosto 2026                  |

---

## Requisitos

### RNF-006.1 — Tolerancia a desconexión

Si la red falla a mitad de un sync, el estado local del vault no se corrompe; el sync se reintenta al reconectar.

### RNF-006.2 — Recuperación ante fallo de API

Errores de Dropbox (429, 5xx) se manejan con backoff (RNF-002.4) y no detienen el plugin de forma permanente.

### RNF-006.3 — Sin pérdida de datos

Ante cualquier fallo, se prioriza preservar la versión local del archivo sobre sobrescribirla con una versión remota incierta.

### RNF-006.4 — Recuperación desde conflicto

RF-010 permite restaurar una versión anterior si el merge automático produjo un resultado no deseado.
