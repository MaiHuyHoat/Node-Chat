 const firebase= require("../Config/Firebase")
 const firestore= firebase.firestore;
 const User= require("../Models/User")

 class UserService{
  constructor(){}
  async getListUser() {
    var data=[]
        try {
            var collectionRef= firestore.collection('c_user')
            var snapshot = await collectionRef.get()
            snapshot.forEach(element=>{
               var doc=element.data()
              var user= new User(element.id,doc.userName,doc.name,"*****",doc.email,doc.avatarURL,doc.status,doc.lastseen,doc.conversations,doc.callHistorys,doc.createdAt,doc.updatedAt);
               data.push(user)
            })
        } catch (error) {
            console.log(error)
        }
       return data;
    }

  async getUserById(userId) {

    try {
      const userRef = firestore.collection('c_user').doc(userId);
      const userDoc = await userRef.get();
      if (userDoc.exists) {
        var element= userDoc
        var doc= element.data()
        var model= new User(element.id,doc.userName,doc.name,"*****",doc.email,doc.avatarURL,doc.status,doc.lastseen,doc.conversations,doc.callHistorys,doc.createdAt,doc.updatedAt);
        return model
      } else {
        throw new Error('Người dùng không tồn tại');
      }
    } catch (error) {
      console.error('Lỗi khi lấy thông tin người dùng:', error);
      throw error;
    }
  
 }
       // Thêm một User vào Firestore
       async createUser(userData) {
        
        try {
          const collectionRef = firestore.collection('c_user');
           await collectionRef.add(userData);
         return true;
        } catch (error) {
          console.error('Lỗi khi thêm người dùng:', error);
          throw error;
        }
      }
        // Cập nhật thông tin User trong Firestore
  async updateUser(updatedUserData) {
 
    var userId= updatedUserData.id;
    try {
      const userRef = firestore.collection('c_user').doc(userId);
      updatedUserData.updatedAt = new Date(); // Cập nhật ngày cập nhật
      await userRef.update(updatedUserData);
      return true;
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin người dùng:', error);
      throw error;
    }
  }
    // Xóa User khỏi Firestore
    async deleteUser(userId) {
      
        try {
          const userRef = firestore.collection('c_user').doc(userId);
          await userRef.delete();
         return true;
        } catch (error) {
          console.error('Lỗi khi xóa người dùng:', error);
          throw error;
        }
      }
}
 module.exports=UserService