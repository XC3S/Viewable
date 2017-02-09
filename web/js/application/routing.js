app.config(function($routeProvider){
	$routeProvider
	.when("/",{
		templateUrl: "views/movieList.html"
	})
	.otherwise({redirectTo: '/'});
});