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
// connect to mysql
connection.connect(function (error) {
	console.log("MySQL " + error)
});

// socket.io
var io = require("socket.io")(http)

//request
const request = require('request')

// PREPARING IBM TONE ANALYSER API-------------
var api_key = "XWWz1X73jSyN_5tJYMESd7g70En6zSdcwz6xuQdSAQoc"
var api_url = "https://api.eu-de.tone-analyzer.watson.cloud.ibm.com/instances/f9784a0d-41f5-4895-89ea-76a56492d2be/v3/tone?version=2017-09-21&sentences=false&text="

// CONNECTION EVENT----------------------------
io.on("connection", function (socket) {

	console.log("New_user with socket_id: ", socket.id)
	// listen to messages
	socket.on("new_message", function (data) {
		console.log("The message is: ", data.message)

		//turn message into url
		var message_url = encodeURIComponent(data.message)
		//prepare full api url
		var url = api_url + message_url

		console.log("api url" + url)

		request.get( url , function (error, response, body) {
 			console.error('error:', error); // Print the error if one occurred
  			console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  			console.log('body:', body); // Print the HTML for the Google homepage.
		}).auth('apikey', api_key)

		connection.query("INSERT INTO messages(username, message) VALUES('" + data.username + "', '" + data.message + "')", function (error, result) {
        		data.id = result.insertId
        		io.emit("new_message", data)
        	})

	})

})
