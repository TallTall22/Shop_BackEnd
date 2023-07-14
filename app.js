const express=require('express')
const app=express()
const routes=require('./routes')
const port=3001



//路由
app.use('/api',routes)

app.listen(port,()=>{
  console.info(`App is listening on localhost:${port}`)
})