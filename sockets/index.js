module.exports = (io) => {
  const messages=[
    {name:'seller001',message:'各位顧客您好，有任何問題都可以在這邊發問'},
    {name:'buyer789',message:'好的'},
    {name:'buyer678',message:'知道了'},
    {name:'seller001',message:'感謝各位回覆，歡迎繼續選購本店的商品'},
    {name:'buyer789',message:'不客氣'}
  ]
  io.on('connection', (socket) => {

    io.emit('message',messages)

     socket.on("sendMessage",  (message)=> {
        messages.push(message)
        io.emit("newMessage", message)
    })
  });
};