
    // console.log( "js_funcs.js");
    
    // row stripes
    var trs = $('tr.row-stripe:odd');
    if (trs) $(trs).addClass('DataRowStripe');        

    
    function getById( id ){
        return document.getElementById(id);
    }
    function getByName( name ){
        return document.getElementsByName(name);
    }
    function getByClass( cclass ){
        return document.getElementsByClassName(cclass);
    }
    function get( selector ){
        //using # for ID and . for class
        return document.querySelector( selector );
    }
    function getAll( selector ){
        //using # for ID and . for class
        return document.querySelectorAll( selector );
    }

    function removeChild(id){ 
        const e = getById(id);
        if ( e )
            e.parentElement.removeChild(e);        
    }

    function removeChildren(id){
        getById(id).innerHTML = "";
    }

    function removeParent(id){
        const parent = getById(id).parentElement;
        parent.parentElement.removeChild(parent);
    }
    function removeGrandParent(id, isObject = false){

        let parent;
        if ( isObject ){
            parent = id.parentElement;
        }else{
            parent = getById(id).parentElement;
        }
        const grandParent = parent.parentElement;
        grandParent.parentElement.removeChild(grandParent);

    }

    function addClass(groupSelector, className){

        var elements = getAll(groupSelector);
        for(var i = 0; i < elements.length; i++){
            elements[i].classList.add(className);
        }
    }

    function validateCharsOnly(string, chars, isSensitive = false) {

        var char;
        var ret = true;
        for (var i=0; i < string.length; i++) {
            
            char = string.substring(i, i+1 );            
            if ( chars.indexOf(char) == "-1"){
                ret = false;
                break;
            }
        }
        return ret;
    }

    function setProp( el, prop, value){
        if ( ! el ) return
        el[prop] = value
    }

    function combine( any, sep = ", ", lastOccurence = " and")
    {

        let txt = "";
        any.map( (item, index) => {

            if ( index > 0 ){
                if ( index == any.length-1 ){
                    item = " and "+ item;
                }else{
                    item = ", "+ item;
                }
            }

            txt += item;
        })        
        return txt;
    }
    
