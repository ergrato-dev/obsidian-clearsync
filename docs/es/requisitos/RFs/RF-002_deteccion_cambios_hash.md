# RF-002 — Detección de cambios por hash de contenido

<!--
  ¿Qué? Requisito funcional que define cómo el plugin detecta qué archivos cambiaron desde el último sync.
  ¿Para qué? mtime es poco confiable entre sistemas de archivos y dispositivos; el hash de contenido es la única señal determinista.
  ¿Impacto? Sin esto, se repite el bug #1 de los plugins actuales: falsos conflictos o cambios perdidos.
-->

---

## Identificación

| Campo         | Valor                                       |
| ------------- | --------------------------------------------- |
| **ID**        | RF-002                                        |
| **Nombre**    | Detección de cambios por hash de contenido    |
| **Módulo**    | Sync Engine                                   |
| **Prioridad** | Alta                                           |
| **Estado**    | Planificado                                    |
| **Fecha**     | Agosto 2026                                    |

---

## Descripción

El plugin debe detectar qué archivos del vault cambiaron desde la última sincronización calculando un **hash de contenido (SHA-256)** por archivo, en vez de confiar en metadata del sistema de archivos (`mtime`).

---

## Entradas

| Campo                         | Tipo   | Obligatorio | Notas                                              |
| ------------------------------ | ------ | ----------- | ---------------------------------------------------- |
| Archivos del vault              | Datos  | Sí          | Vía Vault API de Obsidian, dentro del alcance de RF-008 |
| Último estado de hashes conocido | Datos  | Sí          | Persistido localmente tras el último sync exitoso    |

---

## Proceso

1. Al iniciar un ciclo de sync, el plugin recorre los archivos del vault dentro del alcance configurado (RF-008).
2. Para cada archivo, calcula SHA-256 de su contenido.
3. Compara el hash actual contra el último hash conocido guardado localmente para ese archivo.
4. Si cambió localmente y no remotamente → archivo pendiente de subir.
5. Si cambió remotamente y no localmente → archivo pendiente de descargar.
6. Si cambió en ambos lados respecto al último hash común → conflicto real (ver RF-003/RF-004).
7. Si no cambió en ningún lado → se omite, sin generar tráfico de red.

---

## Salidas

| Escenario                  | Resultado                                          |
| ---------------------------- | ----------------------------------------------------- |
| Sin cambios                  | El ciclo de sync termina sin transferencias           |
| Cambios unidireccionales     | Se sincronizan sin intervención del usuario           |
| Cambios en ambos lados       | Se dispara el flujo de conflicto (RF-003/RF-004)      |

---

## APIs / Componentes involucrados

- Web Crypto API (`subtle.digest`) para SHA-256
- Vault API de Obsidian (lectura de archivos)
- Sync Engine (estado local de hashes)

---

## Reglas de negocio

- RN-001: `mtime` nunca se usa como criterio único de cambio (RT-006).
- RN-002: El hash de integridad de sync se calcula sobre el contenido en claro, para que el merge (RF-003) opere sobre texto real; el cifrado (RF-005) ocurre después, sobre el pipeline de transporte.
