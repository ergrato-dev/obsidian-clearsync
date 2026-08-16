# RF-012 — Soporte mobile (futuro)

<!--
  ¿Qué? Requisito funcional que documenta la intención y alcance de soporte mobile, sin implementarlo en v1.
  ¿Para qué? Dejar constancia explícita de una expansión planeada, para que decisiones de v1 no la bloqueen.
  ¿Impacto? Sin documentar esto, decisiones de v1 (ej. uso de Node fs directo) podrían cerrar la puerta a mobile sin que nadie lo note hasta que sea tarde.
-->

---

## Identificación

| Campo         | Valor                          |
| ------------- | ------------------------------ |
| **ID**        | RF-012                         |
| **Nombre**    | Soporte mobile (futuro)        |
| **Módulo**    | Mobile (futuro)                |
| **Prioridad** | Baja                           |
| **Estado**    | Futuro — no implementado en v1 |
| **Fecha**     | Agosto 2026                    |

---

## Descripción

Extender ClearSync para funcionar en Obsidian mobile (iOS/Android), donde la Obsidian Plugin API es más restringida (sin acceso a Node.js, límites de ejecución en background).

---

## Entradas

No aplica — no implementado en v1.

---

## Proceso (alto nivel, a detallar cuando se planifique)

1. Auditar qué partes del Sync Engine/Crypto Layer dependen de APIs no disponibles en mobile.
2. Adaptar el sync en background a las limitaciones de iOS/Android (sin proceso persistente).
3. Validar rendimiento de cifrado/hashing en dispositivos móviles de gama baja.

---

## Salidas

No aplica — este RF documenta intención y alcance futuro, no comportamiento actual.

---

## APIs / Componentes involucrados

A definir cuando se planifique la implementación.

---

## Reglas de negocio

- RN-001: Ninguna decisión de v1 debe requerir Node.js/fs directo, precisamente para no bloquear este RF futuro (RT-002, RNF-004.2).
