const User=require( "../Models/User")

const firebase= require("../Config/Firebase")
const firestore= firebase.firestore;

const jwt= require("jsonwebtoken")


const get=(req,rsp)=>{
     
    rsp.render("login",{login:true})
}
const store = async (req,rsp)=>{  // handle login
    var logined=false;
    var userName= req.body.userName;
    var password=req.body.password;

    var user;
    try {
        var cR= firestore.collection("c_user");
        var snapshot= await  cR.get()
        snapshot.forEach(element => {
            var doc= element.data()
            
            if(doc.userName===userName && doc.password===password){
                logined=true;
              user= new User(element.id,doc.userName,doc.name,"*****",doc.email,doc.avatarURL,doc.status,doc.lastseen,doc.conversations,doc.callHistorys,doc.createdAt,doc.updatedAt);
             
            }
        });
    } catch (error) {
       console.log("Error: ",error) 
    }
    if (logined) {
       const secretkey="hoatdfk"
       const payload={
        "id":user.id
       }
       const token= jwt.sign(payload,secretkey,{expiresIn:'1h'})
       rsp.cookie('token',token,{maxAge:1000*3600})
        rsp.json({
            user: user
            
        })

    } else {
    rsp.json({user:null})
    }
     
}
const loginByToken= async( req,rsp)=>{
    var token=req.body.token

    var secretkey='hoatdfk'
    try {
        var decoded=jwt.verify(token,secretkey);
        var userId= decoded.id;
        var collectionRef= firestore.collection('c_user')
        var snap= (await collectionRef.doc(userId).get());
        var doc=snap.data()
        user= new User(snap.id,doc.userName,doc.name,"*****",doc.email,doc.avatarURL,doc.status,doc.lastseen,doc.conversations,doc.callHistorys,doc.createdAt,doc.updatedAt);

        rsp.json({user:user})
        rsp.end()
    } catch (error) {
        console.log(error)
    }
   
}


module.exports={get,store,loginByToken}