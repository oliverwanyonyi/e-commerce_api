
module.exports = (sequelize, Sequelize) => {
  const order = sequelize.define("Order", {
    paymentMethod: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    paid: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,  
    },
    paidAt: {
      type: Sequelize.DATE,
    },
   
    delivered:{
        type:Sequelize.BOOLEAN,
        defaultValue:false
    },
    deliveredAt: {
      type: Sequelize.DATE,
     
    },
    orderTotal: {
      type:Sequelize.DECIMAL(10, 2),
      allowNull:false,
    },
    shippingAddress:{
        type:Sequelize.INTEGER,
        allowNull:false,
        references:{
            model:"shippingaddresses",
            key:'id'
        }
    }
  });
  return order
};
