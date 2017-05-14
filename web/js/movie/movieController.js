var movieController = function($scope,$movie,$socket){
	$scope.vidUrl = "test";
	$scope.loading = false;

	$scope.genres = [
		"Alle",
		"Action",
		"Abenteuer",
		"Drama",
		"Horror",
		"Fantasy",
		"Animation"
	]

	$socket.on('receiveStream',function(url){
		//$scope.vidUrl = url;
		$scope.loading = false;
		window.open(url);
		/*
		var elem = document.getElementById("vid");
		if (elem.requestFullscreen) {
		  elem.requestFullscreen();
		}
		*/
	});

	$scope.getMovies = function(){

		//trigger resize to force recalulate the aspect radio
		$(window).resize();

		return $movie.getMovies();
	}

	$scope.loadMovie = function(movie){
		$scope.loading = true;
		$movie.loadMovie(movie);
	}
}

app.controller("movieController",movieController);
movieController.$inject = ["$scope","$movie","$socket"];