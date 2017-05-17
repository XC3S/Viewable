const {app, BrowserWindow} = require('electron');

app.on('ready', function(){
	var listCrawler = listCrawler || new BrowserWindow({width: 1200, height: 800, show: true});	
	//listCrawler.webContents.openDevTools();

	var crawler = require("./crawler/crawler.js")(app, listCrawler);
	var webserver = require("./server/webserver.js")(crawler);

	listCrawler.loadURL("http://hdfilme.tv/");
	listCrawler.webContents.once('dom-ready', function(){
		listCrawler.webContents.executeJavaScript(`	
			(function(d, script) {
			    script = d.createElement('script');
			    script.type = 'text/javascript';
			    script.async = true;
			    script.onload = function(){
			        // remote script has loaded
			    };
			    script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js';
			    d.getElementsByTagName('head')[0].appendChild(script);
			}(document));
		`);	
	});


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