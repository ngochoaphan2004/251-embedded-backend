const swagger_config = (app, PORT) => {
    const swaggerUi = require('swagger-ui-express');
    const swaggerJsdoc = require('swagger-jsdoc');

    const swaggerOptions = {
        definition: {
            openapi: '3.0.0',
            info: {
                title: 'Smart Farm Backend API',
                version: '1.0.0',
                description: 'API documentation for Smart Farm backend using Express and Swagger',
                contact: {
                    name: 'Developer',
                    email: 'you@example.com'
                },
            },
            servers: [
                {
                    url: `http://localhost:${PORT}`,
                    description: 'Local development server'
                }
            ],
        },
        apis: ['./routes/*.js', './index.js'],
    };

    const swaggerSpec = swaggerJsdoc(swaggerOptions);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = swagger_config