// MODULES-------------------------------------

// express
var express = require("express")
var app = express()
app.use(express.static(__dirname + "/public"))

// http
var http = require("http").createServer(app)
// start http server
var port = 3000
http.listen(port, function() {
	console.log("Listening to port " + port)
})

//mysql
var mysql = require("mysql")
// define connection (create db using pupulate.sql in root)
var connection = mysql.createConnection({
	host: "localhost",
	user: "web_chat",
	password: "pw",
	database: "web_chat"
})
// connect
connection.connect(function (error) {
	console.log("MySQL " + error)
});

// socket.io
var io = require("socket.io")(http)

// CONNECTION EVENT----------------------------
io.on("connection", function (socket) {

	console.log("New_user with socket_id: ", socket.id)
	// listen to messages
	socket.on("new_message", function (data) {
		connection.query("INSERT INTO messages(username, message) VALUES('" + data.username + "', '" + data.message + "')", function (error, result) {
        		data.id = result.insertId
        		io.emit("new_message", data)
        	})
	})
	
})
