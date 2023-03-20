const router = require("express").Router();
const { protect } = require("../middlewares/authMiddleware");
const db = require("../models");
const ShippingAddress = db.ShippingAddress;
const Order = db.Order;
const OrderItem = db.OrderItem;
//creating shipping address

router.route("/shipping-address").post(async(req, res, next) => {
  console.log(req.body);
  try {
    const {
      firstName,
      lastName,
      phone,
      secondPhone,
      deliveryAddress,
      region,
      city,
    } = req.body;
    const shippingAddress = await ShippingAddress.create({
      FirstName: firstName,
      LastName: lastName,
      Phone: phone,
      SecondPhone: secondPhone,
      DeliveryAddress: deliveryAddress,
      City: city,
      Region: region,
      userId: 1,
    });
    res.status(201).json(shippingAddress);
  } catch (error) {
    next(error);
  }
});

// authorized user shipping addresses

router.route("/shipping-address/all").get(async (req, res, next) => {
  try {
    const shippingAddresses = await ShippingAddress.findAll({
      where: {
        userId: 1,
      },
    });

    res.status(200).json({ shippingAddresses });
  } catch (error) {
    next(error);
  }
});

// create order

router.route("/place").post(async (req, res, next) => {
  try {
    const order = await Order.create({
      paymentMethod: req.body.paymentMethod,
      shippingAddress: req.body.shippingAddress,
      orderTotal: req.body.orderTotal,
      userId: 1,
    });

    for (const item of req.body.orderItems) {
      await OrderItem.create({
        OrderId: order.id,
        itemId: item.id,
        title: item.title,
        price: item.price,
        product_display: item.thumb,
        discount: item.discount,
        quantity:item.quantity
      });
    }
    res.sendStatus(201);
  } catch (error) {
    next(error);
  }
});

router.route("/all").get(async (req, res, next) => {
  try {
    let newOrders = [];
    const orders = await Order.findAll({
      where: {
        userId: 1,
      },
    });

    for (let order of orders) {
      console.log(order);
      const orderItems = await OrderItem.findAll({
        where: { orderId: order.id },
      });
      order = { ...order.dataValues, orderItems };
      newOrders.push(order);
    }
    res.json({ orders: newOrders });
  } catch (error) {
    next(error);
  }
});

router.route("/:id").get(async (req, res, next) => {
  try {
    let order = await Order.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!order) throw new Error("Order not found");
    const orderItems = await OrderItem.findAll({
      where: { OrderId: req.params.id },
    });
    order = { ...order.dataValues, orderItems };
    res.json({order});
  } catch (error) {
    next(error);
  }
});
module.exports = router;
