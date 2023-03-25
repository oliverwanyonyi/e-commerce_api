require("dotenv").config();
const jwt = require('jsonwebtoken')
exports.generateToken = (id) => {
  console.log(process.env.refresh_token_secret,process.env.access_token_secret);
  const access_token = jwt.sign({ id }, process.env.access_token_secret, {
    expiresIn: "1m",
  });
  const refresh_token = jwt.sign({ id }, process.env.refresh_token_secret, {
    expiresIn: "1w",
  });
  return {access_token, refresh_token};
};
