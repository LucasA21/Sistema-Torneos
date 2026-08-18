# Arquitectura y Guía de Ejecución

**Asignatura:** Modelos y Simulación — UNTDF

---

## 1. Justificación de Tecnologías

### 1.1 Next.js 14+ (App Router)
**¿Por qué Next.js?**
- Framework React de producción con **Server Components** por defecto, reduciendo el JavaScript enviado al cliente.
- App Router permite co-ubicar layouts, páginas y componentes con convenciones claras.
- Soporte nativo para TypeScript sin configuración adicional.
- Alternativa considerada: Vite + React (descartada por falta de SSR nativa y convenciones de routing).

### 1.2 Material UI (MUI v6)
**¿Por qué MUI?**
- Sistema de diseño completo con componentes accesibles, con soporte nativo para Dark/Light mode mediante `ThemeProvider`.
- Integración probada con Next.js App Router mediante Emotion Cache.
- Componentes especializados (`DataGrid`, `Slider`, `LinearProgress`) ideales para el panel de control de simulación.
- Alternativa considerada: Chakra UI (descartada por menor madurez de integración con App Router).

### 1.3 Biome
**¿Por qué Biome?**
- Linter y formateador **unificado** en un solo binario (reemplaza ESLint + Prettier).
- Significativamente más rápido que ESLint (escrito en Rust).
- Configuración mínima con reglas sensibles por defecto.

### 1.4 recharts
**¿Por qué recharts?**
- Librería de gráficos React madura y bien mantenida.
- Componentes declarativos (`BarChart`, `PieChart`) con animaciones incluidas.
- Compatible con el sistema de theming de MUI mediante props de color.
- Alternativa considerada: `@mui/x-charts` (descartada por requerir licencia Pro para features avanzados).

### 1.5 TypeScript Estricto
- `strict: true` activa: `strictNullChecks`, `noImplicitAny`, `strictFunctionTypes`, etc.
- El motor de simulación (`src/core/`) es 100% puro TypeScript, sin dependencias de framework, facilitando su reutilización y testing.

---

## 2. Diagrama de Capas de la Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                      CAPA DE PRESENTACIÓN                    │
│              (Next.js App Router + MUI Components)           │
│                                                              │
│  app/layout.tsx → app/page.tsx → app/equipos/ → app/montecarlo/ │
│                         │                                    │
│                  components/                                 │
│        layout/  tournament/  simulation/  charts/            │
└──────────────────────────┬──────────────────────────────────┘
                           │ usa
┌──────────────────────────▼──────────────────────────────────┐
│                      CAPA DE ESTADO                          │
│                    (React Custom Hooks)                       │
│                                                              │
│       hooks/useTeams.ts  useTournament.ts  useMonteCarlo.ts  │
└──────────────────────────┬──────────────────────────────────┘
                           │ llama a
┌──────────────────────────▼──────────────────────────────────┐
│                 NÚCLEO DE SIMULACIÓN (PURO)                  │
│              100% TypeScript, 0% dependencias UI             │
│                                                              │
│  core/models/types.ts    → Contratos de tipos del dominio    │
│  core/engine/fixture.ts  → Generador de calendario           │
│  core/engine/matchSim.ts → Función de transición estocástica │
│  core/engine/standings.ts → Cálculo y orden de posiciones    │
│  core/engine/tournament.ts → Orquestador del torneo          │
│  core/montecarlo/runner.ts → Ejecución Monte Carlo asíncrona │
│  core/montecarlo/statistics.ts → Agregación de estadísticas  │
└─────────────────────────────────────────────────────────────┘
```

### 2.1 Principio de Separación Estricta

El núcleo (`src/core/`) **no importa nada** de `src/app/`, `src/components/`, `src/hooks/` ni ninguna librería de UI. Esta separación garantiza:
- **Testabilidad**: El motor puede testearse con Node.js puro sin montar un navegador.
- **Portabilidad**: El core podría reutilizarse en una API REST o una CLI sin cambios.
- **Mantenibilidad**: Cambios de UI no afectan la lógica de negocio.

---

## 3. Estructura de Carpetas

```
Sistema-Torneos/
├── agents/
│   └── rules/           # Directivas para agentes de IA
├── docs/                # Documentación académica (este directorio)
├── src/
│   ├── app/             # Next.js App Router
│   │   ├── layout.tsx   # Root layout (fuentes, providers)
│   │   ├── page.tsx     # Dashboard principal
│   │   ├── providers.tsx # ThemeProvider + Context
│   │   ├── emotion-cache.tsx # SSR fix para MUI
│   │   ├── equipos/     # Gestión de equipos
│   │   ├── simulacion/  # Simulación paso a paso
│   │   └── montecarlo/  # Simulación Monte Carlo
│   ├── components/      # Componentes React organizados por feature
│   ├── core/            # Motor de simulación puro
│   ├── hooks/           # Custom hooks de React
│   └── theme/           # Configuración de MUI theme
├── biome.json           # Linting y formateo
├── justfile             # Comandos de desarrollo simplificados
├── .env.example         # Plantilla de variables de entorno
└── docker/              # Entorno contenerizado
    ├── Dockerfile       # Contenedor de desarrollo
    └── docker-compose.yml # Orquestación Docker
```

---

## 4. Guía de Ejecución Local

### 4.1 Prerrequisitos
- Node.js 18+ (recomendado: 20 LTS)
- npm 9+
- `just` (opcional, para comandos simplificados): `cargo install just` o `brew install just`

### 4.2 Instalación / Setup

```bash
# Clonar el repositorio
git clone <url-repo>
cd Sistema-Torneos

# Ejecutar el comando de setup automático
just setup

# O manualmente:
cp .env.example .env
npm install

# Verificar que todo esté correcto
just check
```

### 4.3 Desarrollo

```bash
# Con just (recomendado)
just dev

# Detener la aplicación
just stop
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

### 4.4 Comandos Disponibles (justfile)

```bash
just setup      # Configuración inicial (.env + npm install)
just dev        # Servidor de desarrollo
just stop       # Detener aplicación en puerto 3000
just build      # Build de producción
just typecheck  # Verificación de tipos TypeScript
just lint       # Linting con Biome
just lint-fix   # Linting + autofix con Biome
just check      # typecheck + lint (pre-commit)
just clean      # Limpiar caché, builds y .env
just docker-up  # Levantar con Docker Compose
just docker-down # Detener Docker
```

---

## 5. Guía de Ejecución con Docker

```bash
# Construir y levantar
just docker-up
# o directamente:
docker compose up --build -d

# La aplicación estará en http://localhost:3000

# Detener
just docker-down
```

El `docker-compose.yml` monta el directorio `src/` como volumen para hot-reload durante desarrollo.

---

## 6. Flujo de Uso de la Aplicación

```
1. EQUIPOS (/)
   └─ Editar ratings de los equipos de la Liga Argentina
   └─ Agregar o eliminar equipos
   └─ Configurar modalidad (ida / ida y vuelta)
   └─ Click "Iniciar Torneo"

2. SIMULACIÓN (/simulacion)
   └─ Ver fixture completo generado
   └─ Simular partido a partido o fecha completa
   └─ Observar tabla de posiciones en tiempo real
   └─ Reiniciar para un nuevo torneo

3. MONTE CARLO (/montecarlo)
   └─ Seleccionar N iteraciones (100 a 10.000)
   └─ Click "Ejecutar Simulación"
   └─ Observar progreso con LinearProgress
   └─ Analizar gráficos de probabilidades y estadísticas
```
