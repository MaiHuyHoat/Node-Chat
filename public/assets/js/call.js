var userId = userSession.id;

var caller = null;
var calling = false;
var callerStream = null;
var userStream = null;
// set up call socket
const CSocket = io("/call");
// yeu cầu join vô dịch vụ call service với tham số truyền lên là id của người dùng
CSocket.emit("call_service", userId.trim());
// xử lý
CSocket.on("calling", async (senderId) => {
  console.log("Có người gọi đến: " + senderId);
  // gan id nguoi goi bang senderId
  caller = await loadUserById(senderId);
    // Hiện màn hình có cuộc gọi đến lên 
    showCallingScreen();
    // cài đặt màn hình có người gọi đến
  setCallingScreen(senderId);
  // cài đặt nút accept cuộc gọi chuyển thành màu xanh
  setBtnCall(true);

  

  // sau khi hiện màn hình có người gọi đến thì , nếu accept thì thì sẽ gửi socket.emit đến nngưởi đốii diên
  // để chuyển đến hàm peer.on('call')
});
CSocket.on("stoped", (senderId) => {
  console.log("Đã bị huỷe cuộc gọi bởi ngưởi đối diện : " + senderId);
  if(callerStream) callerStream.close();

   destroyCameraMic();
  stopCallingScreen();
  // gán biến calling thành false;
  calling = false;
  // gán biến callerSTream
  callerStream = null;
  userStream=null;
});
// set uip peer cho dịch vụ gọi điện
var peer = new Peer(userId.trim(), {
  path: "/peerjs",
  host: "/",
  port: "3060",
});
peer.on("call", (incomingStream) => {
  // nếu không bận và có cuộc gọi đến khác thì hiển thị thông báo có cuộc gọi đến
  console.log(calling + " " + acceptCall);
  if (!calling && acceptCall) {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((myStream) => {
        console.log("Đang hiển thị cuộc gọi đến ");
        callerStream = incomingStream;
        userStream = myStream;

        incomingStream.answer(myStream);
        // hiển thị dữ liệu người dùng lên video
        console.log(myStream);
        outComingVideo(myStream);
        // nhận dữ liệu video từ người khác gửi đến
        incomingStream.on("stream", (stream) => {
          if (stream.getVideoTracks().length <= 0)
            console.log("khong co video");
          inComingVideo(stream);
        });
        // Bắt đầu đếm thời gian cuộc gọi
        startTimeCalling();
        // set button chuyên sang trạng thái huỷ cuộc gọi
        setBtnCall(false);
      })
      .catch((err) => console.log(err));
  }

  // gán biến caling thành true
  calling = true;
});

var getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia;


// huỷ quyền truy cập camera & mic của người dùng
async function destroyCameraMic() {
  
  const tracks = userStream===null?[]:userStream.getTracks();
  
  tracks.forEach(track => {
    track.stop(); // Dừng một track
  });
  
}
async function controlCameraAndMicrophone(enableCamera, enableMicrophone) {
  var myStream=userStream
  const videoTracks = myStream ? myStream.getVideoTracks() : [];
  const audioTracks = myStream ? myStream.getAudioTracks() : [];
 
   
   if(enableCamera!==null){
    videoTracks.forEach(track => {
      track.enabled = enableCamera; // Bật/tắt track camera
    });
   }

    if(enableMicrophone!==null){
      audioTracks.forEach(track => {
    
        track.enabled = enableMicrophone; // Bật/tắt track âm thanh
      });
    }

}


// nhận cuộc gọi nếu có , và trả về âm thanh của mình , video của mình

// hàm thực hiện call video khi người dùng nhấn vào nút click
async function callVideo(receiverId) {
  // render stream của người dùng gửi tới màn hình hiển thị

  caller = await loadUserById(receiverId);
  if (!calling) {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((myStream) => {
        userStream = myStream;
        setCallingScreen();

        outComingVideo(myStream);
        console.log("yêu cẩu cuộc gọi tới: ", receiverId);
        CSocket.emit("create_call", receiverId);
        setBtnCall(false);

        CSocket.on("accepted", (senderId) => {
          calling = true;
          // thiết lập cuộc gọi và gán biến stream thành strream từ cuộc gọi
          const call = peer.call(receiverId, myStream);
          callerStream = call;
          console.log("Cuộc gọi đã được chấp nhận ");
          call.on("stream", (inComingStream) => {
            console.log("Dang hien thi stream goi den");
           
            inComingVideo(inComingStream);
          });
        });
      })
      .catch((err) => console.log(err));
  }
}

