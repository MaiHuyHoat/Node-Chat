const ConsersationService = require("../../Services/ConversationService");
const Cservice = new ConsersationService();
const UserService = require("../../Services/UserService");
const UService = new UserService();
const MessageService = require("../../Services/MessageService");
const MService = new MessageService();
class ConversationApiController {
  constructor() {}
  async getListConversation(req, rsp) {
    var data = await Cservice.getListConversation();
    rsp.status(200).json(data);
  }
  async getConversationById(req, rsp) {
    const id = req.body.id;
    
    var data = await Cservice.getConversationById(id);
  
    rsp.status(200).json(data);
  }
   
  async getListTitleConversationByIdUser(req, rsp) {
    var data = [ ];
    var userId = req.body.id;
    try {
      var user = await UService.getUserById(userId);
      var listConversation = user.conversations;
      var conversationPromise = listConversation.map(async (conversationId) => {
        var conversation = await Cservice.getConversationById(
          conversationId.trim()
        );

        
        var lastMessage = await MService.getLastMessageByIdConversation(conversationId.trim())
       
        var members = conversation.members;
        var ortherMembers = members.filter((member) => {
          return member.trim() !== userId.trim();
        });

        if (ortherMembers.length === 1) {
          var senderId = ortherMembers[0];
          var sender = await UService.getUserById(senderId.trim());
          var title = {
            id: conversation.conversationID,
            avatarURL: sender.avatarURL,
            name: sender.name,
            lastMessage: lastMessage
          };
       
          return title;
        }
      });
      var conversationTitles = await Promise.all(conversationPromise);
   
      data=data.concat(conversationTitles);
      return rsp.json(data);
    } catch (error) {
      console.log(error);
    }
    rsp.status(200).json(data);
  }

}
module.exports = ConversationApiController;
