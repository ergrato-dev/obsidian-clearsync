# RF-001 — Autenticación con Dropbox

<!--
  ¿Qué? Requisito funcional que define cómo el plugin obtiene acceso autorizado a la cuenta de Dropbox del usuario.
  ¿Para qué? Sin autorización segura no hay forma de leer/escribir archivos en el Dropbox del usuario.
  ¿Impacto? Un flujo de auth mal implementado (ej. client secret embebido) compromete la cuenta completa del usuario, no solo el vault.
-->

---

## Identificación

| Campo         | Valor                     |
| ------------- | ------------------------- |
| **ID**        | RF-001                    |
| **Nombre**    | Autenticación con Dropbox |
| **Módulo**    | Autenticación             |
| **Prioridad** | Alta                      |
| **Estado**    | En progreso — código listo, pendiente registrar la app en Dropbox (ver `src/auth/dropboxConfig.ts`) |
| **Fecha**     | Agosto 2026               |

---

## Descripción

El plugin debe permitir al usuario autorizar acceso a su cuenta de Dropbox mediante **OAuth2 con PKCE** (sin client secret embebido, apto para aplicaciones cliente). Tras autorizar, el plugin obtiene y almacena de forma segura un `access_token` y un `refresh_token` para operar la API de Dropbox en nombre del usuario.

---

## Entradas

| Campo                            | Tipo                  | Obligatorio | Notas                                              |
| -------------------------------- | --------------------- | ----------- | -------------------------------------------------- |
| Botón "Conectar Dropbox"         | Acción                | Sí          | Dispara el flujo OAuth2 desde Settings             |
| `code_verifier`/`code_challenge` | Generado internamente | —           | PKCE, nunca visible ni configurable por el usuario |

---

## Proceso

1. El usuario hace clic en "Conectar Dropbox" en el panel de Settings.
2. El plugin genera `code_verifier` y `code_challenge` (PKCE) localmente.
3. El plugin abre el navegador del sistema hacia la URL de autorización de Dropbox con el `code_challenge`.
4. El usuario inicia sesión y autoriza la app en Dropbox.
5. Dropbox redirige a una URL de callback local con el `authorization code`.
6. El plugin intercambia el `code` + `code_verifier` por `access_token` y `refresh_token` (sin exponer client secret).
7. Los tokens se almacenan vía `this.saveData()` de Obsidian (RS-002).
8. El plugin usa el `refresh_token` para renovar el `access_token` automáticamente cuando expira.

---

## Salidas

| Escenario                               | Resultado                                                                         |
| --------------------------------------- | --------------------------------------------------------------------------------- |
| Conexión exitosa                        | Settings muestra "Conectado como {email}" y habilita el resto de la configuración |
| Usuario cancela/rechaza la autorización | Settings permanece en estado "No conectado", sin error bloqueante                 |
| Token expirado y renovación falla       | Settings muestra "Sesión expirada, reconectar" y pausa el sync                    |

---

## APIs / Componentes involucrados

- Dropbox OAuth2 (`/oauth2/authorize`, `/oauth2/token`)
- Obsidian: `this.saveData()`/`this.loadData()`, apertura de navegador del sistema

---

## Reglas de negocio

- RN-001: Nunca se usa Implicit Grant ni se embebe un client secret — solo Authorization Code + PKCE.
- RN-002: El `refresh_token` se usa para renovar la sesión sin pedir reautorización, salvo revocación explícita del usuario o de Dropbox.
- RN-003: Si el usuario desconecta Dropbox desde Settings, los tokens se eliminan del almacenamiento local inmediatamente.
