const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const db = require("./models");
const imagesRoute = require("./routes/imgRoutes.js");
const productRoutes = require("./routes/productRoutes.js");
const categoryRoutes = require("./routes/categoryRoutes.js");
const authRoutes = require("./routes/authRoutes.js");
const orderRoutes = require("./routes/orderRoutes.js");
const analyticsRoutes = require("./routes/analyticsRoutes.js");

const { notFound, errorHandler } = require("./middlewares/error");
const credentials = require("./middlewares/credentials");
dotenv.config();

// middlewares

app.use(cookieParser());



// set up cors

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://shopyetu.netlify.app",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes

app.use("/api/products", productRoutes);
app.use("/api/resources", imagesRoute);
app.use("/api/categories", categoryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/analytics", analyticsRoutes);
// error handling

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  db.sequelize
    .sync({force:true})
    .then(() => {
      console.log("Synced db.");
    })
    .catch((err) => {
      console.log("Failed to sync db: " + err.message);
    });
});
