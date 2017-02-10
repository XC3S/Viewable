app.factory('$movie',function($socket){
	var movies = [];

	$socket.on('movies',function(data){
		movies = data || [];
		console.log(data);
	});

	

	return {
		getMovies: function(){
			return movies;
		},
		loadMovie: function(movie){
			$socket.emit("load",movie);
		}
	}
});