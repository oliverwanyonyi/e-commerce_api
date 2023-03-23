const db = require("../models");
const User = db.User;
const jwt = require('jsonwebtoken')
exports.protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  
  if (!token) return res.sendStatus(403);

  jwt.verify(token, process.env.access_token_secret, async (err, payload) => {
    // console.log(err)
    if (err) return res.sendStatus(403);
    const user = await User.findOne({ where: { id: payload.id } });
     if(!user) throw new Error("User not found")
    req.user = user;

    next();
  });
};
