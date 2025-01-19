import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Mateleau CRM API',
            version: '1.0.0',
            description: 'API documentation for Mateleau CRM',
        },
        servers: [
            {
                url: 'http://localhost:3000/api',
                description: 'Local server',
            },
        ],
    },
    apis: ['./src/routes/*.ts', './src/models/*.ts'], // Chemins vers les fichiers contenant les annotations JSDoc
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Application) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};