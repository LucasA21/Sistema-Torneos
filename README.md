# Simulator de Liga y Torneos Deportivos

Simulador interactivo de torneos de fútbol y ligas deportivas con simulación en vivo paso a paso y proyecciones masivas de probabilidades.

---

## Características Principal

- **Gestión de Equipos**: Selección y edición de equipos (con escudos oficial de la Liga Argentina, ratings y localía).
- **Simulación Paso a Paso**: Avance partido por partido o por fechas completas en tiempo real con tabla de posiciones dinámica.
- **Simulación Masiva y Predicciones**: Simulación de hasta 10.000 torneos completos para calcular la probabilidad de salir campeón, clasificar a copas o descender.
- **Interfaz Moderna**: Construida con Material UI (MUI v9) con soporte nativo para Modo Oscuro y Modo Claro.

---

## Requisitos Previos

- [Node.js](https://nodejs.org/) v18 o superior
- [npm](https://www.npmjs.com/) v9 o superior
- [just](https://github.com/casey/just) *(opcional, para comandos abreviados)*

---

## Inicio Rápido

### Con just (Recomendado)

1. **Clonar e Instalar**:
   ```bash
   git clone <url-del-repositorio>
   cd Sistema-Torneos
   just setup
   ```
2. **Iniciar Servidor**:
   ```bash
   just dev
   ```
3. **Detener Servidor**:
   ```bash
   just stop
   ```

---

### Sin just (Usando npm / scripts nativos)

Si no tienes `just` instalado en tu sistema:

1. **Clonar el repositorio**:
   ```bash
   git clone <url-del-repositorio>
   cd Sistema-Torneos
   ```

2. **Configurar variables de entorno e instalar dependencias**:
   ```bash
   # Copiar archivos de entorno
   cp .env.example .env
   cp docker/.env.example docker/.env

   # Instalar dependencias de Node.js
   npm install
   ```

3. **Iniciar el servidor de desarrollo**:
   ```bash
   npm run dev
   ```
   Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

4. **Compilar para producción**:
   ```bash
   npm run build
   npm run start
   ```

---

## Comandos Disponibles

| Con `just` | Sin `just` (Equivalente) | Descripción |
|---|---|---|
| `just setup` | `cp .env.example .env && cp docker/.env.example docker/.env && npm install` | Configura entorno e instala dependencias |
| `just dev` | `npm run dev` | Inicia servidor de desarrollo (Next.js) |
| `just stop` | `fuser -k 3000/tcp` | Detiene proceso en puerto 3000 |
| `just typecheck` | `npx tsc --noEmit` | Verifica tipos con TypeScript |
| `just lint` | `npx @biomejs/biome check src/` | Reporta errores de linter con Biome |
| `just lint-fix` | `npx @biomejs/biome check --write src/` | Corrige y formatea código con Biome |
| `just check` | `npx tsc --noEmit && npx @biomejs/biome check src/` | Chequeo completo de tipos y linter |
| `just build` | `npm run build` | Compila la aplicación para producción |
| `just start` | `npm run start` | Inicia la app compilada en producción |
| `just docker-up` | `docker compose -f docker/docker-compose.yml up --build -d` | Inicia contenedor Docker |
| `just docker-down` | `docker compose -f docker/docker-compose.yml down` | Detiene contenedor Docker |

---

## Ejecución con Docker

Si preferís ejecutar la aplicación en un contenedor de desarrollo:

```bash
# Con just:
just docker-up
just docker-down

# Sin just:
docker compose -f docker/docker-compose.yml up --build -d
docker compose -f docker/docker-compose.yml down
```

---

## Documentación del Modelo

- [Explicación Sencilla del Modelo (para usuarios)](file:///home/lk/Proyectos/Sistema-Torneos/docs/05_explicacion_sencilla_del_modelo.md)
- [Especificación Matemática Formal](file:///home/lk/Proyectos/Sistema-Torneos/docs/02_especificacion_del_modelo.md)
- [Mecánica de Simulación](file:///home/lk/Proyectos/Sistema-Torneos/docs/03_mecanica_de_simulacion.md)

