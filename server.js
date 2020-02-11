// use express
var express = require("express");

// create instance of express
var app = express();

// create API for get_message
app.get("/get_messages", function (request, result) {
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

// add public dir
app.use(express.static(__dirname + "/public"));

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
	// attach listener to server
	socket.on("delete_message", function (messageId) {
		// delete from database
		connection.query("DELETE FROM messages WHERE id = '" + messageId + "'", function (error, result) {
			// send event to all users
			io.emit("delete_message", messageId);
		});
	});

	// server should listen from each client via it's socket
	socket.on("new_message", function (data) {
		console.log("new message", data)
    		// save message in database
		connection.query("INSERT INTO messages(username, message) VALUES('" + data.username + "', '" + data.message + "')", function (error, result) {
			data.id = result.insertId;
			io.emit("new_message", data);
		});
	});

});

