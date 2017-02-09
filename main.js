const {app, BrowserWindow} = require('electron');

app.on('ready', function(){
	var crawler = require("./crawler/crawler.js")(app, BrowserWindow);
	var webserver = require("./server/webserver.js")(crawler);

	crawler.crawlMovieList();
});

/*
function crawlStreamURL(movie){
	console.log("----------------------------");
	console.log("crawl url for : ", movie.name);
	console.log("base url: ",movie.url);
	console.log("stream url: ",movie.url.replace(/-info/i,'-stream'));

	crawlMode = CRAWL_MODE_MOVIE;
	listCrawler.loadURL(movie.url.replace(/-info/i,'-stream'));
};
*/