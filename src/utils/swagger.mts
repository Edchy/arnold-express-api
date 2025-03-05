import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { PORT } from "./constants.mjs";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Workout API",
      version: "1.0.0",
      description: "API for managing workouts and users",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: "Development server",
      },
    ],
  },
  apis: ["./src/routes/*.mts", "./src/models/*.mts"], // Path to the API docs
};

const specs = swaggerJsdoc(options);

export { swaggerUi, specs };
