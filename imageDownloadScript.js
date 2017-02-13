// Downloads all movie covers on a hdmovie list page
$(".products.row .box-product > a[href]").each(function(){
	var path = $(this).find("img").attr("src");

	if(path){
		path = path.replace("_thumb","");
		console.log(path);
		$(this).attr("href",path);
		$(this).attr("download","");

		var a = document.createElement('a');
		a.href = path;
		a.download = "";
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	}
});