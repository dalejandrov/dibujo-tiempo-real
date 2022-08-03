const socket = io()
var click = false
var movingMouse = false
var xPosition = 0
var yPosition = 0
var previousPosition = null
var color = 'black'

const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')
const users = document.getElementById('users')

const width = window.innerWidth
const height = window.innerHeight

canvas.width = width
canvas.height = height

canvas.addEventListener('mousedown', () => {
    click = true
})

canvas.addEventListener('mouseup', () => {
    click = false
})

canvas.addEventListener('mousemove', (e) => {
    xPosition = e.clientX
    yPosition = e.clientY
    movingMouse = true
})

function changeColor(c) {
    color = c
    context.strokeStyle = color
    context.stroke()
}

function deleteAll() {
    socket.emit('delete')
}

function createDrawing() {
    if (click && movingMouse && previousPosition != null) {
        let drawing = {
            x_position: xPosition,
            y_position: yPosition,
            color: color,
            previous_position: previousPosition
        }
        socket.emit('drawing', drawing)
    }
    previousPosition = { x_position: xPosition, y_position: yPosition }
    setTimeout(createDrawing, 25)
}

socket.on('showDrawing', (drawing) => {
    if (drawing != null) {
        context.beginPath()
        context.lineWidth = 3
        context.strokeStyle = drawing.color
        context.moveTo(drawing.x_position, drawing.y_position)
        context.lineTo(drawing.previous_position.x_position,
            drawing.previous_position.y_position)
        context.stroke()
    } else {
        context.clearRect(0, 0, canvas.width, canvas.height)
    }
})

socket.on('users', (number) => {
    users.innerHTML = `Numero de usuarios conectados: ${number}`
})

createDrawing()