// classes
    function BusyGif( w="30px"){	
                
    	//remove first
        var div = $("div#busygif");
        if (div){
   	        if (div.length) $(div).remove();
        }

        $('body').append("<div id='busygif'><img src=images/loading-gif.gif width="+ w +"/></div>");          
        $('div#busygif').css({'display':'block', 'position':'absolute'}).hide();   


    	this.show = function(){            
            $(document).ajaxStart(function(){
                CenterDiv('div#busygif');
                $("div#busygif").show();    
            });
            $(document).ajaxComplete(function(){
                $("div#busygif").hide();    
            });         	
        };

        this.show2 = function(topAdj = 0){
            CenterDiv('div#busygif', topAdj );
            $("div#busygif").css("zindex",99999);
        	$("div#busygif").show();    
        }
        this.hide = function(){
        	$("div#busygif").hide();
            
        }
    }

    function TimeFormat( sTime, format = "h:m ap"){
        // format : h:m a = 09:30 AM

        const anyDate = "1/1/2022 ";

        let time = new Date( anyDate + sTime);

        let hour = String(time.getHours()).padStart(2, "0");
        let minute = String(time.getMinutes()).padStart(2, "0");
        let sec = String(time.getSeconds()).padStart(2, "0");

        let ap = "AM";
        if ( format.indexOf("ap") > -1 ){
            
            if ( hour > 12 ){
                hour = hour - 12;
                ap = "PM";
            }
        }

        let ret = format;
        ret = ret.replace("h", hour);
        ret = ret.replace("m", minute);
        ret = ret.replace("s", sec);
        ret = ret.replace("ap", ap);

        return ret;
    }

    function DateFormat(sDate, format){

        // format : Y-m-d , y-M-d, y-M-d D

        let date = new Date(sDate);

        let day = date.getDate();
        let month = date.getMonth();
        let year = date.getFullYear();
        let dayOfWeek = date.getDay();
        
        let months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        let days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

        let m = (month +1).toString().padStart(2, "0");
        let d = day.toString().padStart(2, "0");
        let y = year;
        let y2 = y.toString().substr(0,2);
        var ret = format;

        // year
        ret = ret.replace("Y", y);
        ret = ret.replace("y", y2);

        // month
        ret = ret.replace("M", months[month]);
        ret = ret.replace("m", m);

        // day
        ret = ret.replace("d", d);

        // Day name
        ret = ret.replace("D", days[dayOfWeek]);

        
        return ret;
    }

    function MyDateClass(dateString, dateFormat){        

        //dateString format must be yyyy-mm-dd hh:ii:ss';
        if (typeof dateFormat == 'undefined' || dateFormat == null) dateFormat = "yyyy-mm-dd hh:ii:ss";

        var sFormat = dateFormat;
        var y,m,d,h,i,s,pos,cn, txt;

        //year
        var pos = sFormat.indexOf("y");
        // var cn = sFormat.match(/y/g);
        var cn = (sFormat.split('y').length -1);
        y = dateString.substring(pos, parseInt(pos) + parseInt(cn));

        // month
        pos = sFormat.indexOf("m");
        m = dateString.substring(pos, pos + 2);

        //day
        pos = sFormat.indexOf("d");        
        d = dateString.substring(pos,pos + 2);

        //hour
        pos = sFormat.indexOf("h");
        h = dateString.substring(pos,pos + 2);

        //minute
        pos = sFormat.indexOf("i");
        i = dateString.substring(pos,pos + 2);

        //seconds
        pos = sFormat.indexOf("s");
        if (pos > -1) s = dateString.substring(pos, pos + 2);

        // console.log( dateString, dateFormat, y, m, d, h, i, s, pos);
        // alert(y + "-" + m + "-" + d +" " + h + ":" + i + ":" + s);

        this.formatDate = function(sFormat, lQuoted){
            
            if (typeof lQuoted == 'undefined' || lQuoted === null) lQuoted = false;

            var sDate = sFormat.replace('mm',m);

            sDate = sDate.replace('dd',d);
            sDate = sDate.replace('yyyy',y);
            sDate = sDate.replace('yy',y);
            sDate = sDate.replace('hh',h);
            sDate = sDate.replace('ii',i);
            if (s) sDate = sDate.replace('ss',s);

            if (lQuoted) sDate = "'" + sDate + "'";
            // alert(sDate);
            return sDate;
        }

        this.month = function(){
            return m;
        }
        this.year = function(){           
            return y;
        }
        this.day = function(){
            return d;
        }

    }

//------------------class ------------------


//functions

var isCheckedByCheckbox = false;
function selectChecbox(e, id="", id2=""){
    
    let tag = e.tagName;

    if (e.type == 'checkbox'){
        isCheckedByCheckbox = true;
        return;
    }else{

        if ( isCheckedByCheckbox ){
            isCheckedByCheckbox = false;
            return;
        }     
        
        var chk;

        // id 1
        if( id.indexOf("#") == -1 ) id = '#'+id;        
        chk = get(id); 
        if ( chk ) chk.checked = !chk.checked;        

        // id 2
        if (id2){
            if( id2.indexOf("#") == -1 ) id2 = '#'+id2;            
            chk = get(id2);
            if ( chk ) chk.checked = !chk.checked;
        }
        
    }  
}

function log(...all)
{
    for( let i in all){
        const l = all[i];

        if (typeof l !== 'function')
            console.log( l );
    }
}

