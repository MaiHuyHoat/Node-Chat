const firebase= require("../Config/Firebase")
const firestore= firebase.firestore;
const Conversation = require("../Models/Conversation");
class ConversationService {
  constructor() {}
  async getListConversation() {
    var data = [];
    try {
      var collectionRef = firestore.collection("c_conversation");
      var snapshot = await collectionRef.get();
      snapshot.forEach((element) => {
        var doc = element.data();
        var model = new Conversation(
          element.id,
          doc.type,
          doc.members
        );
        data.push(model);
      });
    } catch (error) {
      console.log(error);
    }
    return data;
  }
  
  async getConversationById(ConversationId ) {

    try {
    
      const ConversationRef = firestore
        .collection("c_conversation")
        ;
      const ConversationDoc = await ConversationRef.doc(ConversationId).get();

      if (ConversationDoc.exists) {
        
        var element = ConversationDoc;
       
        var doc =   element.data();
       
        var model = new Conversation(
          element.id,
          doc.type,
          doc.members
        );
        return model;
      } else {
        throw new Error("cuộc trò chuyện không tồn tại");
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin cuộc trò chuyện:", error);
      throw error;
    }
  }
  // Thêm một Conversation vào Firestore
  async createConversation(ConversationData) {

    try {
      const collectionRef = firestore.collection("c_conversation");
      await collectionRef.add(ConversationData);
      return true;
    } catch (error) {
      console.error("Lỗi khi thêm cuộc trò chuyện:", error);
      throw error;
      return false;
    }
   
  }
  // Cập nhật thông tin Conversation trong Firestore
  async updateConversation(updatedConversationData) {

    var ConversationId = updatedConversationData.id;
    try {
      const ConversationRef = firestore
        .collection("c_conversation")
        .doc(ConversationId);
      updatedConversationData.updatedAt = new Date(); // Cập nhật ngày cập nhật
      await ConversationRef.update(updatedConversationData);
      return true;
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin cuộc trò chuyện:", error);
      throw error;
      return false;
    }

  }
  // Xóa Conversation khỏi Firestore
  async deleteConversation(ConversationId) {

    try {
      const ConversationRef = firestore
        .collection("c_conversation")
        .doc(ConversationId);
      await ConversationRef.delete();
      return true;
    } catch (error) {
      console.error("Lỗi khi xóa cuộc trò chuyện:", error);
      throw error;
      return false;
    }
  }
}
module.exports = ConversationService;
