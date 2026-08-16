# RF-007 — Estado y log de sincronización visible en UI

<!--
  ¿Qué? Requisito funcional que define cómo el usuario ve el estado del sync en todo momento.
  ¿Para qué? Ningún fallo debe pasar desapercibido — es una de las quejas centrales contra plugins actuales.
  ¿Impacto? Sin esto, el usuario descubre pérdida de datos días después, cuando ya es tarde para reaccionar.
-->

---

## Identificación

| Campo         | Valor                                                                                                                                                                  |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **ID**        | RF-007                                                                                                                                                                 |
| **Nombre**    | Estado y log de sincronización visible en UI                                                                                                                           |
| **Módulo**    | UI / Estado                                                                                                                                                            |
| **Prioridad** | Alta                                                                                                                                                                   |
| **Estado**    | En progreso — `SyncStatus`/`SyncLog`/panel de Settings implementados y testeados; el log queda vacío hasta que exista un Sync Engine real que llame a `logSyncEvent()` |
| **Fecha**     | Agosto 2026                                                                                                                                                            |

---

## Descripción

El usuario debe poder ver en todo momento si el sync está activo, en curso, completado, con error o pausado, además de un historial reciente de eventos de sync y conflictos.

---

## Entradas

Ninguna — es una vista de solo lectura sobre el estado interno del Sync Engine.

---

## Proceso

1. El Sync Engine emite eventos de estado (`idle`, `syncing`, `error`, `conflict`) durante cada ciclo.
2. El ícono de la barra de estado de Obsidian refleja el estado actual.
3. Un panel dedicado (o modal) muestra el log de las últimas N operaciones: archivo, acción (subido/descargado/mergeado/conflicto), timestamp, resultado.
4. Ante error o conflicto, se muestra una notificación (`Notice` de Obsidian) además de quedar registrado en el log.

---

## Salidas

| Escenario              | Resultado                                                                    |
| ---------------------- | ---------------------------------------------------------------------------- |
| Sync exitoso           | Ícono en estado idle, entrada en el log                                      |
| Error de red/API       | Ícono en estado error, notificación, entrada en el log con detalle del error |
| Conflicto sin resolver | Ícono en estado de atención, notificación persistente hasta resolución       |

---

## APIs / Componentes involucrados

- Obsidian StatusBar API, Notice API, Settings UI (panel de log)

---

## Reglas de negocio

- RN-001: Ningún fallo de sync ocurre sin dejar rastro visible en el log (RNF-003.1).
- RN-002: El log se conserva localmente con un límite razonable de entradas (rotación); no crece indefinidamente.
