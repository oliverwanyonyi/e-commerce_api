module.exports = (sequelize, Sequelize) => {
  const Product = sequelize.define("Product", {
    name: {
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
  });

  return Product;
};
