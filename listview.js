const {app, BrowserWindow} = require('electron');
const electron = require('electron');


let listCrawler

let ipc = electron.ipcMain;

ipc.on('receiveMovies', (_, movies) => {
	/*MovieList = movies
	console.log("receiveMovies: ",movies.length);
	crawlStreamURL(movies[0]);*/
	document.write("movies: " + movies.length);
});

function createListCrawler(){
	listCrawler = new BrowserWindow({width: 1400, height: 800, show: false});	
	
	crawlMode = CRAWL_MODE_LIST;
	listCrawler.loadURL("http://hdfilme.tv/movie-movies?page=1");

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
};

createListCrawler();