console.log("Hello world !");

// use express
var express = require("express");

// create instance of express
var app = express();

// use http with instance of express
var http = require("http").createServer(app);

// start the server
var port = 3000;
http.listen(port, function () {
	console.log("Listening to port " + port);
});

// create socket instance with http
var io = require("socket.io")(http);

// add listener for new connection
io.on("connection", function (socket) {
	// this is socket for each user
	console.log("User connected", socket.id);
	// server should listen from each client via it's socket
	socket.on("new_message", function (data) {
	console.log("Client says", data);
	});
});

// add public dir
app.use(express.static(__dirname + "/public"));
