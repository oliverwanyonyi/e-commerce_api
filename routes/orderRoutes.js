const router = require("express").Router();
const { protect } = require("../middlewares/authMiddleware");
const db = require("../models");
const ShippingAddress = db.ShippingAddress;
const Order = db.Order;
const OrderItem = db.OrderItem;
//creating shipping address

router.route("/shipping-address").post(protect, async (req, res, next) => {
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
      user_id: req.user.id,
    });
    res.status(201).json(shippingAddress);
  } catch (error) {
    next(error);
  }
});

// authorized user shipping addresses

router.route("/shipping-address/all").get(protect, async (req, res, next) => {
  console.log('running');
  try {
    const shippingAddresses = await ShippingAddress.findAll({
      where: {
        user_id: req.user.id,
      },
    });

    res.status(200).json({ shippingAddresses });
  } catch (error) {
    next(error);
  }
});

// create order

router.route("/place").post(protect, async (req, res, next) => {
  try {
    const order = await Order.create({
      paymentMethod: req.body.paymentMethod,
      shippingAddress: req.body.shippingAddress,
      orderTotal: req.body.orderTotal,
      userId: req.user.id,
      status: "placed",
    });

    for (const item of req.body.orderItems) {
      await OrderItem.create({
        OrderId: order.id,
        itemId: item.id,
        title: item.title,
        price: item.price,
        product_display: item.thumb,
        discount: item.discount,
        quantity: item.quantity,
      });
    }
    res.sendStatus(201);
  } catch (error) {
    next(error);
  }
});

// authorized user all orders
router.route("/user/all").get(protect, async (req, res, next) => {
  try {
  
    let newOrders = [];
   const orders = await Order.findAll({
      where: {
        userId: req.user.id,
      },
    });
    
console.log(orders);
    for (let order of orders) {
      const orderItems = await OrderItem.findAll({
        where: { orderId: order.id },
      });
      order = { ...order.dataValues, orderItems };
      newOrders.push(order);
    }
    res.json({ orders: newOrders });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// all orders
router.route("/all").get(async (req, res, next) => {
  try {
    const orders = await Order.findAll({});

    res.json({ orders });
  } catch (error) {
    next(error);
  }
});

// authorized user single order
router.route("/:id").get(protect, async (req, res, next) => {
  try {
    let order = await Order.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });
    if (!order) throw new Error("Order not found");
    const orderItems = await OrderItem.findAll({
      where: { OrderId: req.params.id },
    });
    order = { ...order.dataValues, orderItems };
    res.json({ order });
  } catch (error) {
    next(error);
  }
});
// update an order
router.route("/:id/update").post(async (req, res, next) => {
  console.log(req.params.id);

  try {
    const order = await Order.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!order) throw new Error("Order not found");
    order.paid = +req.body.paymentStatus === 1 ? true : false;
    console.log(req.body.paymentStatus);
    if (+req.body.paymentStatus === 1) {
      order.paidAt = Date.now();
    }
    order.status = req.body.status;
    console.log(req.body.status);
    if (req.body.status === "delivered") {
      order.status = req.body.status;
      order.deliveredAt = Date.now();
      order.delivered = true;
    }else{
      order.delivered = false;
      order.deliveredAt = null
    }

    await order.save();
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
