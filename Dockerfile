# ---------- Etapa de build ----------
FROM node:22-alpine AS build
WORKDIR /app

# 1) Copiamos solo archivos de dependencias para aprovechar el cache
COPY package*.json ./

# 2) Instalar deps en limpio (usa package-lock)
RUN npm ci --no-audit --no-fund

# 3) Copiar el resto del código
COPY . .

# 4) Build de producción (tu script corre type-check + vite build)
RUN npm run build

# ---------- Etapa de runtime (Nginx) ----------
FROM nginx:1.27-alpine AS runtime

# Reemplazar el sitio por defecto con una config para SPA (history mode)
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar artefactos estáticos generados por Vite
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
