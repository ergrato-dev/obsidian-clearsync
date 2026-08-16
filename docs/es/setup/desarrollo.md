# Setup de entorno de desarrollo

<!--
  ¿Qué? Cómo levantar un entorno local para desarrollar y probar ClearSync dentro de Obsidian.
  ¿Para qué? Que cualquier colaborador nuevo pueda tener el plugin corriendo en modo desarrollo sin adivinar pasos.
  ¿Impacto? Sin esto, cada colaborador reinventa su propio flujo de prueba manual, con resultados inconsistentes.
-->

> Este documento describe el flujo previsto para cuando exista código (`RO-003`: aún estamos en fase de documentación). Se actualizará con pasos exactos al iniciar la implementación.

---

## Prerrequisitos

- Node.js (versión LTS vigente)
- **pnpm** (RH-001 — único gestor de paquetes permitido)
- Una instalación de [Obsidian](https://obsidian.md) con un vault de prueba (nunca uses tu vault real para desarrollo)

## Clonar y preparar

```bash
git clone https://github.com/ergrato-dev/obsidian-clearsync.git
cd obsidian-clearsync
pnpm install
```

## Vincular el plugin a un vault de prueba

Obsidian carga plugins desde `<vault>/.obsidian/plugins/<plugin-id>/`. El flujo estándar de la comunidad de plugins es symlinkear la carpeta de build a esa ruta:

```bash
ln -s "$(pwd)/dist" "/ruta/a/tu-vault-de-prueba/.obsidian/plugins/clearsync"
```

## Modo desarrollo (watch + rebuild)

```bash
pnpm run dev
```

Esto corre esbuild en modo watch, regenerando `main.js` en `dist/` ante cada cambio. Para ver los cambios reflejados:

- Recargar Obsidian manualmente (`Ctrl/Cmd + R` con la consola de desarrollador abierta), o
- Instalar el plugin comunitario **Hot Reload** en el vault de prueba, que recarga plugins automáticamente al detectar cambios en `dist/`.

## Tests y cobertura

```bash
pnpm test          # corre la suite de Vitest
pnpm run coverage   # genera reporte de cobertura — debe ser ≥85% (RNF-005.1)
```

## Lint y formato

```bash
pnpm run lint    # ESLint
pnpm run format   # Prettier
```

## Antes de abrir un PR

1. `pnpm run lint && pnpm test` deben pasar sin errores.
2. Si el cambio implementa un RF, ese RF debe existir y estar aprobado en `docs/{es,en}/requisitos/RFs/` (RO-003).
3. El commit sigue Conventional Commits con cuerpo Qué/Para qué/Impacto (RO-002) — ver skill `commit-message` en `.claude/skills/`.
