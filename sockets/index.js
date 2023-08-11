module.exports = (io) => {
  const messages=[{name:'Mary',message:'Hi'}]
  io.on('connection', (socket) => {

    io.emit('message',messages)

     socket.on("sendMessage", function (message) {
        messages.push(message)
        io.emit("newMessage", message)
    })
  });
};