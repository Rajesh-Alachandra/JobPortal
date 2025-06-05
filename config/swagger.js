import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Swagger definition
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Test API Documentation',
        version: '1.0.0',
        description: 'API documentation for the JOB PORTAL backend system',
    },
    servers: [
        {
            url: 'http://localhost:4000',
            description: 'Development server',
        },
    ],
    components: {
        securitySchemes: {
            BearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
    },
    security: [
        {
            BearerAuth: [],
        },
    ],
};

// Swagger options
const options = {
    swaggerDefinition,
    apis: ['./src/routes/*.js'],  // Pointing to your route files with Swagger annotations
};

const swaggerSpec = swaggerJsDoc(options);

// Setup Swagger UI
const setupSwagger = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    // Endpoint for raw Swagger JSON
    app.get('/swagger.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });
};

export default setupSwagger;  // Using ES6 export


/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication and Authorization APIs
 *   - name: Tests
 *     description: APIs related to managing tests
 *   - name: Reports
 *     description: APIs related to test reports
 */


