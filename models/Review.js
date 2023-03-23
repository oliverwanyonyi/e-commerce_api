module.exports = (sequelize, Sequelize) => {
  const reviews = sequelize.define("Review", {
    rate: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    comment: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    user: {
      type: Sequelize.INTEGER,
      references: {
        model: "users",
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
