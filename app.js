if(process.env.NODE_ENV!=='production'){
  require('dotenv').config()
}

const express=require('express')
const app=express()
const session=require('express-session')
const usePassport=require('./config/passport')
const routes=require('./routes')
const port=3001

//use body-parser
app.use(express.urlencoded({extended:true}))

//json
app.use(express.json())

//session
app.use(session({secret:process.env.SESSION_SECRET,resave:false,saveUninitialized:true}))

//use passport
usePassport(app)

//routes
app.use('/api',routes)

app.listen(port,()=>{
  console.info(`App is listening on localhost:${port}`)
})