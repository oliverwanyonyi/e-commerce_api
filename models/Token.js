
module.exports = (sequelize, Sequelize) => {
  const token = sequelize.define("token", {
    token: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });
  return token
};
