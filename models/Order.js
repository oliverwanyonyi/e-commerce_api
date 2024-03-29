const { DataTypes } = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  const ShippingAddress = require("./ShippingAddress")(sequelize, Sequelize);
  const User = require("./User")(sequelize, Sequelize);
  const Transaction = require('./Transaction')(sequelize, Sequelize)
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

    delivered: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    status: {
      type: DataTypes.ENUM(
        "placed",
        "confirmed",
        "shipped",
        "delivered",
        "cancelled",
        "ready for pickup"
      ),
      default: "placed",
    },
    deliveredAt: {
      type: Sequelize.DATE,
    },
    orderTotal: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
    shippingAddress: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: ShippingAddress,
        key: "id",
      },
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    transactionId:{
      type: Sequelize.INTEGER,
      references: {
        model: Transaction,
        key: "id",
      },
    }
  });
  return order;
};
