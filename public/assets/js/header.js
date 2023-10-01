var userAvatar= document.getElementsByClassName("userAvatar")
var userSession = JSON.parse(sessionStorage.getItem('user'));
// hien thi hinh anh avartar user 
for(var i=0;i<userAvatar.length;i++){
    var e= userAvatar[i];
    e.setAttribute('src',userSession.avatarURL)
}

  

  
var btnLogout= document.getElementById("logOut");

btnLogout.addEventListener('click',()=>{
    sessionStorage.removeItem('user')
    deleteCookie('token');
    window.location.href="/"
})
/// show ten nguoi dung
 var nameUser= document.getElementById('userName')
nameUser.innerText=userSession.name