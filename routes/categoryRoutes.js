const { default: slugify } = require("slugify");
const db = require("../models");
const SubCategory = db.SubCategories;
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



router.route("/categories&sub-categories").get(async (req, res, next) => {
 
  try {
    let new_categories = [];
    let categories = await Category.findAll();
    for (let cate of categories) {
      const sub_categories = await SubCategory.findAll({
        where: { CategoryId: cate.id },
      });
       cate = {...cate.dataValues,sub_categories}
      new_categories.push(cate);
    }
    res.json({ categories: new_categories });
  } catch (error) {
    next(error);
  }
});

router.route("/").get(async (req, res) => {
  const categories = await Category.findAll();

  res.json(categories);
});

router.route("/sub_category/create").post(async (req, res, next) => {
  try {
    let sub_category = await SubCategory.create({
      CategoryId: req.body.category,
      name: req.body.sub_category,
      slug: slugify(req.body.sub_category),
    });

    res.status(201).json({ sub_category: sub_category.name });
  } catch (error) {
    next(error);
  }
});
router.route("/sub-categories").get(async (req, res, next) => {
  try {
    const sub_categories = await SubCategory.findAll({
      include: { model: Category, attributes: ["name"] },
    });
    res.json({ sub_categories });
  } catch (error) {
    next(error);
  }
});
router.route("/sub-categories/:id").get(async (req, res, next) => {
  
  try {
    const sub_categories = await SubCategory.findAll({
      where: {
        CategoryId: req.params.id,
      },
    });
    res.json(sub_categories);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
