# Regla 03: UI/UX con MUI y Accesibilidad

## Biblioteca de Componentes
- Usar **exclusivamente** `@mui/material` para componentes UI base.
- Usar `@mui/icons-material` para iconografía.
- No mezclar con otras bibliotecas de componentes (no Radix, no shadcn).
- Gráficos estadísticos: `recharts` (integrado con MUI theme).

## Dark Mode / Light Mode
- Implementar con `ThemeProvider` de MUI y un Context propio (`ThemeToggleContext`).
- El modo se controla con `useState` en `providers.tsx`.
- Usar `theme.palette.mode` para estilos condicionales, nunca clases CSS manuales.
- Toggle visible en la Navbar siempre.

## Paleta Visual Deportiva
- **Primario** (dark): `#1565C0` (azul intenso)
- **Primario** (light): `#1976D2`
- **Secundario**: `#00C853` (verde para destacados positivos)
- **Error/Descenso**: `#D32F2F`
- **Warning/Copa**: `#F9A825`
- **Success/Campeón**: `#FFD600` (dorado)
- Tipografía: `Inter` (Google Fonts via `next/font/google`)

## Zonas de la Tabla de Posiciones — Chips Obligatorios
```
Posición 1       → Chip dorado    "🏆 Campeón"
Posiciones 2-4   → Chip azul      "Copa"  
Posiciones N-2 a N → Chip rojo    "Descenso"
```
Los rangos deben ser configurables según el número de equipos.

## Accesibilidad
- Todos los botones de control de simulación deben tener `aria-label` descriptivo.
- Los `Dialog` deben tener `aria-labelledby` y `aria-describedby`.
- Las tablas deben usar `<caption>` o `aria-label`.
- Controles de teclado: los Sliders de Monte Carlo deben funcionar con flechas del teclado.
- Contraste: siempre WCAG AA (ratio mínimo 4.5:1 texto normal, 3:1 texto grande).

## Responsive Design
- Layout principal: `Drawer` lateral colapsable en mobile.
- Usar el sistema de Grid de MUI (`Grid2`) para layouts de columnas.
- Breakpoints: `xs` (mobile), `md` (tablet), `lg` (desktop).

## Animaciones y Feedback Visual
- Usar `Skeleton` de MUI durante cargas de Monte Carlo.
- `LinearProgress` con porcentaje durante simulación masiva.
- `Fade` / `Slide` de MUI para transiciones de paneles.
- `Snackbar` con `Alert` para notificaciones de acciones (equipo agregado, torneo iniciado, etc.).
