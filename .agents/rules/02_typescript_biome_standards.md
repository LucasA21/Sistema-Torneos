# Regla 02: TypeScript Estricto + Biome

## TypeScript — Reglas Obligatorias
- **`strict: true`** siempre activo en `tsconfig.json`.
- **Prohibido usar `any`** en cualquier parte del código. Alternativas: `unknown`, generics, tipos específicos.
- **Prohibido usar `as` para castear** a tipos incompatibles. Si es necesario, documentar el motivo.
- **No suprimir errores** con `// @ts-ignore` o `// @ts-expect-error` sin comentario explicativo.

## Nomenclatura
| Categoría | Convención | Ejemplo |
|---|---|---|
| Interfaces / Types | PascalCase | `Team`, `Match`, `TournamentState` |
| Enums | PascalCase | `MatchStatus`, `ZoneType` |
| Constantes globales | UPPER_SNAKE_CASE | `DEFAULT_TEAMS`, `MAX_MONTE_CARLO_N` |
| Funciones y variables | camelCase | `simulateMatch`, `homeAdvantage` |
| Archivos de componentes | PascalCase | `MatchCard.tsx`, `StandingsTable.tsx` |
| Archivos de utilidades | camelCase | `fixture.ts`, `statistics.ts` |

## Inmutabilidad
- Los estados de simulación son **inmutables**: nunca mutar arrays/objetos directamente.
- Usar spread (`{ ...obj }`, `[...arr]`) o `structuredClone()` para copias.
- Las funciones del core deben ser **puras**: misma entrada → misma salida (excepto el generador pseudoaleatorio).

## Biome — Herramienta Única
- **Biome** es el único linter y formateador. No usar ESLint ni Prettier simultáneamente.
- Configuración en `biome.json` en la raíz del proyecto.
- Correr antes de cada commit: `npx @biomejs/biome check --write src/`
- Reglas habilitadas:
  - `suspicious.noExplicitAny`: error
  - `correctness.noUnusedVariables`: warn
  - `style.useConst`: error
  - Formateo: 2 espacios, comillas simples, punto y coma obligatorio, trailing comma en ES5

## Tipos del Dominio (ubicación obligatoria)
Todos los tipos viven en `src/core/models/types.ts`. Nunca definir tipos locales en componentes
si el tipo pertenece al dominio de negocio.
