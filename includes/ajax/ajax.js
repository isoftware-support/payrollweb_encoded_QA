function GetHTMLContent(id,url) {

	
    new Ajax.Updater(id,url,{asynchronous:true});
    //alert("HI");   
}   
function OpenArticleSource(url) {
    newwindow = window.open(url, 'name', 'status=1,width=350,height=150');
    if (window.focus) {
        newwindow.focus()
    }
}
