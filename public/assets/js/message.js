const MSocket = io("/message");
MSocket.on("reload_conversation",async(conversationID)=>{
  // render lại cuộc trò chuyện
     renderConversation(conversationID);
     //render lại title conversation
      renderListTitleConversation();
})


  // lay du lieu message cuoc hoi thoai
  async function loadMessageConversation(idConversation) {
    var result = [];
    await fetch("api/message/getByIdConversation", {
      method: "post",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        id: idConversation,
      }),
    })
      .then((rsp) => rsp.json())
      .then((data) => (result = data))
      .catch((err) => console.log(err));
    return result;
  }
  

// post message to add firebase
async function postMessage(content, conversationID, senderID, type) {
    await fetch("api/message/create", {
      method: "post",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        content: content,
        conversationID: conversationID,
        senderID: senderID.trim(),
        type: type,
      }),
    })
      .then((rsp) => {
        if (rsp.ok) console.log("Đã gửi tin nhắn");
      })
      .catch((err) => console.log(err));
  }
  //post UploadFile to server
  async function uploadFile(selectedFile, conversationID, senderID, type) {
    const formData = new FormData();
  
    formData.append("content", selectedFile);
    formData.append("conversationID", conversationID);
    formData.append("senderID", senderID.trim());
    formData.append("type", type);
  
    fetch("api/message/create", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Tệp đã được tải lên thành công:", data);
        // Xử lý dữ liệu phản hồi từ máy chủ (nếu cần)
      })
      .catch((error) => {
        console.error("Lỗi khi tải lên tệp:", error);
        // Xử lý lỗi (nếu có)
      });
  }
  // add event inputFile change
  function inputFileChange() {
    var inputText = document.querySelector("#tynChatInput");
    var fileInput = document.querySelector("#fileInput");
  
    
      inputText.placeholder = "Send file : " + fileInput.value;
     
  }
  
function renderMessageConversation(messages, user, sender) {
    var tynRebly = document.querySelector("#tynReply");
    var contents = ``;
    messages.forEach((e) => {
      if (e.type === "text") {
        if (e.senderID.trim() !== user.id.trim())
          contents += renderTynReplyIncomingText(e.content, sender);
        else contents += renderTynReplyOutcomingText(e.content);
      }else if(e.type==='image'){
        if (e.senderID.trim() !== user.id.trim())
          contents += renderTynReplyIncomingImage(e.content, sender);
        else contents += renderTynReplyOutcomingImage(e.content);
      }
    });
    tynRebly.innerHTML = contents;
  }
  
  // add event load conversation cho nguoi dung khi clik vao title conversation

  
  // add event submit  messages
  async function submitMessage(idConversation, senderID, type) {
    var inputMessage = document.querySelector("#tynChatInput")
    
    var message=inputMessage.value;
    if(message.trim().length===0)return;
    inputMessage.value=""
    await postMessage(message, idConversation, senderID, type);
    
    MSocket.emit("send_message",message);
  }
 
  // add event submit Image file
  async function submitImage(idConversation,senderID,type){
    var fileInput=document.querySelector("#fileInput");
    var selectedFile= fileInput.files[0];
    if(selectedFile){
      await uploadFile(selectedFile, idConversation, senderID, type);
      MSocket.emit("send_message","upload Image");
    }else{
      return ;
    }
  }
  