function quoteText(sString, lWrap = true){

    var txt;
    if (sString){
        txt = sString.replace(/'/g, "''");
        if (lWrap) txt = "'" + txt + "'";
    }else{
        if (lWrap) txt = "''";
    }    
    
    return txt;
}

function isEmpty(v){
    var ret = false;
    if (typeof v === 'undefined' || v == null || v == 0 || v == false) ret = true;    
    return ret;
}

function getKeys(aPairs){
    var keys = [];
    var k;
    for(k in aPairs){
        if (typeof aPairs[k] !== 'function'){
            keys.push(k);    
        }
    }
    return keys;
}

function getValues(aPairs){
    var val = [];
    for(var k in aPairs){
        if (typeof aPairs[k] !== 'function'){
            val.push( aPairs[k]);      
        }
    } 
    return val;
}

function slideUpDown(id, lDown, sDuration){    
    if (typeof lDown == "undefined" || lDown === null) lDown = true;
    if (typeof sDuration == "undefined" || sDuration === null) sDuration = "fast";

    $(id).animate({
        opacity: "toggle",
        height: "toggle"
    }, sDuration);      
}
//-------------------------------

function dimBack(dimIt, id='dimback', hideCallback = ""){
   
    if (typeof dimIt == 'undefined' || dimIt == null) dimIt = true;

    // id is blank
    if ( ! id ) id = "dimback";
 
    if (dimIt){


        var h = parseInt($("html").css("height"));
        var h2 = window.innerHeight;
        if (h2 > h) h = h2;

 
        $('body').append(`<div id='${id}'></div>`);

  
        $(`div#${id}`).css({"left":"0", "height": h, "position":"absolute", 'display': 'block',
            'top': 0, 'left': 0, 'width':'100%', 'margin-top': '0px',
            'z-index': 99 , 'background-color':'Black', 'opacity': 0.6 });
           
        $(`div#${id}`).fadeIn("normal");              
 

        if ( hideCallback ){
            $(`div#${id}`).click(hideCallback);
        }
    }else{
        $(`div#${id}`).remove();
    }

}

//-------------------------------
function CenterDiv(id, topAdj = 0) {    
        
    const elem = $(id);      
    let top = (($(window).height() - $(elem).outerHeight()) / 2) + $(window).scrollTop();
    let left = (($(window).width() - $(elem).outerWidth()) / 2) + $(window).scrollLeft();

    top = top + topAdj;

    $(elem).css({'top':top, 'left':left});  
}
//-------------------------------

function hideItem(id){
    
    if ( id.indexOf("#") == -1 ) id = "#" + id;
    const e = get(id);
    e.style.left = -999;
}


function CenterItem(id){

    if ( id.indexOf("#") == -1 ) id = "#" + id;

    let e = get(id);

    let wh = window.innerHeight;
    let ww = window.innerWidth;
    let sy = window.scrollY;
    let sx = window.scrollX;

    let eh = e.clientHeight;
    let ew = e.clientWidth;

    let x = (ww / 2) - (ew / 2) + sx;
    let y = (wh / 2) - (eh / 2) + sy;

    e.style.top = y;
    e.style.left = x;    

}


function CalendarDateTime(imgID, inputTextID, showTime, dateFormat){

    if (typeof showTime == "undefined" || showTime === null) showTime = true;
    if (typeof dateFormat == "undefined" || dateFormat === null) dateFormat = "%m/%d/%Y %H:%M";

    var cal = Calendar.setup({showTime: showTime, 
        onSelect: function(cal) { cal.hide(); }      
    }); 
    cal.manageFields(imgID, inputTextID, dateFormat);   
}    
//-------------------------------

function ShowHideByID(id, show, duration, fuctionName){
        
    if(typeof show == "undefined" || show === null) show = true;
    if(typeof duration == "undefined" || duration === null) duration = "normal";
    if(typeof functionName == "undefined" || functionName === null) functionName = null;
    
    var o = $(id);

    if (show){          
        $(o).css('display','').animate({opacity:1},duration);
    }else{  

        if (duration == "none"){
            $(o).hide();
        }else{
            $(o).animate({opacity:.2}, duration,
                function(){
                    $(this).css('display','none');
                });         
        }
    }       

    if (functionName){
        functionName(a, b, c, d);
    }
}   
//-------------------------------

function padLeft(sNum, sChar, num){
    var s = sNum+"";
    while (s.length < num) s = sChar + s;
    return s;   
}

function isOnScreen(elem)
{
    var elem = $(elem);
    var scr = $(window);

    if ( elem ){
        var docViewTop = $(scr).scrollTop();
        var docViewBottom = docViewTop + $(scr).height();

        var elemTop = $(elem).offset().top;
        var elemBottom = elemTop + $(elem).height();

        // console.log(elemTop);
        // console.log(elemBottom);
        
        return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
    }else{
        return false;
    }
}

function popWindow(url, _width, _height, specs = ""){

    /*
    var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : window.screenX;    
    var dualScreenTop = window.screenTop != undefined ? window.screenTop : window.screenY;

    var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

    var systemZoom = width / window.screen.availWidth;
    var left = (width - _width) / 2 / systemZoom + dualScreenLeft;
    var top = (height - _height) / 2 / systemZoom + dualScreenTop;   
    */
    
    // console.log("pop window - js_funcs");

    let left = (window.outerWidth/2)-( _width/2);
    left += window.screenX;

    let top = (window.outerHeight/2)-(_height/2);
    top += window.screenY;
  
    if ( specs == "" ){
        specs = 'toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=1,resizable=1';
    }
    var newWindow = window.open(url, 'name', specs + ', top='+ top +', left='+ left +', width='+ _width  +', height='+ _height  );
    newWindow.focus();
}


function popWindowResize()
{
    
    //console.log("popWindowsResize()");

    const body = document.body,
          html = document.documentElement; 

    // height
    let innerH = Math.max(html.scrollHeight, body.scrollHeight);
    let outerH = Math.min(html.clientHeight, window.outerHeight)

    //console.log( html.clientHeight, body.scrollHeight, innerH, outerH);

    if ( outerH < innerH )
        window.resizeTo( window.outerWidth, innerH + 100);   
    
    // width
    let width = html.scrollWidth;
    //console.log( html.clientHeight , height);
    if ( html.clientWidth < width )
        window.resizeTo( width + 20, window.outerHeight + 20, );   

    // move window center to opener window
    let parentW = window.opener;
    if ( parentW ){    

        let h = window.outerHeight;
        let w = window.outerWidth;

        let left = (parentW.outerWidth/2)-(w/2);
        left += parentW.screenX;

        let top = (parentW.outerHeight/2)-(h/2);
        top += parentW.screenY;

        window.moveTo(left, top);
    }
}


function isEmailValid( email )
{

    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email) ) {
        return true;
    }else{
        return false;
    }    
}

