import swaggerJsDoc from "swagger-jsdoc"

const options = {
  definition: {openapi: "3.0.0",
    info: {
      title: "Documentacion Backend",
      version: "1.0.0",
      description: "Documentacion del ecommerce"
    },
  },
  apis:["./src/docs/*.yaml"]
}

export const specs = swaggerJsDoc(options);