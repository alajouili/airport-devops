# ============================================================
# Stage 1 : BUILD — compile Angular avec Node 24
# ============================================================
FROM node:24-alpine AS build
WORKDIR /app

# Dépendances d'abord (cache), comme pour Maven
COPY package.json package-lock.json ./
RUN npm ci

# Code source puis build de production
COPY . .
RUN npm run build

# ============================================================
# Stage 2 : RUN — Nginx sert les fichiers statiques
# ============================================================
FROM nginx:stable-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html
EXPOSE 80