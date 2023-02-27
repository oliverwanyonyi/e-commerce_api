
module.exports = (sequelize,Sequelize) => {
  const reviews = sequelize.define("Review", {
    rate: {
      type: Sequelize.FLOAT,
    },
    comment: {
      type: Sequelize.STRING,
    },
   
  });

  return reviews;
};
