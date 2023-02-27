const { default: slugify } = require("slugify");
const db = require("../models");
const router = require("express").Router();
const Category = db.Categories;
router.route("/create").post(async (req, res, next) => {
  console.log(req.body);
  try {
    let category = {
      name: req.body.category,
      slug: slugify(req.body.category),
    };

    category = await Category.create(category);

    res.status(201).json({ category: category.name });
  } catch (error) {
    next(error);
  }
});

router.route("/").get(async (req, res) => {
  const categories = await Category.findAll();

  res.json(categories);
});

module.exports = router;
