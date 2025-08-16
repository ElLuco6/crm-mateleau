# Déps de build (dev incluses)
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build TypeScript -> dist
FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build   # nécessite "build": "tsc" dans package.json

# Déps prod uniquement
FROM node:20-alpine AS prod-deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# Runtime final, léger
FROM node:20-alpine
WORKDIR /app
ENV NODE_OPTIONS=--enable-source-maps
ENV NODE_ENV=production
ENV PORT=5000
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package*.json ./
EXPOSE 5000
CMD ["node", "dist/server.js"]
