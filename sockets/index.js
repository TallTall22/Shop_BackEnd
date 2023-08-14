module.exports = (io) => {
  const messages=[]
  io.on('connection', (socket) => {

    io.emit('message',messages)

     socket.on("sendMessage",  (message)=> {
        messages.push(message)
        io.emit("newMessage", message)
    })
  });
};