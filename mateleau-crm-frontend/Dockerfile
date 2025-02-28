FROM node:18 AS build

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build -- --configuration production

# Utilise une image de base minimale pour l'image finale
FROM alpine:latest

# Copier les fichiers générés vers le dossier de l'image finale
COPY --from=build /usr/src/app/dist/mateleau-crm-frontend /usr/src/app/dist/mateleau-crm-frontend

# Définir le répertoire de travail
WORKDIR /usr/src/app/dist/mateleau-crm-frontend

# Commande pour garder le conteneur actif
CMD ["tail", "-f", "/dev/null"]