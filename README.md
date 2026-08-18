# ⚽ Simulator de Liga y Torneos Deportivos

Simulador interactivo de torneos de fútbol y ligas deportivas con simulación en vivo paso a paso y proyecciones masivas de probabilidades.

---

## 🚀 Características Principal

- 🛡️ **Gestión de Equipos**: Selección y edición de equipos (con escudos oficial de la Liga Argentina, ratings y localía).
- ⚽ **Simulación Paso a Paso**: Avance partido por partido o por fechas completas en tiempo real con tabla de posiciones dinámica.
- 📊 **Simulación Masiva y Predicciones**: Simulación de hasta 10.000 torneos completos para calcular la probabilidad de salir campeón, clasificar a copas o descender.
- 🎨 **Interfaz Moderna**: Construida con Material UI (MUI v9) con soporte nativo para Modo Oscuro y Modo Claro.

---

## 🛠️ Requisitos Previos

- [Node.js](https://nodejs.org/) v18 o superior
- [npm](https://www.npmjs.com/) v9 o superior
- [just](https://github.com/casey/just) *(opcional, para comandos abreviados)*

---

## 🏎️ Inicio Rápido

### 1. Clonar e Instalar

```bash
git clone <url-del-repositorio>
cd Sistema-Torneos

# Setup automático (crea archivo .env e instala dependencias)
just setup
```

### 2. Iniciar el Servidor de Desarrollo

```bash
just dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### 3. Detener el Servidor

```bash
just stop
```

---

## 💻 Comandos Disponibles

| Comando | Descripción |
|---|---|
| `just setup` | Configura el entorno (`.env`) e instala dependencias |
| `just dev` | Inicia el servidor de desarrollo |
| `just stop` | Detiene el proceso en el puerto 3000 |
| `just check` | Ejecuta la verificación de TypeScript (`typecheck`) y Biome (`lint`) |
| `just lint-fix` | Corrige y formatea el código automáticamente con Biome |
| `just build` | Compila la aplicación para producción |
| `just docker-up` | Inicia la aplicación en un contenedor Docker |
| `just docker-down` | Detiene el contenedor Docker |

---

## 🐳 Ejecución con Docker

Si preferís ejecutar la aplicación en un contenedor de desarrollo:

```bash
# Iniciar contenedor
just docker-up

# Detener contenedor
just docker-down
```
