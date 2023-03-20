const { default: slugify } = require("slugify");
const db = require("../models");
const Product = db.Product;
const Categories = db.Categories;

const Product_Images = db.Product_Images;
const router = require("express").Router();

router.route("/create").post(async (req, res) => {
  console.log(req.body);
  let product = {
    name: req.body.name,
    description: req.body.description,
    CategoryId: req.body.category,
    discount: req.body.discount,
    countInStock: req.body.countInStock,
    slug: slugify(req.body.name),
    price: req.body.price,
  };

  product = await Product.create(product);

  let img;
  for (const image of req.body.product_images) {
    img = await Product_Images.create({
      ...image,
      ProductId: product.id,
    });
  }
  res.status(201).json({ name: product.name });
})

router.route("/").get(async (req, res) => {
  const products = await Product.findAll({
    include: [
      { model: Categories, attributes: ["name"] },
      { model: Product_Images, attributes: ["id", "url"] },
    ],
  });
  res.json(products);
});

router.route("/:id").get(async (req, res, next) => {
  console.log(req.params.id);
  try {
    let product = await Product.findByPk(req.params.id, {
      include: [
        { model: Product_Images, attributes: ["id", "url"] },
        { model: Categories, attributes: ["name"] },
      ],
    });

    res.status(200).json({
      product,
      hierachies: [
        { name: "Home", path: "/" },
        { name: product.Category.name, path: "/search" },
        { name: product.name, path: "/" + product.id },
      ],
    });
  } catch (error) {
    next(error);
  }
});
module.exports = router;
