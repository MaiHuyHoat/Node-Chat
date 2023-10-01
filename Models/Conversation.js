 class Conversation {
    constructor(conversationID, type, members) {
      this.conversationID = conversationID;
      this.type = type;
      this.members = members;
  
      this.createdAt = new Date();
      this.updatedAt = new Date();
    }
  
  
  }
module.exports= Conversation;
