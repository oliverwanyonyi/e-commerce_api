module.exports = (sequelize, Sequelize) => {
  const sub_categories = sequelize.define("Subcategories", {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    slug: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: {
        name: "unique_name_constraint",
        msg: "That Sub Category already exists",
      },
    },
  });
  return sub_categories;
};
