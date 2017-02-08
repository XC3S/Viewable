// alternative names: steamhunt, 

const {app, BrowserWindow} = require('electron');
const electron = require('electron');

// Keep a global reference to the crawler and the window
let listCrawler,win

const CRAWL_MODE_LIST = "LIST";
const CRAWL_MODE_MOVIE = "MOVIE";
let crawlMode = CRAWL_MODE_LIST;

let ipc = electron.ipcMain;

let MovieList

ipc.on('receiveMovies', (_, movies) => {
	MovieList = movies
	console.log("receiveMovies: ",movies.length);
	crawlStreamURL(movies[0]);
});

ipc.on('receiveMovieURL', (_, movieURL) => {
	console.log("receiveMovieURL: ",movieURL);
	listCrawler.close();
	win.loadURL(movieURL);
});

function createListCrawler(){
	listCrawler = new BrowserWindow({width: 1400, height: 800, show: false});	
	
	crawlMode = CRAWL_MODE_LIST;
	listCrawler.loadURL("http://hdfilme.tv/movie-movies?page=1");

	listCrawler.webContents.on('dom-ready', () => {
		if(crawlMode === CRAWL_MODE_LIST){
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
		}
		if(crawlMode === CRAWL_MODE_MOVIE){
			console.log("find movie!");
			listCrawler.webContents.executeJavaScript(`
				require('electron').ipcRenderer.send('receiveMovieURL',
					(function(){
						return document.querySelector("video").getAttribute("src")
					})()	
				); 
			`);
		}
	});

	listCrawler.on('closed', () => {
	    listCrawler = null
  	});
}

function crawlStreamURL(movie){
	console.log("----------------------------");
	console.log("crawl url for : ", movie.name);
	console.log("base url: ",movie.url);
	console.log("stream url: ",movie.url.replace(/-info/i,'-stream'));

	crawlMode = CRAWL_MODE_MOVIE;
	listCrawler.loadURL(movie.url.replace(/-info/i,'-stream'));
};

function createWindow(){
	win = new BrowserWindow({width: 1400, height: 800, show: true});

	win.on('closed', () => {
	    app.quit()
	});
}

app.on('ready', function(){
	createListCrawler();
	createWindow();
})




// -----------------------------------


/*

(function(){var movies = [];document.querySelectorAll(".box-product").forEach(function(entry){movies.push({ img: entry.querySelector(a[href])}) });	return movies})();

(function(){
	var movies = [];
	document.querySelectorAll(".box-product").forEach(function(entry){
		movies.push({
			img: entry.querySelector("a[href]")
		});
	});	
	return movies
})();



.getAttribute("href");



$(".box-product").each(function(index){
	console.log(index,$(this).find("a[href]").attr("href"));
});
*/
