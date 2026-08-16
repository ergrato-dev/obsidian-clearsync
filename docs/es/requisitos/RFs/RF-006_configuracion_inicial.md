# RF-006 — Configuración inicial y vinculación del vault

<!--
  ¿Qué? Requisito funcional que define el flujo guiado de primera configuración del plugin.
  ¿Para qué? Reducir la fricción de setup (RNF-003.4) sin saltarse pasos críticos de seguridad.
  ¿Impacto? Un onboarding confuso hace que el usuario configure mal el cifrado y pierda acceso a sus datos.
-->

---

## Identificación

| Campo         | Valor                                                                                                                                                                                               |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **ID**        | RF-006                                                                                                                                                                                              |
| **Nombre**    | Configuración inicial y vinculación del vault                                                                                                                                                       |
| **Módulo**    | Configuración                                                                                                                                                                                       |
| **Prioridad** | Alta                                                                                                                                                                                                |
| **Estado**    | En progreso — asistente de 3 pasos implementado y testeado (`src/setup/`); pasos 4/5 (vincular a vault existente, verificación de contraseña contra el remoto) bloqueados en un `SyncProvider` real |
| **Fecha**     | Agosto 2026                                                                                                                                                                                         |

---

## Descripción

Flujo guiado para que un usuario nuevo conecte su cuenta de Dropbox, defina su contraseña de cifrado, y vincule un vault de Obsidian al sync por primera vez.

---

## Entradas

| Campo                     | Tipo  | Obligatorio | Validaciones                        |
| ------------------------- | ----- | ----------- | ----------------------------------- |
| Contraseña de cifrado     | Texto | Sí          | Definida y confirmada (RF-005)      |
| Carpeta remota de Dropbox | Texto | Sí          | Crear nueva o seleccionar existente |

---

## Proceso

1. El usuario abre Settings del plugin por primera vez.
2. Ejecuta RF-001 (conectar Dropbox).
3. Define contraseña de cifrado del vault, con confirmación.
4. Elige o crea la carpeta remota en Dropbox donde vivirá el vault sincronizado.
5. Si la carpeta remota ya tiene contenido (vault existente de otro dispositivo), el plugin ofrece "vincular a vault existente" (descarga inicial) o "vault nuevo" (sube el vault local actual).
6. Se ejecuta el primer sync completo con el estado elegido.

---

## Salidas

| Escenario                                               | Resultado                                                                           |
| ------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Configuración completa                                  | El plugin queda activo, sync automático habilitado                                  |
| Vault remoto existente + contraseña de cifrado distinta | Error de descifrado explícito (RF-005); configuración no se completa hasta resolver |

---

## APIs / Componentes involucrados

- Settings UI, RF-001, RF-005, Dropbox API (listar/crear carpeta)

---

## Reglas de negocio

- RN-001: No se puede activar el sync automático sin completar los tres pasos: Dropbox, cifrado, carpeta.
- RN-002: Vincular a un vault remoto existente exige verificar la contraseña de cifrado antes de continuar.
