const ConsersationService = require("../../Services/ConversationService");
const Cservice = new ConsersationService();
const UserService = require("../../Services/UserService");
const UService = new UserService();
const MessageService = require("../../Services/MessageService");
const MService = new MessageService();
const firebase= require("../../Config/Firebase");
require('firebase-admin/firestore');
class MessageApiController {
  constructor() {}
  async getListMessage(req, rsp) {
    var data = await MService.getListMessage();
    rsp.status(200).json(data);
  }
  async createMessage(req, rsp) {
    var idConversation = req.body.conversationID;
    var content = req.body.content;
    var senderID = req.body.senderID;
    var type = req.body.type;
    if(type!='text'){
      

     content=req.file.filename;
    }
    var message = {
      content: content,

      conversationID: idConversation,

      senderID: senderID,
      timestamp: firebase.admin.firestore.FieldValue.serverTimestamp(),

      type: type,
    };
  
     var idMessage = await MService.createMessage(message);
     if (idMessage !== null) rsp.status(200).json({message:"Success"});
  }
  async getListMessageByIdConversation(req, rsp) {
    var idConversation = req.body.id;
    var data = await MService.getMessageByIdConversation(idConversation);
    rsp.status(200).json(data);
  }
}
module.exports = MessageApiController;
