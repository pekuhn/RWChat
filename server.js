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

//Using socket.io a db is technically not necessary. I decided to remove it. 
//You can delete the comment marks here and below so that the chat saves everthing in mysql...
//mysql
//var mysql = require("mysql")
// define connection (create db using pupulate.sql in root)
//var connection = mysql.createConnection({
//	host: "localhost",
//	user: "web_chat",
//	password: "pw",
//	database: "web_chat"
//})
// connect to mysql
//connection.connect(function (error) {
//	console.log("MySQL " + error)
//});

// socket.io
var io = require("socket.io")(http)

// IBM WATSON ToneAnlayser
var api_key = "XWWz1X73jSyN_5tJYMESd7g70En6zSdcwz6xuQdSAQoc"
var api_url = "https://api.eu-de.tone-analyzer.watson.cloud.ibm.com/instances/f9784a0d-41f5-4895-89ea-76a56492d2be"

const ToneAnalyzerV3 = require('ibm-watson/tone-analyzer/v3');
const { IamAuthenticator } = require('ibm-watson/auth');

const toneAnalyzer = new ToneAnalyzerV3({
  version: '2017-09-21',
  authenticator: new IamAuthenticator({
    apikey: api_key,
  }),
  url: api_url,
});

// CONNECTION EVENT----------------------------
io.on("connection", function (socket) {

	console.log("New_user with socket_id: ", socket.id)
	// listen to messages
	socket.on("new_message", function (data) {
		console.log("The message is: ", data.message)

		//turn message into JSON for Tone Analyser
		const toneChat = { utterances: [ { text: data.message, }, ], };

		toneAnalyzer.toneChat(toneChat)
  		.then(utteranceAnalyses => {

			//to see the ToneAnalyzers output in the console uncomment this line
    			//console.log(JSON.stringify(utteranceAnalyses, null, 2));
			
			//check whether ToneAnalyser was able to interpred the message
			if ( typeof utteranceAnalyses.result.utterances_tone[0].tones[0] === "undefined" ) {
				data.tone = "none"
                                console.log("Watson doesnt have a clue...")
			} else {
				data.tone = utteranceAnalyses.result.utterances_tone[0].tones[0].tone_id
                                console.log("Watson thinks the tone is ", data.tone)
			}
			io.emit("new_message", data)

//              	Redundant MySQL Query, see above
//              	connection.query("INSERT INTO messages(username, message, tone) VALUES('" + data.username + "', '" + data.message + "', '" + data.tone '")", function (error, result) {
//                      	console.log("mysql error ", error)
//                      	data.id = result.insertId
//                      	io.emit("new_message", data)
//			})

  		})
  		.catch(err => {
    			console.log('error:', err);
 		});


	})

})
