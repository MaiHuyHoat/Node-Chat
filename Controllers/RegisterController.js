const User= require("../Models/User")
const userService= require("../Services/UserService")
const UService= new userService();
const firebase= require("../Config/Firebase");
require('firebase-admin/firestore');
const get=(req,rsp)=>{
    rsp.render("register");
}
const create=(req,rsp)=>{
    var avatarURL=req.body.avatarURL;
    var userName=req.body.username;
    var phone= req.body.phone;
    var email=req.body.email;
    var password=req.body.password
   try {
    model={
       
        userName: phone,
        name:userName,
        email: email,
        password:password,
        avatarURL: avatarURL,
        status: 1,
        lastseen: firebase.admin.firestore.FieldValue.serverTimestamp(),
        conversations: [],
        callHistorys: [],
        createdAt:firebase.admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: null
    }

    UService.createUser(model)
    rsp.redirect('/');
   } catch (error) {
      console.log("error in create user account: "+error)
   }
   
}
   


module.exports={get,create}