var movieController = function($scope,$movie,$socket){
	$scope.vidUrl = "test";

	$socket.on('receiveStream',function(url){
		//$scope.vidUrl = url;
		window.open(url);
		/*
		var elem = document.getElementById("vid");
		if (elem.requestFullscreen) {
		  elem.requestFullscreen();
		}
		*/
	});

	$scope.getMovies = function(){
		return $movie.getMovies();
	}

	$scope.loadMovie = function(movie){
		$movie.loadMovie(movie);
	}
}

app.controller("movieController",movieController);
movieController.$inject = ["$scope","$movie","$socket"];