# Etapa 1: build da aplicação
FROM node:lts-alpine3.22 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa 2: imagem final para produção
FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/src/assets ./src/assets
RUN npm install --only=production
CMD ["node", "dist/src/main.js"]
