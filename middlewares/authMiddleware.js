const { User } = require("../models");

const protect = (req,res,next) =>{
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.sendStatus(401);
  
    jwt.verify(token, process.env.access_token_secret, (err, payload) => {
      // console.log(err)
      if (err) return res.sendStatus(403);
      const user = await User.findOne({where:{id:payload.id}});

      req.user = user;

      next()
    });
}