class Messages{
    constructor(messageID, senderID, conversationID, content, timestamp, type) {
        this.messageID = messageID;
        this.senderID = senderID;
        this.conversationID = conversationID;
        this.content = content;
        this.timestamp = timestamp;
        this.type = type;
      }
      addMessage(messageID) {
        this.messages.push(messageID);
        this.updatedAt = new Date();
      }
}
// Sử dụng lớp Message
// const message1 = new Message(
//     "msg1",
//     "user123",
//     "conv1",
//     "Hello there!",
//     new Date(),
//     "text"
//   );
module.exports= Messages;