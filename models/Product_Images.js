module.exports = (sequelize, Sequelize) => {
  const Product_Images = sequelize.define("Product_Images", {
    url: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    public_id:{
      type:Sequelize.STRING,
      allowNull:false
    }
  });
  return Product_Images;
};
