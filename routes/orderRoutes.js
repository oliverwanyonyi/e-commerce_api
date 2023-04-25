const router = require("express").Router();
const { protect } = require("../middlewares/authMiddleware");
const { getAuthToken } = require("../middlewares/getAuthToken");
const axios = require("axios");
const db = require("../models");
const ShippingAddress = db.ShippingAddress;
const Order = db.Order;
const Transaction = db.Transaction
const OrderItem = db.OrderItem;
require("dotenv").config();

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
  console.log("running");
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
    let order ={
      paymentMethod: req.body.paymentMethod,
      shippingAddress: req.body.shippingAddress,
      orderTotal: req.body.orderTotal,
      userId: req.user.id,
      status: "placed",
    }
    if(req.body.paymentMethod === "Mpesa"){
      order = {...order,transactionId:req.body.transactionId,paid:true,paidAt:Date.now()}
    }
    
    order =  await Order.create(order);
   

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

//process payment with mpesa

router.route("/pay").post(getAuthToken, async (req, res) => {
  let amount = req.body.amount;
  let phoneNumber = req.body.phoneNumber.substring(1);
  const token = req.token;
  const auth = "Bearer " + token;
  const timeStamp = require("../utils/generateTimeStamp")();
  const url = process.env.lipa_na_mpesa_url;
  const pass_key = process.env.pass_key;
  const bs_short_code = process.env.bs_short_code;
  const password = new Buffer.from(
    `${bs_short_code}${pass_key}${timeStamp}`
  ).toString("base64");
  const transcation_type = "CustomerPayBillOnline";
  phoneNumber = `254${phoneNumber}`;
  const partyA = phoneNumber;
  const partyB = bs_short_code;
  const callBackUrl = process.env.callback_url;
  console.log(callBackUrl);
  const accountReference = "0113513449";
  const transaction_desc = "test";

  try {
    const { data } = await axios.post(
      url,
      {
        BusinessShortCode: bs_short_code,
        Password: password,
        Timestamp: timeStamp,
        TransactionType: transcation_type,
        Amount: amount,
        PartyA: partyA,
        PartyB: partyB,
        PhoneNumber: phoneNumber,
        CallBackURL: callBackUrl,
        AccountReference: accountReference,
        TransactionDesc: transaction_desc,
      },
      {
        headers: {
          Authorization: auth,
        },
      }
    );
  
    await Transaction.create({
      amount,
      phone:partyA,
      checkoutId:data.CheckoutRequestID,
    }) 
    
    return res.send({
      success: true,
      message: data,
    });
  } catch (error) {
    console.log(error);
    return res.send({
      success: false,
      message: error.response?.data?.errorMessage,
    });
  }
});


let message;


router.route("/mpesa/callback").post( async(req, res, next) => {
  try {
 
    const response = req.body.Body.stkCallback;
     
    if(response.ResultCode === 0){
            const data = response.CallbackMetadata.Item;
            const reference = data[1].Value;;
           const transaction = await Transaction.findOne({where:{
              checkoutId:response.CheckoutRequestID
            }})
    
            transaction.paid = true;
            transaction.reference = reference;
           await transaction.save();
    }else{
      message = response.ResultDesc;
      await Transaction.destroy({
        where:{
          checkoutId:response.CheckoutRequestID
        }
      })
    }
    
  } catch (error) {
    
  }
  
});

router.route('/mpesa/fulfill', ).get(async(req,res,next)=>{
  try {
    const transaction = await Transaction.findOne({
      where:{
        checkoutId:req.query.checkoutId
      }
    })
    if(transaction){
      return res.json({
        transactionId:transaction.id
      })
    }
    res.statusCode = 400
    throw new Error(message)
  } catch (error) {
    next(error)
  }
      
})

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
        where: { OrderId: order.id },
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
    } else {
      order.delivered = false;
      order.deliveredAt = null;
    }

    await order.save();
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
