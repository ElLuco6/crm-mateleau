# Utilise une image officielle de Node.js pour le build
FROM node:18 as build

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
COPY --from=build /usr/src/app/dist/mateleau-crm-frontend /usr/share/nginx/html

# Copier le fichier de configuration Nginx
COPY src/nginx.conf /etc/nginx/nginx.conf
COPY src/conf.d/default.conf /etc/nginx/conf.d/default.conf

# Exposer le port utilisé par Nginx (par exemple : 80)
EXPOSE 80

# Commande pour démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]