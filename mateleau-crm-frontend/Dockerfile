# Step 1: Build Angular
FROM node:20-alpine AS build
WORKDIR /app

COPY mateleau-crm-frontend/package*.json ./
RUN npm ci
COPY mateleau-crm-frontend/ .
RUN npm run build -- --configuration production

# Step 2: Serve with Nginx
FROM nginx:alpine

# confs
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# copier la build Angular (Angular 17+ -> /browser)
COPY --from=build /app/dist/mateleau-crm-frontend/browser /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
