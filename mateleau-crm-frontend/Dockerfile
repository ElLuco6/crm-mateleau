# Utilise une image officielle de Node.js pour le build
FROM node:14 as build

# Définir le répertoire de travail
WORKDIR /usr/src/app

# Copier les fichiers package et installer les dépendances
COPY package*.json ./
RUN npm install

# Copier les fichiers et construire l'application
COPY . .
RUN npm run build -- --configuration production

# Étape de production avec une image Nginx
FROM nginx:alpine

# Copier les fichiers générés vers le dossier Nginx
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# Exposer le port utilisé par Nginx (par exemple : 80)
EXPOSE 80

# Commande pour démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]