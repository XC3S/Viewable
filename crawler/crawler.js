module.exports = Crawler

const _ = require('underscore-node');

let listCrawler;
let ipc = require('electron').ipcMain;

let self

let MovieList = [];
let page = 1;

let streamCrawlCallback

ipc.on('receiveMovies', (_, movies) => {
	MovieList = MovieList.concat(movies);
	console.log("movies count: ",MovieList.length);
	//crawlStreamURL(movies[0]);
	if (movies && movies.length > 0) {
		page++;
		//self.crawlMovieList(page);	
		//console.log(self);
	};
});

ipc.on('receiveMovieURL', (_, movie) => {
	console.log("receiveMovieURL: ",movie);
	listCrawler.loadURL("about:blank");
	streamCrawlCallback(movie.socket,movie.url);
});


function Crawler(app, BrowserWindow){
	var crawler = {
		crawlMovieList: function(page){
			listCrawler = listCrawler || new BrowserWindow({width: 1400, height: 800, show: false});	
			listCrawler.webContents.openDevTools();

			listCrawler.loadURL("http://hdfilme.tv/movie-movies?order_f=imdb&order_d=desc&page=" + page);
			console.log("page = ",page);

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
		},
		getMovieList: function(){
			return MovieList;
		},
		crawlMovieURL: function(socket,movie,callback){
			listCrawler = listCrawler || new BrowserWindow({width: 1400, height: 800, show: false});	
			listCrawler.webContents.openDevTools();

			streamCrawlCallback = callback;

			listCrawler.loadURL(movie.url.replace(/-info/i,'-stream'));

			listCrawler.webContents.on('dom-ready', () => {
				listCrawler.webContents.executeJavaScript(`
					//require('electron').ipcRenderer.send('eurusd', document.querySelector("#EURUSD_bid > span").firstChild.nodeValue);
					//require('electron').ipcRenderer.send('receiveMovies', document.querySelector(".box-product a[href]").firstChild.nodeValue);
					require('electron').ipcRenderer.send('receiveMovieURL', 
						(function(){
							return {
								url: document.querySelector("video").getAttribute("src"),
								socket: '${socket.id}'
							}
						})()
					);
				`);
			});
		}
	}
	self = crawler;
	return crawler;
}