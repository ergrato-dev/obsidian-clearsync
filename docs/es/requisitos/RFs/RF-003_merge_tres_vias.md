# RF-003 — Merge automático de tres vías para archivos de texto

<!--
  ¿Qué? Requisito funcional que define la resolución automática de conflictos en notas de texto.
  ¿Para qué? Evitar que un conflicto real siempre requiera intervención manual, sin caer en last-write-wins silencioso.
  ¿Impacto? Es el diferenciador principal de ClearSync frente a la pérdida silenciosa de datos de plugins actuales.
-->

---

## Identificación

| Campo         | Valor                                                |
| ------------- | ---------------------------------------------------- |
| **ID**        | RF-003                                               |
| **Nombre**    | Merge automático de tres vías para archivos de texto |
| **Módulo**    | Sync Engine / Merge                                  |
| **Prioridad** | Alta                                                 |
| **Estado**    | Planificado                                          |
| **Fecha**     | Agosto 2026                                          |

---

## Descripción

Cuando un archivo de texto (`.md`) cambió tanto local como remotamente desde la última versión sincronizada en común, el plugin intenta una fusión automática de tres vías (base común + versión local + versión remota) antes de pedir intervención del usuario.

---

## Entradas

| Campo                 | Tipo  | Obligatorio | Notas                                  |
| --------------------- | ----- | ----------- | -------------------------------------- |
| Versión base          | Datos | Sí          | Último contenido sincronizado en común |
| Versión local actual  | Datos | Sí          | —                                      |
| Versión remota actual | Datos | Sí          | —                                      |

---

## Proceso

1. Se detecta conflicto real (RF-002, paso 6).
2. Si la extensión es `.md`/texto plano, se ejecuta three-way merge línea a línea sobre base/local/remoto.
3. Si no hay hunks modificados con overlap en ambos lados, el merge se aplica automáticamente y el resultado se sincroniza sin intervención.
4. Si hay overlap real (mismo bloque modificado distinto en ambos lados), el archivo se marca como conflicto sin resolver y se notifica al usuario (RF-007) con ambas versiones disponibles.
5. El usuario resuelve manualmente el conflicto no fusionable desde la UI.

---

## Salidas

| Escenario                    | Resultado                                                                      |
| ---------------------------- | ------------------------------------------------------------------------------ |
| Merge limpio (sin overlap)   | Archivo actualizado y sincronizado; notificación informativa no bloqueante     |
| Conflicto real (con overlap) | Notificación persistente; el archivo no se sobrescribe hasta resolución manual |

---

## APIs / Componentes involucrados

- Conflict Resolver (algoritmo diff3)
- Sync Engine, Settings UI (notificación)

---

## Reglas de negocio

- RN-001: El merge automático solo aplica a archivos de texto plano (`.md`, `.txt`); los binarios nunca se auto-mergean (ver RF-004).
- RN-002: Nunca se sobrescribe silenciosamente una versión con overlap sin resolver (RNF-001, RNF-003).
- RN-003: El resultado del merge automático se registra en el log de sync (RF-007) para trazabilidad.
