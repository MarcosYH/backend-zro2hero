const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const userRoutes = require("./routes/users");
const parcoursRoutes = require("./routes/parcours");
const labsRoutes = require("./routes/labs");

// require database connection
const dbConnect = require("./db/dbConnect");

dotenv.config(); // Load environment variables from .env file
dbConnect(); // execute database connection

// app.use(express.json({ limit: "200mb" }));
// app.use(express.urlencoded({ limit: "200mb", extended: true }));
// app.use(express.text({ limit: "200mb" }));

app.use(cookieParser());
// Curb Cores Error by adding a header here
app.use(cors());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

// body parser configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", userRoutes);
app.use("/parcours", parcoursRoutes);
app.use("/labs", labsRoutes);

module.exports = app;
