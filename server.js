const express = require("express");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
const cors = require("cors");
const morgan = require("morgan");

const connectDB = require("./config/db");

const app = express();

//* Swagger Docs
//#region
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Rest API JS",
      description: "API Information",
      contact: {
        name: "Cool",
      },
      servers: ["http://localhost:5000"],
    },
  },
  apis: ["./routes/api/*.js"],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
//#endregion

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));
app.use(morgan("combined"));
app.use(cors());
app.use(express.json());

// Connect Database
connectDB();

// Define Routes
app.get("/", (_, res) => res.send("API Running"));
app.use("/api/users", require("./routes/api/users"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
