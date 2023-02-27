module.exports = (sequelize, Sequelize) => {
  const categories = sequelize.define("Category", {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    slug: {
      type: Sequelize.STRING,
      allowNull: false,
      unique:{name: 'unique_name_constraint',
      msg: 'That Category already exists'}
    },
  });
  return categories;
};
