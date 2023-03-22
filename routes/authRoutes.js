const router = require("express").Router();
const { genSaltSync, hashSync, compareSync } = require("bcryptjs");
const { Token } = require("../models");
const jwt = require('jsonwebtoken');
const db = require("../models");
const { generateToken } = require("../utils/generateToken");
const { protect } = require("../middlewares/authMiddleware");
const User = db.User;

router.route("/register").post(async (req, res, next) => {
  try {
    const { email, name, password, phone } = req.body;
    console.log(email);
    let user = await User.findOne({ where: { email } });
    if (user) {
      res.status(400);
      throw new Error("User with that email address already exists");
    }
    const salt = genSaltSync(10);
    const hashedPassword = hashSync(password, salt);
    user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
    });
    const { access_token, refresh_token } = generateToken(user.id);
    await Token.create({
      token: refresh_token,
      userId: user.id,
    });
    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, //expire after 7 days
    });

    res.json({
      user,
      access_token,
    });
  } catch (error) {
    next(error);
  }
});

// login

router.route("/login").post(async (req, res,next) => {
  try {
    const { password, email } = req.body;
    const user = await User.findOne({ where: { email } });
    // if no user or password don't match
    if (!user || !compareSync(password, user.password)) {
      res.status(400);
      throw new Error("Invalid email or password");
    }
    const { access_token, refresh_token } = generateToken(user.id);
    res.status(200).json({
      user,
      access_token,
      refresh_token,
    });
  } catch (error) {
    next(error);
  }
});

// refresh token

router.route("/token/refresh").get(async (req, res, next) => {
 
  try {
    const token = req.cookies?.refresh_token
    console.log(req.cookies);
    if(!token) return res.status(403)
     const payload = await jwt.verify(token, process.env.refresh_token_secret);
     if (!payload) {
       res.status(401);
       throw new Error("Session expired Login again!");
     }
     const access_token = jwt.sign(
       { id: payload.id },
       process.env.access_token_secret,
       { expiresIn: "1m" }
     );
  res.json({ access_token });

    
  } catch (error) {
    next(error)
  }
 

});

router.route('/users/update').put(protect,async(req,res,next)=>{
  try {
 let user = await User.findOne({where:{id:req.user.id}})
    user.name = req.body.name;
    user.email = req.body.email;
    user.phone = req.body.phone;
    user = await user.save();
    res.json({user})
  } catch (error) {
    next(error)
  }
})
module.exports = router;
