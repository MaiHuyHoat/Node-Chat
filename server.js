const express = require("express");
const app = express();

const { v4: uuidv4 } = require("uuid");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const path = require("path");

//setup server

var server = app.listen(process.env.PORT || 3060, () => {
  console.log("Server is running on port: ", 3060);
});
// khai báo thiết lập ejs và public static

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.set("views", "./views"); // Thư mục views nằm cùng cấp với file app.js
// Khai báo static file
app.use(
  express.static("public", {
    setHeaders: (res, path) => {
      if (path.endsWith(".css/")) {
        res.setHeader("Content-Type", "text/css");
      }
      if (path.endsWith(".js/")) {
        res.setHeader("Content-Type", "text/javascript");
      }
    },
  })
);

// setup socketio
const socketIo = require("socket.io");
const io = socketIo(server);
const ioC=io.of("/call");
ioC.on("connection",(socket)=>{
  socket.on('call_service',(userId)=>{
    socket.join(userId);
    socket.on('create_call',(receiverId)=>{
        ioC.to(receiverId).emit("calling",userId);
    })
    socket.on("accept_call",(receiverId)=>{
      ioC.to(receiverId).emit("accepted",userId)
    })
    socket.on('stop_call',(receiverId)=>{
      ioC.to(receiverId).emit("stoped",userId);
  })
  })
})
const ioM=io.of('/message')
ioM.on("connection", (socket) => {
  socket.on("join_conversation", (conversationID) => {
    socket.join(conversationID);
    socket.on("send_message", (message) => {
      ioM.to(conversationID).emit("reload_conversation", conversationID);
    });
    
  });
});

// setup peer server cho việc video call
const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
  debug: true,
});
app.use("/peerjs", peerServer);

// đoạn mã khác , sử dụng đependencis khác

app.use(cookieParser());

// thiết lập router cho web server

const RegisterRouter= require("./Routers/RegisterRouter")
const LoginRouter = require("./Routers/LoginRouter");
const IndexRouter = require("./Routers/IndexRouter");
const ApiRouter = require("./Routers/ApiRouter");

app.use("/", LoginRouter);
app.use("/register",RegisterRouter)
app.use("/index", IndexRouter);
app.use("/api", ApiRouter);
