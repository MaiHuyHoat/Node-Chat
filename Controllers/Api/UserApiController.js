const ConsersationService = require("../../Services/ConversationService");
const Cservice = new ConsersationService();
const UserService = require("../../Services/UserService");
const UService = new UserService();
const MessageService = require("../../Services/MessageService");
const MService = new MessageService();
class UserApiController{
   constructor(){

   }
    async getListUser(req,rsp){
      var data= await UService.getListUser(); 
      rsp.status(200).json(data)
   }
  async getUserById(req,rsp){
    var id= req.body.id;
    var data= await UService.getUserById(id)
    rsp.status(200).json(data)
   }
}
module.exports=UserApiController