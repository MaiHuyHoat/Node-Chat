
// if (getCookie("token") !== null) {
//   var token = getCookie("token");
//   document.addEventListener("DOMContentLoaded", function () {
//     fetch("/logined", {
//       method: "post",
//       headers: {
//         "Content-type": "application/json",
//       },
//       body: JSON.stringify({ token: token }),
//     })
//       .then((rsp) => {
//         if (rsp.ok) {
//           return rsp.json();
//         }
//       })
//       .then((data) => {
    
//         sessionStorage.setItem("user", JSON.stringify(data.user));
//         window.location.href = "/index";
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   });
// }
function postLogin() {
  var phone = document.getElementById("phone").value;
  var pass = document.getElementById("pass").value;
  var data = {
    userName: phone,
    password: pass,
  };
  fetch("/", {
    method: "post",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => {
      if (res.ok) console.log("ok");
      return res.json();
    })
    .then((data) => {
      if (data.user !== null) {
     
        sessionStorage.setItem("user", JSON.stringify(data.user));
        window.location.href = "/index";
      } else {
        var showIn = document.getElementById("invalidAcc");
        showIn.style.display = "block";
      }
    })
    .catch((err) => console.log(err));
}
