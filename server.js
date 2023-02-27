const express = require("express");
const dotenv = require("dotenv");
const cors = require('cors')
const app = express();
const db = require("./models");
const imagesRoute = require("./routes/imgRoutes.js");
const productRoutes = require("./routes/productRoutes.js");
const categoryRoutes = require("./routes/categoryRoutes.js");

const { notFound, errorHandler } = require("./middlewares/error");
dotenv.config();

// middlewares

app.use(cors({
  origin:"https://shopyetu.netlify.app"
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes

app.use("/api/products", productRoutes);
app.use("/api/resources", imagesRoute);
app.use("/api/categories", categoryRoutes);

// error handling

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(port);
  db.sequelize
    .sync()
    .then(() => {
      console.log("Synced db.");
    })
    .catch((err) => {
      console.log("Failed to sync db: " + err.message);
    });
});
