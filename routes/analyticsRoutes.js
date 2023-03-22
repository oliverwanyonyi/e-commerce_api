const db = require("../models");

const router = require("express").Router();
const Product = db.Product;
const Categories = db.Categories;
const Order = db.Order;
const User  = db.User;


router.route("/").get(async(req,res,next)=>{
    // console.log("next");
     try {
       const orderCount = await Order.count();
       const userCount = await User.count();
       const productCount = await Product.count();
       const categoriesCount = await Categories.count();
       const orderTotalAmount = await Order.sum("orderTotal")  || 0
       console.log(orderTotalAmount);
       res.json({
         userCount,productCount,categoriesCount,orderTotalAmount,orderCount
       })
     } catch (error) {
       next(error)
     }
    
   })



module.exports = router