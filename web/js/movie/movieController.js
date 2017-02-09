var movieController = function($scope,$movie){
	$scope.getMovies = function(){
		return $movie.getMovies();
	}

	$scope.loadMovie = function(movie){
		$movie.loadMovie(movie);
	}
}

app.controller("movieController",movieController);
movieController.$inject = ["$scope","$movie"];