function inComingVideo(stream) {
  var parent = document.querySelector(
    "#videoCallingScreen > div > div > div > div:nth-child(1) > div"
  );

  var videoElement = document.createElement("video");
  parent.innerHTML = "";
  parent.append(videoElement);
  addVideoStream(videoElement, stream);
}
function outComingVideo(stream) {
  var parent = document.querySelector(
    "#videoCallingScreen > div > div > div > div.tyn-chat-call-stack.on-dark > div > div.tyn-media.tyn-media-1x1_3.tyn-size-3xl.border.border-2.border-dark"
  );
  var videoElement = document.createElement("video");
  videoElement.muted = true;
  parent.innerHTML = "";
  parent.append(videoElement);
  addVideoStream(videoElement, stream);
}
function addVideoStream(video, stream) {
  video.srcObject = stream;

  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
}

function setBtnCall(status) {
  var btnDestroy = document.querySelector("#callDestroy");
  var btnAccept = document.querySelector("#callAccept");
  if (!status) {
    btnAccept.classList.add("d-none");
    btnDestroy.classList.remove("d-none");
    btnDestroy.addEventListener("click", () => {
      CSocket.emit("stop_call", caller.id.trim());
      console.log("Yêu cầu huỷ cuộc gọi tới :", caller.id.trim());
      //huy quyen camera va mic
      destroyCameraMic();
      // ẩn màn hình cuộc gọi 
      hideCallingScreen();
      // đặt trạng thái calling thành false
      calling=false;
    });
  } else {
    btnAccept.classList.remove("d-none");
    btnDestroy.classList.add("d-none");
    // thêm sự kiện khi người dùng nhấn vào nút chấp nhận cuộc gọi , tạo sự kiện
    btnAccept.addEventListener("click", () => {
      CSocket.emit("accept_call", caller.id.trim());
      acceptCall = true;
      console.log("Chấp nhận cuộc gọi từ :", caller.id.trim());
    });
  }
}
function showCallingScreen(){
  var body=document.querySelector("body");
  body.classList.add('modal-open')
  body.style.overflow='hidden'
  body.style.paddingRight='0px'
  body.innerHTML+=`<div class="modal-backdrop fade show"></div>`
  var div=document.querySelector("#videoCallingScreen");
  div.classList.add('show')
  div.setAttribute('role','dialog')
  div.style.display='block'
}
function hideCallingScreen() {
  var body = document.querySelector("body");

  // Loại bỏ lớp 'modal-open' từ body (nếu có)
  body.classList.remove('modal-open');

  // Đặt lại thuộc tính overflow và paddingRight của body
  body.style.overflow = 'auto';
  body.style.paddingRight = '0px';

  // Loại bỏ phần tử .modal-backdrop nếu có
  var backdrop = document.querySelector(".modal-backdrop");
  if (backdrop) {
    backdrop.remove();
  }

  // Ẩn phần tử #videoCallingScreen
  var div = document.querySelector("#videoCallingScreen");
  if (div) {
    div.classList.remove('show');
    div.removeAttribute('role');
    div.style.display = 'none';
  }
  destroyCameraMic();
}

