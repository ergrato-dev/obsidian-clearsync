# RF-005 — Cifrado end-to-end del contenido

<!--
  ¿Qué? Requisito funcional que define el cifrado del contenido del vault antes de subirlo a la nube.
  ¿Para qué? El proveedor de nube no debe poder leer las notas del usuario bajo ningún escenario.
  ¿Impacto? Es el requisito de seguridad más crítico del proyecto — sin él, ClearSync no resuelve la deficiencia #1 reportada.
-->

---

## Identificación

| Campo         | Valor                            |
| ------------- | -------------------------------- |
| **ID**        | RF-005                           |
| **Nombre**    | Cifrado end-to-end del contenido |
| **Módulo**    | Seguridad / Cifrado              |
| **Prioridad** | Crítica                          |
| **Estado**    | Planificado                      |
| **Fecha**     | Agosto 2026                      |

---

## Descripción

Todo contenido del vault se cifra localmente antes de subirse al proveedor de sync, y se descifra localmente al descargarse. El proveedor de nube nunca recibe ni almacena texto plano.

---

## Entradas

| Campo                           | Tipo  | Obligatorio | Validaciones                                                 |
| ------------------------------- | ----- | ----------- | ------------------------------------------------------------ |
| Contenido en claro del archivo  | Datos | Sí          | —                                                            |
| Contraseña de cifrado del vault | Texto | Sí          | Definida por el usuario en RF-006, distinta de la de Dropbox |

---

## Proceso

1. En la configuración inicial (RF-006), el usuario define una contraseña de cifrado del vault.
2. El plugin deriva una clave AES-256 desde esa contraseña vía **PBKDF2** o **scrypt**, con salt único almacenado localmente.
3. Antes de subir un archivo, su contenido se cifra con **AES-256-GCM** usando la clave derivada.
4. El archivo cifrado (junto a su nonce/IV) se sube a Dropbox.
5. Al descargar, el plugin descifra localmente usando la misma clave derivada.
6. Si la contraseña de cifrado no coincide (ej. vault vinculado desde otro dispositivo con contraseña distinta), la descifración falla explícitamente y se notifica al usuario — nunca se muestra contenido corrupto silenciosamente.

---

## Salidas

| Escenario                                             | Resultado                                                                               |
| ----------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Cifrado/descifrado exitoso                            | Sync transparente para el usuario                                                       |
| Contraseña de cifrado incorrecta en dispositivo nuevo | Error explícito "No se pudo descifrar: verificá tu contraseña de cifrado", sync pausado |

---

## APIs / Componentes involucrados

- Web Crypto API (AES-GCM, PBKDF2)
- Crypto Layer (módulo dedicado — ver `docs/{es,en}/referencia-tecnica/architecture.md`)

---

## Reglas de negocio

- RN-001: La contraseña de cifrado nunca se envía a Dropbox ni se almacena en texto plano (RS-001).
- RN-002: Nombres de archivo y estructura de carpetas se evalúan para cifrado/ofuscación si el proveedor los expone en su API (a definir en implementación, RT-005).
- RN-003: Perder la contraseña de cifrado implica perder acceso al contenido remoto — el plugin advierte esto explícitamente durante la configuración inicial.
