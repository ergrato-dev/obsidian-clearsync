# RNF-001 — Seguridad

<!--
  ¿Qué? Requisito no funcional que define los estándares de seguridad del plugin.
  ¿Para qué? Garantizar que el contenido del vault esté protegido incluso frente a un proveedor de nube no confiable.
  ¿Impacto? Es la deficiencia #1 reportada contra los plugins de sync existentes — sin esto, ClearSync no aporta nada nuevo.
-->

---

## Identificación

| Campo         | Valor                       |
| ------------- | --------------------------- |
| **ID**        | RNF-001                     |
| **Nombre**    | Seguridad                   |
| **Categoría** | Seguridad de la información |
| **Prioridad** | Crítica                     |
| **Estado**    | Planificado                 |
| **Fecha**     | Agosto 2026                 |

---

## Requisitos

### RNF-001.1 — Cifrado end-to-end

El contenido del vault debe cifrarse localmente con **AES-256-GCM** antes de subirse, con clave derivada de la contraseña del usuario vía **PBKDF2** o **scrypt**. Nunca se sube contenido sin cifrar. Ver RF-005, RT-005.

### RNF-001.2 — Gestión de tokens OAuth

Los tokens de Dropbox se almacenan vía `this.saveData()` de Obsidian, nunca en texto plano en configuración exportable sin cifrar, y nunca se registran en logs.

### RNF-001.3 — Sin telemetría

El plugin no envía datos de uso ni analítica a servicios de terceros (RS-003).

### RNF-001.4 — Validación de entradas

Toda entrada de configuración (contraseña de cifrado, patrones de exclusión, credenciales OAuth) se valida antes de usarse.

### RNF-001.5 — Modelo de amenaza

El proveedor de nube (Dropbox u otro futuro) se asume **no confiable**; nunca debe recibir contenido del vault en texto plano (RS-004).

### RNF-001.6 — Alineación con OWASP

Toda decisión de seguridad se contrasta contra [`docs/es/conceptos/owasp-top-10.md`](../../conceptos/owasp-top-10.md) antes de implementarse.
