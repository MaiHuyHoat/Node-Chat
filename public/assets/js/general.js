



// event Logout
function deleteCookie(cookieName) {
  // Đọc danh sách các cookie
  var cookies = document.cookie.split(";");

  // Duyệt qua từng cookie để tìm cookie cần xóa
  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i];
    while (cookie.charAt(0) === " ") {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(cookieName + "=") === 0) {
      // Tìm thấy cookie cần xóa
      // Đặt giá trị của cookie thành chuỗi trống và đặt hạn sử dụng đã hết
      document.cookie =
        cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      break;
    }
  }
}
function getCookie(name) {
  const cookieName = name + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(";");

  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i];
    while (cookie.charAt(0) === " ") {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(cookieName) === 0) {
      return cookie.substring(cookieName.length, cookie.length);
    }
  }

  return null; // Trả về null nếu cookie không tồn tại
}
// lấy dữ liệu user qua id user
async function loadUserById(id) {
  var result = null;
  await fetch("api/user/detail", {
    method: "post",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      id: id,
    }),
  })
    .then((rsp) => rsp.json())
    .then((data) => (result = data))
    .catch((err) => console.log(err));
  return result;
}
// lấy tên cuối cùng của người dùng với chuỗi strinbg chuyền vào 
function getLastName(name) {
  const arrStr = name.split(" ");
  return arrStr[arrStr.length - 1];
}
