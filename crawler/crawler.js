module.exports = Crawler

const _ = require('underscore-node');
const fs = require('fs');

let listCrawlerRef;
let ipc = require('electron').ipcMain;

let self

let MovieList = JSON.parse(fs.readFileSync("movies_1000.json", "utf8"));
let page = 1;

let streamCrawlCallback

ipc.on('receiveMovies', (_, movies) => {
	MovieList = MovieList.concat(movies);
	console.log("movies count: ",MovieList.length);
	//crawlStreamURL(movies[0]);
	//if (movies && movies.length > 0) {
	if (movies && movies.length > 30) { // this is wrong (30 is the page not hte movie number)
		page++;
		self.crawlMovieList(page);	
		//console.log(self);
	};
	//listCrawlerRef.loadURL("about:blank");
	fs.writeFile('movies.json', JSON.stringify(MovieList), function (err) {
		if (err) return console.log(err);
		console.log('Wrote!');
	});
});

ipc.on('receiveMovieURL', (_, movie) => {
	console.log("receiveMovieURL: ",movie);
	listCrawlerRef.loadURL("http://hdfilme.tv/");
	//listCrawlerRef.loadURL("about:blank");
	streamCrawlCallback(movie.socket,movie.url);
});

ipc.on('receiveError',(_,error) => {
	console.log("receiveError: ",error);
});


function Crawler(app, listCrawler){
	listCrawlerRef = listCrawler;
	/*
	listCrawler.webContents.on('dom-ready', () => {
		listCrawler.webContents.executeJavaScript(`
			//require('electron').ipcRenderer.send('eurusd', document.querySelector("#EURUSD_bid > span").firstChild.nodeValue);
			//require('electron').ipcRenderer.send('receiveMovies', document.querySelector(".box-product a[href]").firstChild.nodeValue);
			require('electron').ipcRenderer.send('receiveMovies', 
				(function(){
					var movies = [];
					document.querySelectorAll(".products .box-product").forEach(function(entry){
						movies.push({
							name: entry.querySelector("h3.title-product > a[href]").firstChild.nodeValue,
							img: entry.querySelector("a[href] > img.img").getAttribute("src"),
							url: entry.querySelector("a[href]").getAttribute("href")
						});
					});	
					return movies
				})()
			);
		`);
	});
	*/

	var crawler = {
		crawlMovieList: function(page){
			//listCrawler = listCrawler || new BrowserWindow({width: 1400, height: 800, show: false});	
			//listCrawler.webContents.openDevTools();

			listCrawler.loadURL("http://hdfilme.tv/movie-movies?order_f=imdb&order_d=desc&page=" + page);
			//console.log("page = ",page);

			
		},
		getMovieList: function(){
			return MovieList;
		},
		crawlMovieURL: function(socket,movie,callback){
			//listCrawler = listCrawler || new BrowserWindow({width: 1400, height: 800, show: false});	
			//listCrawler.webContents.openDevTools();

			streamCrawlCallback = callback;

			listCrawler.loadURL(movie.url);

			function myEvent(){
				listCrawler.webContents.executeJavaScript(`					
					// inject jquery (seem like its missing if i load the page with electron)
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

					setTimeout(function(){
						// execute the movieloading script again
						$("#mediaplayer > script").each(function(i,e){eval(e.innerHTML)});

						setTimeout(function(){
							// check for 
							// <div class="jw-title-primary jw-reset">Error loading player: No playable sources found</div>
							/*
							if($(".jw-error")){
								require('electron').ipcRenderer.send('receiveError', 
									(function(){
										return "Movie not avialable";
									})()
								);
							}
							*/					

							// find movie url
							require('electron').ipcRenderer.send('receiveMovieURL', 
								(function(){
									return {
										url: document.querySelector("video").getAttribute("src"),
										socket: '${socket.id}'
									}
								})()
							);
						},1000);


					},500);


				`);	
				//listCrawler.webContents.removeEventListener('dom-ready', myEvent);
			}

			listCrawler.webContents.once('dom-ready', myEvent);
		}
	}
	self = crawler;
	return crawler;
}