function setCallingScreen() {
  var spanTime = document.querySelector(
    "#videoCallingScreen > div > div > div > div.tyn-chat-call-stack.on-dark > div > div.tyn-media-col.align-self-start.pt-3 > div:nth-child(3) > span"
  );
  spanTime.classList.remove("text-danger");
  spanTime.innerHTML = "Calling";
  var divUser = document.querySelector(
    "#videoCallingScreen > div > div > div > div.tyn-chat-call-stack.on-dark > div > div.tyn-media.tyn-media-1x1_3.tyn-size-3xl.border.border-2.border-dark"
  );
  divUser.innerHTML = `<img src="${userSession.avatarURL}" alt="">`;
  var divReceiver = document.querySelector(
    "#videoCallingScreen > div > div > div > div:nth-child(1) > div"
  );
  divReceiver.innerHTML = `<img src="${caller.avatarURL}" alt="">`;
  var nameRecerver = document.querySelector(
    "#videoCallingScreen > div > div > div > div.tyn-chat-call-stack.on-dark > div > div.tyn-media-col.align-self-start.pt-3 > div:nth-child(2) > h6"
  );
  nameRecerver.innerHTML = caller.name;
}
function stopCallingScreen() {
  var divUser = document.querySelector(
    "#videoCallingScreen > div > div > div > div.tyn-chat-call-stack.on-dark > div > div.tyn-media.tyn-media-1x1_3.tyn-size-3xl.border.border-2.border-dark"
  );
  divUser.innerHTML = `<img src="${userSession.avatarURL}" alt="">`;
  var divReceiver = document.querySelector(
    "#videoCallingScreen > div > div > div > div:nth-child(1) > div"
  );
  divReceiver.innerHTML = `<img src="${caller.avatarURL}" alt="">`;
  var nameRecerver = document.querySelector(
    "#videoCallingScreen > div > div > div > div.tyn-chat-call-stack.on-dark > div > div.tyn-media-col.align-self-start.pt-3 > div:nth-child(2) > h6"
  );
  nameRecerver.innerHTML = caller.name;
  var spanTime = document.querySelector(
    "#videoCallingScreen > div > div > div > div.tyn-chat-call-stack.on-dark > div > div.tyn-media-col.align-self-start.pt-3 > div:nth-child(3) > span"
  );
  spanTime.classList.remove("text-light");
  spanTime.classList.add("text-danger");
  spanTime.classList.add("font-weight-bold");
  spanTime.classList.add("h5");

  spanTime.innerHTML = "Calling  is stopped";
  var time = 5;
  var showTime = setInterval(() => {
    if (time < 2) {
      var btn = document.querySelector("#callDestroy");
      clearInterval(showTime);
      hideCallingScreen();
      // btn.click();
    }
    time--;
    spanTime.innerHTML = "Calling  is stopped: " + time + "s";
  }, 1000);
  setTimeout(() => {}, 5000);
}
function startTimeCalling() {
  var spanTime = document.querySelector(
    "#videoCallingScreen > div > div > div > div.tyn-chat-call-stack.on-dark > div > div.tyn-media-col.align-self-start.pt-3 > div:nth-child(3) > span"
  );
  spanTime.classList.remove("text-danger");
  spanTime.classList.add("text-light");
  spanTime.classList.add("font-weight-bold");
  spanTime.classList.add("h5");
  let startTime = Date.now(); // Lấy thời gian bắt đầu
  var time = setInterval(function () {
    let currentTime = Date.now();
    let elapsedTime = currentTime - startTime;

    // Chuyển thời gian thành giây, phút, giờ, ...
    let seconds = Math.floor(elapsedTime / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);

    // Tính toán thời gian còn lại
    seconds %= 60;
    minutes %= 60;
    hours %= 24;

    // Hiển thị thời gian trên giao diện
    spanTime.textContent = "Time:" + hours + ":" + minutes + ":" + seconds;
  }, 1000); // Cứ mỗi giây
}
function checkCalling() {
  var userContainer = document.querySelector(
    "#videoCallingScreen > div > div > div > div.tyn-chat-call-stack.on-dark > div > div.tyn-media.tyn-media-1x1_3.tyn-size-3xl.border.border-2.border-dark"
  );
  var userVideo = userContainer.querySelector("video");
  var callContainer = document.querySelector(
    "#videoCallingScreen > div > div > div > div:nth-child(1) > div"
  );
  var callerVideo = callContainer.querySelector("video");
  if (!userVideo.paused && !callerVideo.paused) return false;
  else {
    setCallingScreen();
    return false;
  }
}
