const {app, BrowserWindow} = require('electron');

app.on('ready', function(){
	var listCrawler = listCrawler || new BrowserWindow({width: 1200, height: 800, show: true});	
	//listCrawler.webContents.openDevTools();

	var crawler = require("./crawler/crawler.js")(app, listCrawler);
	var webserver = require("./server/webserver.js")(crawler);

	listCrawler.loadURL("http://hdfilme.tv/");

	//crawler.crawlMovieList();
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