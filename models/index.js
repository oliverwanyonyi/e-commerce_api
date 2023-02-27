const Sequelize = require("sequelize");

const sequelize = new Sequelize("ecomerce", "root", "", {
  host: "localhost",
  dialect: "mysql", 
  logging: false,
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Product = require("./Product.js")(sequelize, Sequelize);
db.Product_Images = require("./Product_Images.js")(sequelize, Sequelize);
db.Categories = require('./Category.js')(sequelize,Sequelize)
db.Reviews = require('./Review.js')(sequelize,Sequelize)
db.Product.hasMany(db.Product_Images, {
  onDelete: "cascade",
});
db.Product_Images.belongsTo(db.Product)
db.Product.hasMany(db.Reviews,{
    onDelete:"cascade"
})
db.Reviews.belongsTo(db.Product)
db.Categories.hasMany(db.Product)
db.Product.belongsTo(db.Categories)

module.exports = db;
