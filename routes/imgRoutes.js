const router = require("express").Router();
const cloudinary = require('cloudinary')
require('dotenv').config()
cloudinary.config({
    cloud_name:process.env.cloud_name,
    api_key:process.env.api_key,
    api_secret:process.env.api_secret
})
router.route('/images/:public_id').delete(async(req,res)=>{
    try {
        console.log(req.params);
        await cloudinary.uploader.destroy(req.params.public_id)
        res.send("image destroyed")
    } catch (error) {
        res.status(400).send(error.message)
        console.log(error);
    }
})

module.exports = router;
