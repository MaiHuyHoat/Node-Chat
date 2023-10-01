

// ham lay du lieu trong db
async function loadTitleConversation() {
  var result = [];
  await fetch("api/conversation/listTitleConversation", {
    method: "post",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      id: userSession.id,
    }),
  })
    .then((rsp) => {
      if (rsp.ok) return rsp.json();
    })
    .then((data) => {
      result = data;
    })
    .catch((err) => console.log(err));
  return result;
}
// Lấy dữ liệu conversation qua id
async function loadConversationById(id) {
  var result = null;
  await fetch("api/conversation/detail", {
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

async function renderConversation(idConversation) {
  // join vào phòng conversation bên socket
  MSocket.emit("join_conversation", idConversation);
  // xoa du lieu trong o input
  var inputMessage = document.querySelector("#tynChatInput");

  inputMessage.innerHTML = "";
  // set icon sender va tên sender
  var conversation = await loadConversationById(idConversation.trim());
  var members = conversation.members.filter((e) => {
    return e.trim() !== userSession.id.trim();
  });
  // lay thong tin nguoi gui
  var idSender = members[0];
  var sender = await loadUserById(idSender.trim());
  var imageSender = document.querySelector(
    "#tynMain > div.tyn-chat-head > div.tyn-media-group > div.tyn-media.tyn-size-lg.d-none.d-sm-inline-flex > img"
  );
  imageSender.setAttribute("src", sender.avatarURL);
  var nameSender = document.querySelector(
    "#tynMain > div.tyn-chat-head > div.tyn-media-group > div.tyn-media-col > div:nth-child(1) > h6"
  );
  var imageUser= document.querySelector("#videoCallingScreen > div > div > div > div.tyn-chat-call-stack.on-dark > div > div.tyn-media.tyn-media-1x1_3.tyn-size-3xl.border.border-2.border-dark > img");
  imageUser.setAttribute('src',userSession.avatarURL)

  nameSender.textContent = sender.name;
  // set event btn call
  var btnCall=document.querySelector("#tynMain > div.tyn-chat-head > ul.tyn-list-inline.gap.gap-3.ms-auto > li:nth-child(2) > button");
  btnCall.setAttribute('onclick',`callVideo('${sender.id.trim()}')`)
  // load và render all massage của conversation

  var messages = await loadMessageConversation(idConversation);
  renderMessageConversation(messages, userSession, sender);
  // set onclick submit Message cho button
  var formSubmitMessage = document.querySelector("#formSendMessage");
  formSubmitMessage.addEventListener("submit", () => {
    submitMessage(idConversation, userSession.id, "text");
    submitImage(idConversation, userSession.id, "image");
    return false;
  });

  // kéo  scroll đến cuối cùng
  var scrollConversation = document.querySelector(
    "#tynChatBody > div.simplebar-wrapper > div.simplebar-mask > div > div"
  );

  // Kéo thanh cuộn đến cuối
  scrollConversation.scrollTop = scrollConversation.scrollHeight;
  // set up hinh va ten nguoi goi , neu nguoi dung muon goi
  var imageCallReceiver=document.querySelector("#videoCallingScreen > div > div > div > div:nth-child(1) > div > img");
  imageCallReceiver.src=sender.avatarURL;
  var nameCallReceiver=document.querySelector("#videoCallingScreen > div > div > div > div.tyn-chat-call-stack.on-dark > div > div.tyn-media-col.align-self-start.pt-3 > div:nth-child(2) > h6");
  nameCallReceiver.innerHTML=sender.name
   // Ẩn loading default và hiện conversation

    var divSlide=document.querySelector("#default-MainMss");
   var divContent=document.querySelector("#tynMain");
       divSlide.remove()
   divContent.style.visibility='visible'
   divContent.classList.remove('d-none')
}
