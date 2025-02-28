# Step 1: Build Angular
FROM node:18 AS build

WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY mateleau-crm-frontend/package*.json ./
RUN npm install -g @angular/cli && npm install  # Install Angular CLI globally

# Copy the full Angular project
COPY mateleau-crm-frontend/ .  

# Run the Angular build
RUN npm run build -- --configuration production

# Step 2: Serve with Nginx
FROM nginx:alpine
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy built Angular app from the first stage
COPY --from=build /usr/src/app/dist/mateleau-crm-frontend/browser /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
