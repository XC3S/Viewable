module.exports = webServerProvider;

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

function webServerProvider(crawler){
	// launch server
	server.listen(3000,function(){
		console.log("webserver started!");
	});

	// host frontend sources
	app.use(express.static(__dirname + '/../web'));

	// allways send the lates informations to new connections
	io.on('connection',function(socket){
		console.log("emit movies:",crawler.getMovieList().length);
		socket.emit("movies",crawler.getMovieList());

		socket.on('load',function(movie){
			console.log("load: ",movie.name);
			crawler.crawlMovieURL(socket,movie,function(socketId,streamURL){
				io.to(socketId).emit('receiveStream',streamURL);
			});
		});
	});

	
}