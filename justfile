# Sistema de Simulación de Torneos Deportivos
# Justfile — Comandos simplificados de desarrollo

# Mostrar ayuda con todos los comandos disponibles
default:
    @just --list

# Realizar el setup inicial del proyecto (crear .env, instalar dependencias)
setup:
    @echo "⚙️ Configurando el entorno del proyecto..."
    @if [ ! -f .env ]; then cp .env.example .env && echo "✅ Archivo .env creado desde .env.example"; else echo "ℹ️ El archivo .env ya existe"; fi
    @echo "📦 Instalando dependencias de Node.js..."
    npm install
    @echo "🎉 Setup completado. Ejecuta 'just dev' para iniciar el servidor."

# Iniciar servidor de desarrollo Next.js
dev:
    npm run dev

# Detener cualquier proceso de desarrollo corriendo en el puerto 3000
stop:
    @echo "🛑 Apagando la aplicación en el puerto 3000..."
    @fuser -k 3000/tcp 2>/dev/null || true
    @echo "✅ Aplicación apaga/detenida."

# Compilar la aplicación para producción
build:
    npm run build

# Iniciar la aplicación compilada en producción
start:
    npm run start

# Verificar tipado de TypeScript sin compilar
typecheck:
    npx tsc --noEmit

# Ejecutar linter con Biome (solo reporta errores)
lint:
    npx @biomejs/biome check src/

# Formatear y corregir automáticamente con Biome
lint-fix:
    npx @biomejs/biome check --write src/

# Correr typecheck + linting completo (usar antes de commits)
check: typecheck lint

# Limpiar caché de Next.js, node_modules y package-lock
clean:
    rm -rf .next node_modules package-lock.json .env

# Levantar entorno contenerizado con Docker Compose (modo desarrollo)
docker-up:
    docker compose -f docker/docker-compose.yml up --build -d

# Detener entorno Docker
docker-down:
    docker compose -f docker/docker-compose.yml down

# Ver logs del contenedor Docker
docker-logs:
    docker compose -f docker/docker-compose.yml logs -f app
