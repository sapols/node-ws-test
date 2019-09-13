const WebSocket = require('ws');
const ip = require('ip');
var http = require("http")
var express = require("express")
var app = express()
var serverPort = process.env.PORT;
if (serverPort == null || serverPort == "") {
  serverPort = 5000 //8000;
}
var serverIP = ip.address();

app.use(express.static(__dirname + "/"))

// var server = http.createServer(app)
// server.listen(serverPort)

//console.log("http server listening on %d", serverPort)

//var wss = new WebSocketServer({server: server})
//var wss = new WebSocketServer({ server: server }, () => {
const wss = new WebSocket.Server({ port: serverPort }, () => {
   console.log(`Shawn's new WebSocket Server is running! (URL: ws://${serverIP}:${serverPort})`);
   console.log("The signaling server is now listening on port " + serverPort);
});
console.log("websocket server created")

// wss.on("connection", function(ws) {
//   var id = setInterval(function() {
//     ws.send(JSON.stringify(new Date()), function() {  })
//   }, 1000)

//   console.log("websocket connection open")

//   ws.on("close", function() {
//     console.log("websocket connection close")
//     clearInterval(id)
//   })
// })

// Broadcast to all.
wss.broadcast = (ws, data) => {
    wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
};

wss.on('connection', (ws, req) => {
    //console.log(`Client with IP ${req.connection.remoteAddress} connected. Total connected clients: ${wss.clients.size}`);
    console.log(`Client connected.`);

    ws.onmessage = (message) => {
        console.log(message.data + "\n");
        wss.broadcast(ws, message.data);
    }

    ws.onclose = () => {
        //console.log(`Client with IP ${req.connection.remoteAddress} disconnected. Total connected clients: ${wss.clients.size}`)
        console.log(`Client disconnected.`)
    }
});
