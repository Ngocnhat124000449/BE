import swaggerJSDoc from "swagger-jsdoc";

const isTs = import.meta.url.endsWith(".ts");
const root = isTs ? "./src" : "./dist";
const ext = isTs ? "ts" : "js";

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.3",
    info: { title: "API Quan ly Hoc vu", version: "1.0.0" },
    components: {
      securitySchemes: {
        BearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },
    },
  },
  apis: [`${root}/routes/*.${ext}`, `${root}/server.${ext}`],
});