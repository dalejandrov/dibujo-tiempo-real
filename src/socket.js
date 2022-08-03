module.exports = (io) => {

    var data = []
    var users = 0

    io.on('connection', (socket) => {
        for (let i = 0; i < data.length; i++) {
            io.emit('showDrawing', data[i])
        }

        users = users + 1
        io.emit('users', users)

        socket.on('delete', () => {
            data = []
            io.emit('showDrawing', null)
        })

        socket.on('drawing', (drawing) => {
            data.push(drawing)
            io.emit('showDrawing', drawing)
        })

        socket.on('disconnect', () => {
            users = users - 1
            io.emit('users', users)
        })
    })
}
