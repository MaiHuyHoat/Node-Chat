const firebase= require("../Config/Firebase")
const firestore= firebase.firestore;
const Message = require("../Models/Message");
class MesssageService {
  constructor() {}
  async getListMessage() {
    var data = [];
    try {
      var collectionRef = firestore.collection("c_massage");
      var snapshot = await collectionRef.get();
      snapshot.forEach((element) => {
        var doc = element.data();
        var model = new Message(
          element.id,
          doc.senderID,
          doc.conversationID,
          doc.content,
          doc.timestamp,
          doc.type
        );
        data.push(model);
      });
    } catch (error) {
      console.log(error);
    }
    return data;
  }

  async getMessageById(MessageId) {
    try {
      const MessageRef = firestore.collection("c_massage").doc(MessageId);
      const MessageDoc = await MessageRef.get();
      if (MessageDoc.exists) {
        var element = MessageDoc;
        var doc = element.data();
        var model = new Message(
          element.id,
          doc.senderID,
          doc.conversationID,
          doc.content,
          doc.timestamp,
          doc.type
        );
        return model;
      } else {
        throw new Error("Tin nhắn không tồn tại");
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin tin nhắn:", error);
      throw error;
      return false;
    }
  }
  async getLastMessageByIdConversation(id) {
    try {
      const MessageRef = firestore
        .collection("c_massage")
        .where("conversationID", "==", id.trim())
        .orderBy("timestamp", "desc")
        .limit(1);
      const MessageQuery = await MessageRef.get();
      if (!MessageQuery.empty) {
        const MessageDoc = MessageQuery.docs[0];
        const doc = MessageDoc.data();
        const model = new Message(
          MessageDoc.id,
          doc.senderID,
          doc.conversationID,
          doc.content,
          doc.timestamp,
          doc.type
        );
        return model;
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin tin nhắn:", error);
      throw error;
    }
  }
  async getMessageByIdConversation(id) {
    var data = [];
    try {
      const MessageRef = firestore
        .collection("c_massage")
        .where("conversationID", "==", id.trim())
        .orderBy("timestamp", "desc");
      const MessageDocs = await MessageRef.get();

      MessageDocs.forEach((element) => {
        var doc = element.data();
        var model = new Message(
          element.id,
          doc.senderID,
          doc.conversationID,
          doc.content,
          doc.timestamp,
          doc.type
        );
        data.push(model);
      });
    } catch (error) {
      console.error("Lỗi khi lấy thông tin tin nhắn:", error);
      throw error;
    }
    return data;
  }
  // Thêm một Message vào Firestore
  async createMessage(MessageData) {
    try {
      const collectionRef = firestore.collection("c_massage");
      await collectionRef.add(MessageData);
      return true;
    } catch (error) {
      console.error("Lỗi khi thêm tin nhắn:", error);
      throw error;
    }
  }
  // Cập nhật thông tin Message trong Firestore
  async updateMessage(updatedMessageData) {
    var MessageId = updatedMessageData.id;
    try {
      const MessageRef = firestore.collection("c_massage").doc(MessageId);
      updatedMessageData.updatedAt = new Date(); // Cập nhật ngày cập nhật
      await MessageRef.update(updatedMessageData);
      return true;
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin tin nhắn:", error);
      throw error;
    }
  }
  // Xóa Message khỏi Firestore
  async deleteMessage(MessageId) {
    try {
      const MessageRef = firestore.collection("c_massage").doc(MessageId);
      await MessageRef.delete();
      return true;
    } catch (error) {
      console.error("Lỗi khi xóa tin nhắn:", error);
      throw error;
    }
  }
}
module.exports = MesssageService;
