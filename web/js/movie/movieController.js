var movieController = function($scope,$movie,$socket,$window){
	$scope.vidUrl = "test";
	$scope.loading = false;
	$scope.watching = false;
	$scope.player = null;

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

	$socket.on('test',function(data){
		//$scope.vidUrl = url;
		$scope.watching = true;
		$scope.loading = false;
		//window.open(url);
		/*
		var elem = document.getElementById("vid");
		if (elem.requestFullscreen) {
		  elem.requestFullscreen();
		}
		*/

		$scope.player = jwplayer("player");

		var json = JSON.parse(atob(data.data));

		var advertising = {};

        var config = {
            'skin':             {name: "roundster"},
            'abouttext':        "site_name",
            'aboutlink':        "site_url",
            'width':            '100%',
            'height':           '100%',
            'autostart':        'true',
            'stretching':       'uniform',
            'sources' :         json.playinfo ,
            'advertising':      advertising,
            'preload':          'auto'
        };

        // setup jwplayer
        $scope.player.setup(config);
	});


	$scope.backToList = function(){
		$scope.watching = false;
		$window.$("#player").replaceWith('<div id="player">Loading the player...</div>');
	}

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
movieController.$inject = ["$scope","$movie","$socket","$window"];