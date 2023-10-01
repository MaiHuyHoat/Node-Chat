const app= require('express');
const router=app.Router();
const controller= require("../Controllers/RegisterController");
router.get('/',controller.get)
router.post('/create',controller.create)
module.exports=router;