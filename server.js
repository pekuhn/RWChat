// use express
var express = require("express");

// create instance of express
var app = express();

// create API for get_message
app.get("/get_messages", function (request, result) {
                console.log("Erfolg!");
                connection.query("SELECT * FROM messages", function (error, messages) {
                        // return data will be in JSON format
                        result.end(JSON.stringify(messages));
                });
        });

// use http with instance of express
var http = require("http").createServer(app);

// start the server
var port = 3000;
http.listen(port, function () {
	console.log("Listening to port " + port);
});

//app.use(app.router);
// add public dir
app.use(express.static(__dirname + "/"));

// use mysql
var mysql = require("mysql");

// create connection
var connection = mysql.createConnection({
        host: "localhost",
        user: "web_chat",
        password: "pw",
        database: "web_chat"
});

connection.connect(function (error) {
        // show error, if any
});

// create socket instance with http
var io = require("socket.io")(http);

// add listener for new connection
io.on("connection", function (socket) {
	// this is socket for each user
	console.log("User connected", socket.id);
	// server should listen from each client via it's socket (OLD CODE WITHOUT MYSQL)
	//socket.on("new_message", function (data) {
	//	console.log("Client says", data);
	//	io.emit("new_message", data);
	//});

	// server should listen from each client via it's socket
	socket.on("new_message", function (data) {
		console.log("Client says", data);
		// save message in database
		connection.query("INSERT INTO messages (message) VALUES ('" + data + "')", function (error, result) {
			// server will send message to all connected clients
			io.emit("new_message", {
				id: result.insertId,
				message: data
			});
		});
	});
});

// add headers
app.use(function (request, result, next) {
	result.setHeader("Access-Control-Allow-Origin", "*");
	next();
});

