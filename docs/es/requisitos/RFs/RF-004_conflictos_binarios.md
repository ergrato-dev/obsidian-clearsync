# RF-004 — Resolución de conflictos en binarios/adjuntos

<!--
  ¿Qué? Requisito funcional sobre qué hacer cuando un archivo no fusionable (imagen, PDF, etc.) entra en conflicto.
  ¿Para qué? Un binario no se puede fusionar línea a línea; hay que garantizar que ninguna versión se pierda.
  ¿Impacto? Sobrescribir un adjunto sin avisar es una de las quejas más comunes contra plugins de sync actuales.
-->

---

## Identificación

| Campo         | Valor                                         |
| ------------- | --------------------------------------------- |
| **ID**        | RF-004                                        |
| **Nombre**    | Resolución de conflictos en binarios/adjuntos |
| **Módulo**    | Sync Engine / Conflictos                      |
| **Prioridad** | Alta                                          |
| **Estado**    | Planificado                                   |
| **Fecha**     | Agosto 2026                                   |

---

## Descripción

Cuando un archivo binario o adjunto (imagen, PDF, etc.) cambió en ambos lados desde la última sincronización en común, el plugin nunca sobrescribe silenciosamente: conserva ambas versiones usando la convención de "copia conflictiva".

---

## Entradas

| Campo                      | Tipo  | Obligatorio | Notas |
| -------------------------- | ----- | ----------- | ----- |
| Versión local del archivo  | Datos | Sí          | —     |
| Versión remota del archivo | Datos | Sí          | —     |

---

## Proceso

1. Se detecta conflicto real sobre un archivo no soportado por three-way merge (no es texto plano).
2. El plugin conserva el archivo remoto con su nombre original.
3. La otra versión se guarda como copia con sufijo `nombre (conflicto {device} {timestamp}).ext`.
4. Ambos archivos quedan visibles en el vault; el usuario decide cuál conservar.
5. Se registra el conflicto en el log de sync (RF-007).

---

## Salidas

| Escenario         | Resultado                                                                     |
| ----------------- | ----------------------------------------------------------------------------- |
| Conflicto binario | Dos archivos visibles en el vault, notificación al usuario, ninguno se pierde |

---

## APIs / Componentes involucrados

- Conflict Resolver
- Vault API de Obsidian (creación de archivo con nuevo nombre)

---

## Reglas de negocio

- RN-001: Nunca se descarta un archivo binario en conflicto sin dejar ambas copias accesibles.
- RN-002: El sufijo de copia conflictiva incluye identificador de dispositivo y timestamp para que el usuario entienda el origen del conflicto.
