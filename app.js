if(process.env.NODE_ENV!=='production'){
  require('dotenv').config()
}

const express=require('express')
const session=require('express-session')
const usePassport=require('./config/passport')
const routes=require('./routes')
const app=express()
const port=3001

//use body-parser
app.use(express.urlencoded({extended:true}))

//json
app.use(express.json())

//session
app.use(session({secret:process.env.SESSION_SECRET,resave:false,saveUninitialized:true}))

//use passport
usePassport(app)

//CORS
app.use((req, res, next) => {
  // 設置允許跨域的源，可以使用 '*' 允許所有源，或指定特定的源
  res.header('Access-Control-Allow-Origin', '*');

  // 設置允許的HTTP方法
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE,PATCH');

  // 設置允許的HTTP頭
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // 在處理實際請求之前，響應預檢請求（OPTIONS）
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

const http = require('http').createServer(app)
const io = require('socket.io')(http)
require('./sockets')(io)

//routes
app.use('/api',routes)

http.listen(port,()=>{
  console.info(`App is listening on localhost:${port}`)
})