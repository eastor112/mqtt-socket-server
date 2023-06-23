const express = require("express");
const mqttHandler = require('./mqtt_handler');
const bodyParser = require("body-parser");
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io")
const io = new Server(server, {
  cors: {
    origin: "*",
    allowedHeaders: ["my-custom-header"],
    credentials: false
  }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

const mqttClient = new mqttHandler();
mqttClient.connect();

// Conexión de WebSocket
io.on('connection', (socket) => {
  console.log('A client connected.');

  socket.on('disconnect', () => {
    console.log('A client disconnected.');
  });

  mqttClient.mqttClient.on('message', function (topic, message) {
    io.emit("mqtt-message",  `${topic}: ${message.toString()}`);
  })
});

// Routes
app.post("/send-mqtt", function(req, res) {
  mqttClient.sendMessage(req.body.message);
  res.status(200).send("Message sent to mqtt");
});
// mqtt-message

server.listen(3000, () => {
  console.log('listening on *:3000');
});
