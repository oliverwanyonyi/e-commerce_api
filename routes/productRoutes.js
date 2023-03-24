const { Op } = require("sequelize");
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
  try {
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
    res.status(201).json({ name: product.title }); 
  } catch (error) {
    next(error)
  }
 
});

router.route("/").get(async (req, res, next) => {
  try {
    let products = await Product.findAll({
      attributes: [
        "id",
        "title",
        "description",
        "price",
        "countInStock",
        "slug",
        "discount",
      ],
      include: [
        { model: Categories, attributes: ["name"] },
        { model: Product_Images, attributes: ["id", "url"] },
      ],
    });
    let newProducts = [];
    for (let product of products) {
      const reviewsCount = await Review.count({
        where: {
          ProductId: product.id,
        },
      });
      const reviews = await Review.findAll({
        where: {
          ProductId: product.id,
        },
      });
      let averageRating = 0;
      for (const review of reviews) {
        averageRating += review.rate || 0;
      }
      averageRating = averageRating / reviewsCount;
      product = { ...product.dataValues, reviewsCount, averageRating };
      newProducts.push(product);
    }
    products = newProducts;
    res.json(products);
  } catch (error) {
    next(error);
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
        "CategoryId",
        "SubCategoryId",
      ],

      include: [
        { model: Product_Images, attributes: ["id", "url"] },
        { model: Categories, attributes: ["name", "slug", "id"] },
      ],
    });

    if (!product) throw new Error("product not found");

    //ratings and reviews
    const reviewsCount = await Review.count({
      where: {
        ProductId: product.id,
      },
    });
    let reviews = await Review.findAll({
      where: {
        ProductId: product.id,
      },
      attributes: ["createdAt", "id", "rate", "comment"],
      include: [{ model: User, attributes: ["email"] }],
    });

    let averageRating = 0;
    for (const review of reviews) {
      averageRating += review.rate || 0;
    }
    averageRating = averageRating / reviewsCount;

    // related products
    let newRelatedProducts = [];
    let relatedProducts = await Product.findAll({
      where: {
        [Op.and]: [
          {
            [Op.or]: [
              { SubCategoryId: product.SubCategoryId },
              { CategoryId: product.CategoryId },
            ],
          },
          { id: { [Op.ne]: req.params.id } },
        ],
      },
      include: [
        { model: Product_Images, attributes: ["id", "url"] },
      ]
    });
    for (let product of relatedProducts) {
      const reviewsCount = await Review.count({
        where: {
          ProductId: product.id,
        },
      });

      let averageRating = 0;
      for (const review of reviews) {
        averageRating += review.rate || 0;
      }
      averageRating = averageRating / reviewsCount;
      product = { ...product.dataValues, reviewsCount, averageRating };
      newRelatedProducts.push(product);
    }
    relatedProducts = newRelatedProducts;

    product = {
      ...product.dataValues,
      averageRating,
      reviewsCount,
      reviews,
      relatedProducts,
    };
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
  console.log(req.params.id);
  try {
    const alreadyReviewed = await Review.findOne({
      where: {
        user_id: req.user.id,
        ProductId: req.params.id,
      },
    });
    if (alreadyReviewed)
      throw new Error("It seems you already reviewed this product");
    await Review.create({
      rate: req.body.rate,
      comment: req.body.comment,
      user_id: req.user.id,
      ProductId: req.params.id,
    });
    res.sendStatus(201);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
