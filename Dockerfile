# ─── Etapa 1: Compilar Angular ────────────────────────────────────────────────
# Usamos Node 18 para compilar el proyecto
FROM node:18-alpine AS builder

WORKDIR /app

# Copiamos primero package.json para aprovechar cache de Docker
COPY package*.json ./
RUN npm ci

# Copiamos el resto del código y compilamos
COPY . .
RUN npm run build

# ─── Etapa 2: Servidor web Nginx ─────────────────────────────────────────────
# Nginx sirve los archivos estáticos generados por Angular
FROM nginx:alpine

# Copiamos la configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiamos los archivos compilados de Angular
COPY --from=builder /app/dist/inventory-frontend/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
