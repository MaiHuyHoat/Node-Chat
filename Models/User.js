class User{
    constructor(id,userName,name,password,email,avartarURL, status, lastseen, conversations, callHistorys, createdAt,updatedAt){
        this.id=id;
        this.userName=userName;
        this.name=name
        this.password=password;
        this.email=email;
        this.avatarURL=avartarURL;
        this.status=status;
        this.lastseen=lastseen;
        this.conversations=conversations;
        this.callHistorys=callHistorys;
        this.createdAt= createdAt;
        this.updatedAt=updatedAt;
    }
    toJSON() {
      return {
        id: this.id,
        userName: this.userName,
        name:this.name,
        email: this.email,
        avatarURL: this.avatarURL,
        status: this.status,
        lastseen: this.lastseen,
        conversations: this.conversations,
        callHistorys: this.callHistorys,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt
      }
    }
   
}
// Sử dụng lớp User
// const user1 = new User(
//     "user123",
//     "JohnDoe",
        // "123",
        // "hoatdfk2001@gmail.com"
//     "https://example.com/avatar.jpg",
//     "online",
//     new Date(),
//     ["conv1", "conv2"],
//     ["call1", "call2"]
//   );
module.exports=User