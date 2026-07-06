# Stage 1: Build
# Using node:22-alpine instead of 20-alpine because Vite / rolldown requires Node 20.19+ or 22.12+
# as we saw in local build errors. Node 22-alpine gets the latest 22.x LTS (e.g. 22.13+).
FROM node:22-alpine AS builder

WORKDIR /app

# Declare ARG to receive value at build time.
# Vì Vite là công cụ build tĩnh, các biến môi trường VITE_ phải có sẵn lúc chạy npm run build.
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Runtime
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
