const express= require('express')
const router= express.Router()
const userApiController= require("../Controllers/Api/UserApiController")
const user= new userApiController()
const multer= require("../Config/Upload");
router.get('/user',(req,rsp)=>user.getListUser(req,rsp))
router.post('/user/detail',(req,rsp)=>user.getUserById(req,rsp))


const conversationApiController= require("../Controllers/Api/ConversationApiController")
const conversation= new conversationApiController()
router.get('/conversation',(req,rsp)=>conversation.getListConversation(req,rsp))
router.post('/conversation/detail',(req,rsp)=>conversation.getConversationById(req,rsp))
router.post('/conversation/listTitleConversation',(req,rsp)=>conversation.getListTitleConversationByIdUser(req,rsp))

const MesssageApiController= require("../Controllers/Api/MessageApiController")
const message= new MesssageApiController
router.get('/message',(req,rsp)=>message.getListMessage(req,rsp))
router.post('/message/create',multer.single('content'),(req,rsp)=>message.createMessage(req,rsp))
router.post('/message/getByIdConversation',(req,rsp)=>message.getListMessageByIdConversation(req,rsp));
module.exports=router;