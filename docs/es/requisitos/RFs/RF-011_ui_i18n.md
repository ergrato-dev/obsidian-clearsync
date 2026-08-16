# RF-011 — Interfaz de usuario en español/inglés (i18n)

<!--
  ¿Qué? Requisito funcional que define el soporte bilingüe de la interfaz del plugin.
  ¿Para qué? Un plugin de sync se usa a diario — la barrera de idioma es fricción constante, no puntual.
  ¿Impacto? Sin i18n desde v1, agregar idiomas después implica refactorizar toda la UI existente.
-->

---

## Identificación

| Campo         | Valor                                        |
| ------------- | -------------------------------------------- |
| **ID**        | RF-011                                       |
| **Nombre**    | Interfaz de usuario en español/inglés (i18n) |
| **Módulo**    | UI / i18n                                    |
| **Prioridad** | Media                                        |
| **Estado**    | Planificado                                  |
| **Fecha**     | Agosto 2026                                  |

---

## Descripción

Toda la interfaz visible del plugin (Settings, notificaciones, mensajes de estado, log) debe estar disponible en español e inglés, con selección automática según el idioma de Obsidian y override manual.

---

## Entradas

| Campo                          | Tipo      | Obligatorio | Notas                                    |
| ------------------------------ | --------- | ----------- | ---------------------------------------- |
| Selector de idioma en Settings | Selección | No          | Opciones: Automático / Español / English |

---

## Proceso

1. Por defecto, el plugin detecta el idioma configurado en Obsidian y usa es/en según corresponda; cualquier otro idioma cae a inglés.
2. El usuario puede forzar manualmente es/en desde Settings, sobrescribiendo la detección automática.
3. Todos los strings visibles se resuelven a través de un diccionario i18n (`en.json`/`es.json`), nunca hardcodeados en el código de UI.

---

## Salidas

| Escenario                     | Resultado                                                         |
| ----------------------------- | ----------------------------------------------------------------- |
| Idioma de Obsidian en español | UI del plugin en español automáticamente                          |
| Override manual a inglés      | UI del plugin en inglés independientemente del idioma de Obsidian |

---

## APIs / Componentes involucrados

- Sistema i18n interno, Settings UI

---

## Reglas de negocio

- RN-001: Ningún string de UI se hardcodea fuera del sistema de i18n (RI-003).
- RN-002: Una clave sin traducción cae a inglés como default; nunca se muestra la clave cruda al usuario.
