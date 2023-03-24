module.exports = (sequelize, Sequelize) => {
  const User = require("./User")(sequelize, Sequelize);

  const reviews = sequelize.define("Review", {
    rate: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    comment: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    user_id: {
      type: Sequelize.INTEGER,
      references: {
        model: User,
        key: "id",
      },
    },
    verified: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  });

  return reviews;
};
