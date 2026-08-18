# Regla 01: Arquitectura Next.js + MUI (App Router)

## Stack Principal
- **Framework**: Next.js 14+ con App Router (no usar Pages Router)
- **Lenguaje**: TypeScript estricto (`strict: true` en tsconfig)
- **UI**: Material UI v6 (`@mui/material`)
- **Gestión de estado**: React hooks + Context API (sin Redux)

## Estructura de Carpetas Obligatoria
```
src/
├── app/              # Rutas, layout y providers
├── components/       # Componentes UI (tournament/, simulation/, charts/, layout/)
├── core/             # Motor matemático 100% puro (sin dependencias React/MUI)
│   ├── models/       # Tipos e interfaces del dominio
│   ├── engine/       # Algoritmos de fixture, simulación, standings
│   └── montecarlo/   # Runner Monte Carlo y estadísticas
├── hooks/            # Custom hooks para estado reactivo
├── theme/            # Configuración MUI theme
└── lib/              # Utilidades auxiliares
```

## Reglas de Server vs Client Components
- **Server Components por defecto**: `app/layout.tsx`, `app/page.tsx` y páginas de ruta son Server Components.
- **`"use client"` SOLO cuando**: el componente usa hooks (`useState`, `useEffect`, `useCallback`), event listeners, o APIs del browser.
- **Providers siempre en Client**: `ThemeProvider`, `CssBaseline`, `EmotionCache` deben estar en un archivo `providers.tsx` marcado con `"use client"`.

## MUI con App Router — Emotion Cache SSR-Safe
Para evitar el error de hydration de MUI con Next.js App Router:
1. Crear `src/app/emotion-cache.tsx` con `"use client"` que configure el caché de Emotion.
2. Envolver toda la app en `NextAppDirEmotionCacheProvider` (o implementación equivalente con `useServerInsertedHTML`).
3. El `ThemeProvider` de MUI debe estar DENTRO del Emotion Cache Provider.

## Imports
- Usar siempre paths aliases: `@/components/...`, `@/core/...`, `@/hooks/...`
- Nunca usar rutas relativas que suban más de un nivel (`../../`)

## Performance
- Lazy load de componentes pesados con `dynamic()` de Next.js (especialmente gráficos recharts).
- El motor Monte Carlo corre en chunks asíncronos para no bloquear el hilo principal.
