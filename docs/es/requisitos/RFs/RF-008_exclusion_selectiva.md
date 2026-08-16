# RF-008 — Exclusión selectiva de archivos/carpetas

<!--
  ¿Qué? Requisito funcional que permite excluir contenido del vault del proceso de sync.
  ¿Para qué? No todo el contenido de un vault necesita (o debe) sincronizarse — adjuntos pesados, configuración local, etc.
  ¿Impacto? Sin esto, el sync es todo-o-nada, forzando a subir contenido innecesario o sensible.
-->

---

## Identificación

| Campo         | Valor                                    |
| ------------- | ---------------------------------------- |
| **ID**        | RF-008                                   |
| **Nombre**    | Exclusión selectiva de archivos/carpetas |
| **Módulo**    | Configuración                            |
| **Prioridad** | Media                                    |
| **Estado**    | Planificado                              |
| **Fecha**     | Agosto 2026                              |

---

## Descripción

El usuario debe poder excluir carpetas o patrones de archivo específicos del proceso de sync (ej. carpetas de adjuntos pesados, plantillas locales, `.obsidian/` parcialmente).

---

## Entradas

| Campo                          | Tipo         | Obligatorio | Validaciones                               |
| ------------------------------ | ------------ | ----------- | ------------------------------------------ |
| Lista de patrones de exclusión | Texto (glob) | No          | Sintaxis glob válida, editable en Settings |

---

## Proceso

1. El usuario agrega patrones de exclusión en Settings (ej. `attachments/videos/**`, `*.excalidraw`).
2. El Sync Engine filtra estos patrones antes de calcular hashes (RF-002) o transferir archivos.
3. Archivos ya sincronizados que pasan a estar excluidos permanecen en el vault local pero dejan de sincronizarse (no se eliminan del remoto automáticamente).

---

## Salidas

| Escenario       | Resultado                                                       |
| --------------- | --------------------------------------------------------------- |
| Patrón aplicado | Los archivos coincidentes se omiten en el próximo ciclo de sync |
| Patrón inválido | Settings muestra error de sintaxis antes de guardar             |

---

## APIs / Componentes involucrados

- Settings UI, Sync Engine (filtro de alcance)

---

## Reglas de negocio

- RN-001: `.obsidian/` (configuración local del vault) está excluida por defecto salvo que el usuario la incluya explícitamente.
- RN-002: Excluir un archivo no lo borra del remoto; el usuario debe eliminarlo manualmente si ese es su objetivo.
