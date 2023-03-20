
module.exports = (sequelize, Sequelize) => {

  const orderItem = sequelize.define("OrderItem", {
    itemId: {
      type: Sequelize.INTEGER,
      references: {
        model: "products",
        key: "id",
      },
    },
    title:{
      type:Sequelize.STRING,
      allowNull:false
    },
    product_display:{
      type:Sequelize.STRING,
      allowNull:false
    },price: {
      type:Sequelize.DECIMAL(10, 2),
      allowNull:false,
    },discount: {
      type:Sequelize.DECIMAL(10, 2),
      allowNull:false,
    },
    quantity:{
      type:Sequelize.INTEGER,
      allowNull:false
    }
  });
  return orderItem;
};
