module.exports = Crawler

let listCrawler;
let ipc = require('electron').ipcMain;

let MovieList

ipc.on('receiveMovies', (_, movies) => {
	MovieList = movies
	console.log("receiveMovies: ",movies.length);
	//crawlStreamURL(movies[0]);
});

ipc.on('receiveMovieURL', (_, movieURL) => {
	console.log("receiveMovieURL: ",movieURL);
	listCrawler.close();
	//win.loadURL(movieURL);
});

function Crawler(app, BrowserWindow){
	return {
		getMovieList: function(){
			listCrawler = new BrowserWindow({width: 1400, height: 800, show: false});	
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
			});
		}
	}
}