FROM node:20-alpine AS base
WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm ci

# Copiar código fuente
COPY . .

EXPOSE 3000

# Hot-reload en desarrollo
CMD ["npm", "run", "dev"]
