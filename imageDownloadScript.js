$(".products.row .box-product > a[href]").each(function(){
	var path = $(this).find("img").attr("src");

	if(path){
		path = path.replace("_thumb","");
		console.log(path);
		$(this).attr("href",path);
		$(this).attr("download","");
	}
});