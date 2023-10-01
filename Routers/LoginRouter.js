const express= require('express')
const router=express.Router()
const controller = require('../Controllers/LoginController');
router.get("/",controller.get)
router.post("/",controller.store)
router.post("/logined",controller.loginByToken)


module.exports=router