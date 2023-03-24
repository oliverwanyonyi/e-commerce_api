const Sequelize = require("sequelize");
require("dotenv").config();
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  // "ecomerce",
  // "root",
  // "",
  {
    host: process.env.HOST,
    dialect: "postgres",
    // host: "localhost",
    // dialect: "mysql",
    logging: false,
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Product = require("./Product.js")(sequelize, Sequelize);
db.Product_Images = require("./Product_Images.js")(sequelize, Sequelize);
db.Categories = require("./Category.js")(sequelize, Sequelize);
db.Reviews = require("./Review.js")(sequelize, Sequelize);
db.Token = require("./Token")(sequelize, Sequelize);
db.ShippingAddress = require("./ShippingAddress")(sequelize, Sequelize);
db.User = require("./User")(sequelize, Sequelize);
db.Order = require("./Order")(sequelize, Sequelize);
db.OrderItem = require("./OrderItem")(sequelize, Sequelize);
db.SubCategories = require("./SubCategory")(sequelize, Sequelize);
db.Product.hasMany(db.Product_Images, {
  onDelete: "cascade",
});
db.Product_Images.belongsTo(db.Product);
db.Product.hasMany(db.Reviews, {
  onDelete: "cascade",
});
db.Reviews.belongsTo(db.Product);
db.Categories.hasMany(db.Product);
db.Product.belongsTo(db.Categories);
db.User.hasMany(db.Token);
db.Token.belongsTo(db.User);
db.User.hasMany(db.ShippingAddress);
db.User.hasMany(db.Order);
db.Order.belongsTo(db.User);
db.OrderItem.belongsTo(db.Order);
db.Order.hasMany(db.OrderItem);
db.Categories.hasMany(db.SubCategories, {
  onDelete: "cascade",
});
db.SubCategories.belongsTo(db.Categories);
db.SubCategories.hasMany(db.Product);
db.Product.belongsTo(db.SubCategories);
module.exports = db;
