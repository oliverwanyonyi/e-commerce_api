module.exports = (sequelize,Sequelize)=>{
  const User = require("./User")(sequelize, Sequelize);

    const shippingAddress = sequelize.define("ShippingAddress",{
        FirstName: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          LastName: {
            type: Sequelize.STRING,
            allowNull: false,
          }, Phone: {
            type: Sequelize.STRING,
            allowNull: false,
          }, SecondPhone: {
            type: Sequelize.STRING,
            allowNull: false,
          }, DeliveryAddress: {
            type: Sequelize.STRING,
            allowNull: false,
          },Region: {
            type: Sequelize.STRING,
            allowNull: false,
          }, 
          City:{
            type: Sequelize.STRING,
            allowNull: false,
          },user_id: {
            type: Sequelize.INTEGER,
            references: {
              model: User,
              key: "id",
            },
          },
    })
    return shippingAddress
}