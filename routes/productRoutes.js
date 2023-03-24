const { default: slugify } = require("slugify");
const { protect } = require("../middlewares/authMiddleware");
const { Sequelize } = require("../models");
const db = require("../models");
const Review = db.Reviews;
const Product = db.Product;
const Categories = db.Categories;
const User = db.User;

const Product_Images = db.Product_Images;
const router = require("express").Router();

router.route("/create").post(async (req, res) => {
  console.log(req.body);
  let product = {
    title: req.body.name,
    description: req.body.description,
    CategoryId: req.body.category,
    SubCategoryId: req.body.sub_category,
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
});

router.route("/").get(async (req, res,next) => {
  try {
    const products = await Product.findAll({
      attributes: [
        "id",
        "title",
        "description",
        "price",
        "countInStock",
        "slug",
        "discount",
        [
          Sequelize.fn(
            "COALESCE",
            Sequelize.fn("AVG", Sequelize.col("reviews.rate")),
            0
          ),
          "averageRating",
        ],
        [Sequelize.fn("COUNT", Sequelize.col("reviews.id")), "reviewsCount"],
      ],
      include: [
        {
          model: Review,
          attributes: [],
        },
        { model: Categories, attributes: ["name"] },
        { model: Product_Images, attributes: ["id", "url"] },
      ],
      group: ['Product.id']
    });
    res.json(products);
  } catch (error) {
    next(error)
  }
  
});

router.route("/:id").get(async (req, res, next) => {
  try {
    let product = await Product.findOne({
      where: { id: req.params.id },

      attributes: [
        "id",
        "title",
        "description",
        "price",
        "countInStock",
        "slug",
        "discount",
        [
          Sequelize.fn(
            "COALESCE",
            Sequelize.fn("AVG", Sequelize.col("reviews.rate")),
            0
          ),
          "averageRating",
        ],
        [Sequelize.fn("COUNT", Sequelize.col("reviews.id")), "reviewsCount"],
      ],

      include: [
        {
          model: Review,
          attributes: [
            "comment",
            "rate",
            "createdAt"
          ],
        },
        { model: Product_Images, attributes: ["id", "url"] },
        { model: Categories, attributes: ["name", "slug", "id"] },
      ],
      group: ["Product.id","Product_Images.id"],
    });

    if (!product) throw new Error("product not found");

    res.status(200).json({
      product,
      hierachies: [
        { name: "Home", path: "/" },
        {
          name: product?.Category.name,
          path: "/shop?search_term=" + product?.Category.slug,
        },
        { name: product?.title, path: "/" + product.id },
      ],
    });
  } catch (error) {
    next(error);
  }
});

router.route("/:id/rate").post(protect, async (req, res, next) => {
  try {
    const alreadyReviewed = await Review.findOne({
      where: {
        user: req.user.id,
        ProductId: req.params.id,
      },
    });
    if (alreadyReviewed)
      throw new Error("It seems you already reviewed this product");
    await Review.create({
      rate: req.body.rate,
      comment: req.body.comment,
      user: req.user.id,
      ProductId: req.params.id,
    });
    res.sendStatus(201);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
