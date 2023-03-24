
module.exports = (sequelize, Sequelize) => {
  const Category = require('./Category')(sequelize, Sequelize);
  const SubCategory = require('./SubCategory')(sequelize, Sequelize);

  const Product = sequelize.define("Product", {
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    
    discount: {
      type: Sequelize.DOUBLE,
      allowNull: false,
    },
    price: {
      type: Sequelize.DOUBLE,
      allowNull: false,
    },
    slug: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    countInStock: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    CategoryId:{
      type:Sequelize.INTEGER,
      allowNull:false,
      references:{
        model:Category,
        key:"id"
      }
    },SubCategoryId:{
      type:Sequelize.INTEGER,
      allowNull:false,
      references:{
        model:SubCategory,
        key:"id"
      }
    }
  });

  return Product;
};