function overrideFormEnterKey( formID, elementID, runFunc = "" )
{
    const frm = getById('frm_team_setup');
    if ( frm ){
        frm.onkeydown = event => {            
            if (event.keyCode == 13 && event.target.id == elementID ){
                //console.log( event);
                event.preventDefault();                             
                if ( runFunc) runFunc();           
                return false;
            }
        }
    }
}

function xxhr(method, path, func){
    
    //ex:  xxhr("GET", 'xhtml_response.php?q=myRecEntry&id='+ e.dataset.id, show);
    //    function show(ret){  ... to show return html }

    var xhr = new XMLHttpRequest();

    xhr.open(method, path, true);  
    xhr.onload = function(){
        if (this.status == 200){

            if (func)
                func(this.responseText);                     

        // }else if( this.status == 404){
        //  p.innerHTML = " not found";
        }
    };
    xhr.send();         
}

function xxhrGet(url, callBackFunc = ""){
   xxhr("GET", url, callBackFunc);
}

function xxhrPost(url, data=[], callBackFunc = ""){
    
    let xhr = new XMLHttpRequest();
    let formData = new FormData();

    for( const name in data ){        
        formData.append(name, data[name]);                                
    }
    xhr.open("POST", url, true );
    xhr.send(formData);

    if ( callBackFunc ){
        xhr.onload = function(){
            if (this.status == 200) callBackFunc(this.responseText);                     
        };
    }
}

// console.log( "js_funcs.js - end");
//---------------functions-----------------