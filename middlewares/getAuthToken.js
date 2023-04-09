const axios = require("axios");
require("dotenv").config(process.env.auth_token_url);
exports.getAuthToken = async (req, res, next) => {
  const consumer_secret = process.env.consumer_secret;
  const consumer_key = process.env.consumer_key;
  const url = process.env.auth_token_url;
  console.log(consumer_key,consumer_secret);
  const buffer = new Buffer.from(consumer_key + ":" + consumer_secret);
  const auth = `Basic ${buffer.toString("base64")}`;
  
console.log(auth);
  try {
    let { data } = await axios.get(url, {
      headers: {
        Authorization: auth,
      },
    });

    req.token = data.access_token;
    

    return next();
  } catch (error) {
    console.log(error.response);
    return res.send({
      success: false,
      message: error?.response?.statusText,
    });
  }
};
