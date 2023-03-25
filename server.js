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
dotenv.config();

// middlewares

app.use(cookieParser());

// set up cors

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin','https;//shopyetu.netlify.app');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// app.use(
//   cors({
//     origin: "*",
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     preflightContinue: true,
//     maxAge: 3600,
//     // Add Access-Control-Allow-Origin header here
//     exposedHeaders: [
//       "Content-Type",
//       "Authorization",
//       "Access-Control-Allow-Origin",
//     ],
//   })
// );

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
    .sync()
    .then(() => {
      console.log("Synced db.");
    })
    .catch((err) => {
      console.log("Failed to sync db: " + err.message);
    });
});
