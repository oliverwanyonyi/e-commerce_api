
module.exports = (sequelize,Sequelize) => {
  const reviews = sequelize.define("Review", {
    rate: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    comment: {
      type: Sequelize.STRING,
      allowNull: false,
    },
   
  });

  return reviews;
};
