# RF-010 — Restauración/rollback desde versión conflictiva

<!--
  ¿Qué? Requisito funcional que permite deshacer el resultado de un merge o resolución de conflicto no deseado.
  ¿Para qué? El auto-merge (RF-003) puede producir un resultado técnicamente "limpio" pero semánticamente indeseado.
  ¿Impacto? Sin esto, un merge automático de bajo riesgo podría sentirse irreversible y generar desconfianza.
-->

---

## Identificación

| Campo         | Valor                                           |
| ------------- | ----------------------------------------------- |
| **ID**        | RF-010                                          |
| **Nombre**    | Restauración/rollback desde versión conflictiva |
| **Módulo**    | Conflictos / Recuperación                       |
| **Prioridad** | Media                                           |
| **Estado**    | Planificado                                     |
| **Fecha**     | Agosto 2026                                     |

---

## Descripción

Si un merge automático (RF-003) o una resolución manual produjo un resultado no deseado, el usuario debe poder restaurar una versión anterior conocida del archivo.

---

## Entradas

| Campo                                  | Tipo      | Obligatorio | Notas                                                                   |
| -------------------------------------- | --------- | ----------- | ----------------------------------------------------------------------- |
| Archivo + versión anterior a restaurar | Selección | Sí          | Disponible desde el log de sync (RF-007) o copias conflictivas (RF-004) |

---

## Proceso

1. El usuario abre el log de sync (RF-007) o ve una copia conflictiva (RF-004) y elige "restaurar esta versión".
2. El plugin sobrescribe el archivo actual con la versión seleccionada.
3. Esto se trata como un nuevo cambio local, que se sincroniza normalmente en el siguiente ciclo (RF-002).
4. Se registra la restauración en el log como una operación explícita.

---

## Salidas

| Escenario            | Resultado                                                       |
| -------------------- | --------------------------------------------------------------- |
| Restauración exitosa | Archivo actualizado localmente, se sincroniza como cambio nuevo |

---

## APIs / Componentes involucrados

- Settings UI / log de sync, Vault API (escritura de archivo)

---

## Reglas de negocio

- RN-001: Restaurar una versión nunca borra automáticamente las copias conflictivas restantes — el usuario las limpia manualmente si quiere.
- RN-002: La restauración es siempre una acción explícita del usuario, nunca automática.
