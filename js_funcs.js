    
    // geo lat and long
    if (typeof geo_lat !== 'undefined') var geo_lat = 0
    if (typeof geo_long !== 'undefined') var geo_long = 0    

    // ------------------
    // prevent post refresh 
    // -------------------
    if ( window.history.replaceState ) {
        window.history.replaceState( null, null, window.location.href );
    }    

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

    function callEvent( id, event_name = 'click' ){
        // event = click , change , ... exclude on in event name

        const el = getById( id )
        if ( el ){
            const event = new Event( event_name )
            el.dispatchEvent(event)
        }

    }

    function replaceParent( childId, parentId) {

      const child = getById(childId);
      if ( ! child ) return

      const newParent = getById(parentId);      
      newParent.appendChild(child);

      // Replace the old parent with the new parent in the DOM
      const oldParent = child.parentNode;
      oldParent.parentNode.replaceChild(newParent, oldParent);
    }

    function getChildren(element, children = []) {
          
      // Iterate over the children of the current element
      const items = element.children;
      for (var i = 0; i < items.length; i++) {
        
        const child = items[i]
        children.push( child )
        getChildren( child, children )
      }     
    }

    function disableChildren( parentElement, disabled = true, showOrhide = false){

        const children = []
        getChildren( parentElement, children )

        for( let index in children){

            const el = children[index]      
            if ( ["INPUT", "LABEL"].includes(el.tagName) ){

                if ( disabled ){
                    el.disabled = true
                    el.classList.add("disabled")
                    if ( showOrhide ) el.classList.add("d-hide")

                } else {
                    el.disabled = false
                    el.classList.remove("disabled")
                    if ( showOrhide ) el.classList.remove("d-hide")
                }
            }
        }
     
    }

    function removeMe( id ){

        const e = getById(id)
        if ( e ){
            e.classList.add("anim-hide-item");
            setTimeout( function(){
                e.parentElement.removeChild(e) 
            }, 300);
        }
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
        console.log('parent', parent)
        
        parent.classList.add("anim-hide-item");
        setTimeout( function(){
            parent.parentElement.removeChild(parent) 
        }, 300);
        
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

    function classAdd(groupSelector, className ){

        var elements = getAll(groupSelector);
        for(var i = 0; i < elements.length; i++){
            elements[i].classList.add(className);
        }
    }

    function classAddIf(groupSelector, className, isAdd = true ){

        var elements = getAll(groupSelector);
        for(var i = 0; i < elements.length; i++){

            if ( isAdd ){
                elements[i].classList.add(className);
            }else{
                elements[i].classList.remove(className);
            }
        }
    }

    function classToggle(groupSelector, className){

        var elements = getAll(groupSelector);
        for(var i = 0; i < elements.length; i++){
            elements[i].classList.toggle(className);
        }
    }

    function classRemove(groupSelector, className){

        var elements = getAll(groupSelector);
        for(var i = 0; i < elements.length; i++){
            elements[i].classList.remove(className);
        }
    }

    function classReplace(groupSelector, oldClass, newClass){

        var elements = getAll(groupSelector);
        for(var i = 0; i < elements.length; i++){
            elements[i].classList.replace(oldClass, newClass);
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

    function uriString(string){
        // use urldecode() in php
        return encodeURIComponent(string)
    }

    function urlParams( obj ){

        // use urldecode() in php
        
        const params = [];

        for (let key in obj) {

            if (obj.hasOwnProperty(key)) {

                const _key = encodeURIComponent(key);
                const _value = encodeURIComponent( obj[key] );
                const _param = `${_key}=${_value}`;
                params.push( _param );
            }
        }
        return params.join('&');

    }

    function msgBox(message = [], options = {}){

        /*
         message = [ {message:'', class:''} ]
         options = {            
            title: '',
            class: 'w-300', 
            msgbg: 'bg-white'
            okCallBack: '', 
            okCaption: 'Ok',
            cancelButton: false,
            cancelCallBack:'',
            persistent: false,
            buttons_bg: 'bg-lightgrey-3',

         }
        */

        // defaults
        let keys = Object.keys(options)
        if ( keys.indexOf('class') == -1)           options.class = "w-300 d-block"                    
        if ( keys.indexOf('msgbg') == -1)           options.msgbg = "bg-white"
        if ( keys.indexOf('title') == -1)           options.title = ""
        if ( keys.indexOf('persistent') == -1)      options.persistent = false
        if ( keys.indexOf('okCaption') == -1)       options.okCaption = "Ok"
        if ( keys.indexOf('buttons_bg') == -1)      options.buttons_bg = 'bg-lightgrey-3'

        // if ( keys.indexOf('cancelButton') == -1)    options.cancelButton = false
        //if ( keys.indexOf('cancelCallBack') == -1)  options.cancelCallBack = ''

        // if passed is a string only
        const txt = message
        if ( typeof message == "string") message = [{message: txt, title: '', class: ''}];        

        const id = "msg-box-prompt"

        // clear child elements
        let div_main = getById(id)
        if ( div_main ) div_main.innerHTML = ""
                   
        const body = get("body");

        let e = document.createElement('div')
        const z_index = 999
        e.id = "msg-box-prompt";
        e.style.zIndex = z_index
        // e.classList.add('modal-box', 'br-b-5', 'shadow-3', )
        e.classList.add('modal-box', 'br-b-5', 'shadow-2-black' )

        const classes = options.class.split(" ")
        classes.forEach( (c)=>{
            e.classList.add(c)                
        })

        e.style.left = -999
        body.appendChild(e);

        div_main = getById("msg-box-prompt");

        // title
        if ( options.title ){
            e = document.createElement('div')
            e.id = "msg-box-title"
            e.innerHTML = `<p>${options.title}</p>`
            e.classList.add('bg-menu', 'c-white', 'ta-c', 'py-5', 'h4')
            div_main.appendChild(e);            
        }

        // message
        let msg = ""        
        if ( Array.isArray(message) ){

            message.forEach((item)=>{
                const txt = item.message.replaceAll("\r\n", "<br>")                
                msg += `<p class='h4 lh-18 ${item.class}'>${txt}</p>`

            })
        }
        if ( ! msg ) return;

        e = document.createElement('div')
        e.id = "msg-box-message"
        e.innerHTML = msg;
        e.classList.add('p-20')
        if ( options.msgbg ){
            let a = options.msgbg.split(" ");
            a.forEach((c) => e.classList.add(c) )
        }
        
        div_main.appendChild(e)

        // -------------
        // buttons
        // -------------

        // canell button
        let cancel = ""
        if ( options.cancelButton ){
            cancel = "<button id='msg-box-button-cancel' class='ml-5' type='button'>Cancel</button>"
        }

        e = document.createElement('div')
        e.id = "msg-box-buttons"
        e.innerHTML = `<center><button id='msg-box-button-ok' type='button' >${options.okCaption}</button>${cancel}<center>`
        e.classList.add('py-8', options.buttons_bg)
        div_main.appendChild(e)

        // button event
        const _hide = ()=>{            
            div_main.style.left = -999
            dimBack2( {dimIt: false, id:'msgdim'} );
        }

        // OK Click
        getById("msg-box-button-ok").onclick = ()=>{

            _hide()

            if ( options.okCallBack ) options.okCallBack();                       
        }

        // Cancel click
        getById('msg-box-button-cancel')
        if ( e ){
            e.onclick = () =>{
                _hide()
                if ( options.cancelCallBack ) options.cancelCallBack();
            }
        }
        
        CenterItem( id);

        if ( options.persistent ){            
            dimBack2( {dimIt: true, id:'msgdim', zIndex: z_index - 2} )            

        }else{
            dimBack2( {dimIt: true, id:'msgdim', 
                hideCallback: _hide, zIndex: z_index - 2} )            
        }

        // focus  button
        e = getById( "msg-box-button-cancel" )
        if ( e ){
            e.focus()
        }else{
            getById("msg-box-button-ok").focus()
        }

    }


    function redirectHomeScript( options = {})
    {

        let keys = Object.keys(options)
        if ( ! keys.length ){
            options.elementId = "redirect-counter";
            options.message = 'Redirecting to the home page';
            options.redirect = '';
        }

        var seconds = 5;    
        var redirectTimer = setInterval(()=>{                        

            if ( seconds <= 0 ){

                clearInterval( redirectTimer );
                window.location.replace( options.redirect );                

            }else{                  
                let p = getById( options.elementId);
                if (p){
                    p.innerHTML = '(' + options.message + ' in ' + seconds + ')';
                }
            }            

            seconds -= 1;
        }, 1000);
    }    

// classes
    function BusyGif( w="30px"){	
                
    	//remove first
        var div = $("div#busygif");
        if (div){
   	        if (div.length) $(div).remove();
        }

        $('body').append(
            `<div id='busygif'>
                <label id='busy-msg'></label><img src=images/loading-gif.gif width=${w}/>                
            </div>`
        );          
        $('div#busygif').css({'display':'block', 'position':'absolute'}).hide();   
        $("div#busygif").css("z-index",9999);


    	this.show = function(){            
            $(document).ajaxStart(function(){
                CenterDiv('div#busygif');
                $("div#busygif").show();    
            });
            $(document).ajaxComplete(function(){
                $("div#busygif").hide();    
            });         	
        };

        this.show2 = function(topAdj = 0, msg = ""){

            const el = getById('busy-msg')
            if (el) el.innerHTML = msg;
            
            CenterDiv('div#busygif', topAdj );
        	$("div#busygif").show();               
        }
        this.hide = function(){
        	$("div#busygif").hide();
            
        }
    }

    function NumberFormat(num){
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function TimeFormat( sTime, format = "h:m ap"){
        // format : h:m a = 09:30 AM

        const anyDate = "1/1/2022 ";

        let time = new Date( anyDate + sTime);

        let hour = time.getHours();
        let minute = time.getMinutes();
        let sec = time.getSeconds();

        let ap = "AM";
        if ( format.indexOf("ap") > -1 ){           
            if ( parseInt(hour) > 11 ) ap = "PM";
            if ( parseInt(hour) > 12 ) hour = parseInt(hour) - 12;

            if (hour == 0) hour = 12;
        }

        hour = String(hour).padStart(2, "0");
        minute = String(minute).padStart(2, "0");
        sec = String(sec).padStart(2, "0");


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

        // day
        ret = ret.replace("d", d);
        
        // year
        ret = ret.replace("Y", y);
        ret = ret.replace("y", y2);

        // Day name
        ret = ret.replace("D", days[dayOfWeek]);

        // month
        ret = ret.replace("M", months[month]);
        ret = ret.replace("m", m);

       
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
function markUnmark( item_class, collection, value, callback = "" ){

    const from = getAll("."+ item_class)    

    const changed = []
    for( const cb of from){
        
        // hidden
        if ( cb.offsetParent === null ) continue

        if ( cb.checked ){

            const no = cb.dataset.no            
            const item = collection.find( (i) => i.id == no)
            item.value = value
            changed.push( item )
        }
    }    

    if ( callback ) callback( changed );

}


function selectOptionItem( id, value ){

    let e = getById(id)
    if ( ! e ) return;

    for( key in e.options){
        const option = e.options[key]
        if ( option.tagName == "OPTION"){
            if ( option.value == value ){
                option.selected = true
            }
        }
    }

}

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

/*
// function log(...all)
function log()
{
    console.log(arguments)

    // for( let i in all){
    //     const l = all[i];

    //     if (typeof l !== 'function')
    //         console.log( l );
    // }
}
*/
function toggleValue( _var, val1, val2 ){
    return _var == val1 ? val2 : val1
}

function wrapWith(string, char = "'"){

    string = string.replaceAll(char, "");
    string = char + string + char
    return string
}

function pluralize( word, num, plural = "")
{

    if ( num > 1 ){

        const last = word[ word.length -1]
        const last2nd = word[ word.length -2]
        
        if ( last.toLowerCase() == "y"){

            if ( "aeiou".indexOf( last2nd.toLowerCase() ) > -1){
                return word + "s"
            }
        }

        let new_word = word;            
        let add = "s";

        if ( last == "y"){
            add = "ies"
            new_word = word.slice(0, -1)

        }else if ( last == "Y"){
            add = "IES"
            new_word = word.slice(0, -1)

        }else if( last == "s"){
            add = "es"

        }else if( last == "S"){
            add = "ES"
        }
        return new_word + add;
    }else{
        return word
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

function setDefault(v, _default = ""){
    let ret = v
    if ( v == null ) v = _default
    return ret
}

function isEmpty(v){

    var ret = false;    
    if ( typeof v === 'undefined' || v == null || v == 0 || v == false) ret = true;    
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

function dimBack2( options = {dimIt: true, id: 'dimback', hideCallback: "", bg: 'black', opacity: 0.4, zIndex: 99} ){

    let keys = Object.keys(options)

    // defaults
    if ( keys.indexOf('dimIt') == -1)        options.dimIt = true   
    if ( keys.indexOf('id') == -1)           options.id = "dimback"
    if ( keys.indexOf('hideCallback') == -1) options.hideCallback = ""
    if ( keys.indexOf('bg') == -1)           options.bg = "black"
    if ( keys.indexOf('opacity') == -1)      options.opacity = 0.4
    if ( keys.indexOf('zIndex') == -1)       options.zIndex = 99
    
    // console.log('zindex', options.zIndex)        ;

    dimBack( options.dimIt, options.id, options.hideCallback, options.bg, options.opacity, options.zIndex)
}

function dimBack(dimIt, id='dimback', hideCallback = "", bg = 'black', opacity = 0.4, zIndex = 99){
   
    if (typeof dimIt == 'undefined' || dimIt == null) dimIt = true;

    // id is blank
    if ( ! id ) id = "dimback";
    if ( ! bg ) bg = 'black'
    if ( ! opacity ) opacity = 0.4
    
    if (dimIt){

        if ( get("div[name='dim_back']") ) opacity = 0.2

        $('body').append(`<div id='${id}' name='dim_back'></div>`);

        $(`div#${id}`).addClass("modal-dim")
        $(`div#${id}`).css({'z-index': zIndex , 'background-color': bg, 'opacity': opacity});           
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

function hideItem(id, isMoveOffScreenOnly = true){
    
    if ( id.indexOf("#") == -1 ) id = "#" + id;
    
    const e = get(id);
    if( ! e ) return

    if ( isMoveOffScreenOnly ){
        e.style.left = -999;
    }else{
        e.style.display = 'none';
    }
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

    let topAdj = 0
    let leftAdj = 0

    // ticket windows exception - parent is relative,
    // centered div correction
    const parent =  e.parentElement
    if ( parent ){
        if ( parent.id == "body-content"){
            y -= parent.offsetTop
            x -= parent.offsetLeft
        }
    }

    e.style.top = y 
    e.style.left = x   
}

function focusItem(id){
    const e = getById(id);
    if ( e ){
        e.focus();        
    }
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

        let elemTop = 0;
        let elemBottom = 0;
        if ( elem.length ) {            
            elemTop = $(elem).offset().top;
            elemBottom = elemTop + $(elem).height();
        }

        return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
    }else{
        return false;
    }
}

function getXY(el) {
  const rect = el.getBoundingClientRect();
  return {
    x: rect.left + window.scrollX,
    y: rect.top + window.scrollY
  };
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

function isLinkValid( url )
{
  
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
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

function resizeImageQuality(file, maxSizeKB, callback) {

    const isImage = file.type.indexOf('image') > -1
    const kb = file.size / 1024 
    if ( ! isImage || kb < maxSizeKB ) {
        callback( null )
        return;
    }

    // add canvas for redrawing in html body
    let canvasId = 'resizeCanvas'
    const body = getById("wrapper");            
    if (body){

        let e = getById(canvasId);
        if ( ! e ){

            let canvas = document.createElement('canvas');
            canvas.id = canvasId;   
            // canvas.style.display = "none";
            body.appendChild(canvas);
            console.log( 'canvas created')
        }
    }

    const reader = new FileReader();
    reader.onload = (event) => {
    
        const img = new Image();
        img.onload = () => {

            const canvas = document.getElementById( canvasId);
            const ctx = canvas.getContext('2d');

            // Calculate the new dimensions
            const width = img.width;
            const height = img.height;
            let resize_percent = .95;

            // Set the canvas dimensions and draw the image
            const resizeIt = () => {

                const w = width * resize_percent
                const h = height * resize_percent

                canvas.width = w
                canvas.height = h
                ctx.drawImage(img, 0, 0, w, h)

                // Convert the canvas to a Blob and pass it to the callback
                canvas.toBlob( (blob) => {

                    const kb = blob.size / 1024;
                    console.log( 'resized ', ' kb:', kb, ' max:', maxSizeKB , 'resize percent:', resize_percent * 100, "%")

                    if ( kb <= maxSizeKB || resize_percent <= 0 ){
                        callback(blob, resize_percent )
                    }else{
                        resize_percent -= 0.05
                        resize_percent = Math.floor(resize_percent * 100) / 100
                        resizeIt();
                    }

                }, file.type );
            }

            resizeIt()
        }

        img.src = event.target.result
    }

    reader.readAsDataURL(file);
}

/*
function resizeImageQuality(file, maxSizeKB, callback) {

    // const maxSize = maxSizeKB / 1024;  // convert to MB, setting is in KB

    const isImage = file.type.indexOf('image') > -1
    const kb = file.size / 1024 
    if ( ! isImage || kb < maxSizeKB ) {
        callback( null )
        return;
    }

    // add canvas for redrawing in html body
    let canvasId = 'resizeCanvas'
    const body = getById("wrapper");            
    // console.log('body', body)
    if (body){

        // sched request                
        let e = getById(canvasId);
        if ( ! e ){
            let canvas = document.createElement('canvas');
            canvas.id = canvasId;   
            // canvas.style.display = "none";
            body.appendChild(canvas);
            console.log( 'canvas created')
        }
    }

    let image = new Image();
    let reader = new FileReader();

    reader.onload = function(event) {

        image.onload = function() {

            var width = image.width;
            var height = image.height;

            var canvas = document.getElementById( canvasId );
            var context = canvas.getContext('2d');

            canvas.width = width;
            canvas.height = height;
            context.drawImage(image, 0, 0, width, height);

            const resizeIt = () => {                                                
                canvas.toBlob( (blob) => repeatOrDone(blob), file.type, quality );               
            }

            const repeatOrDone = (blob) => {

                const kb = blob.size / 1024;
                console.log( 'resized ', ' kb:', kb, ' max:', maxSizeKB , 'quality:', quality * 100, "%")

                if ( kb <= maxSizeKB || quality <= 0 ){
                    callback(blob, quality )
                }else{
                    quality -= 0.02
                    quality = Math.floor(quality * 100) / 100
                    resizeIt();
                }
            }

            var quality = 0.98
            resizeIt()

        };

        image.src = event.target.result;
    };

    reader.readAsDataURL(file);
}
*/
// --------------- auto complete ------------

function autocomplete(inputId, values, callBack = "") {


    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/

    const inp = getById(inputId);
    arr = values;

    inp.addEventListener("input", function(e) {

        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false;}

        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
            
            /*check if the item starts with the same letters as the text field value:*/
            if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
              /*create a DIV element for each matching element:*/
                b = document.createElement("DIV");
                /*make the matching letters bold:*/
                b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].substr(val.length);
                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function(e) {
                    

                    /*insert the value for the autocomplete text field:*/
                    const text =  this.getElementsByTagName("input")[0].value;
                    inp.value = text

                    if ( callBack ) callBack();
                    
                    /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
                    closeAllLists();
                });
                a.appendChild(b);
            }
        } 
    });

    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {

        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
            }
        }
    });

    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
    }

    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }

    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }

    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}
// ---------------- end - auto complete list  --------------


function GPS_Address( type, api_key, callBack ){

    if (navigator.geolocation) {    

        console.log("1");
        navigator.geolocation.getCurrentPosition(             
        (position) => {
            
            const lat = position.coords.latitude 
            const long = position.coords.longitude
            let url, addres_key

            // check if location is active in device
            if (api_key == "check_geolocation"){
                callBack(null, "success")
                return
            }

            if ( type == "nominatim"){
                url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${long}`

            }else if( type == "geocode"){
                url = `https://geocode.maps.co/reverse?lat=${lat}&lon=${long}&api_key=${api_key}`
            }

            xxhrGet(url, (res) => {
                callBack( res, false)
            })
            
        }, 
        (error) => {
            const url = new URL( window.location.href )

            let err = "Unknown error.";

            if (error.code == error.PERMISSION_DENIED){
                err = "Please accept the 'Location' permission prompt.<br>Press F5 to retry.<br> "
            
            }else if (error.code == error.POSITION_UNAVAILABLE){
                err = "Location information is unavailable."

            }else if (error.code == error.TIMEOUT ){
                err = "The request to get user location timed out."
            
            }else if(error.code == error.UNKNOWN_ERROR){
                err = "An unknown error occurred."                

            }else if( url.protocol == "http:" ){
                err = "Geolocation is not avaiable via HTTP protocol."
            }
            callBack( null, err);
        })

    } else { 
        callBack( null, "Geolocation is not supported by this browser.");
    }        
}




function xxhr(method, path, func, id_contentHolder = ""){
    
    //ex:  xxhr("GET", 'xhtml_response.php?q=myRecEntry&id='+ e.dataset.id, show);
    //    function show(ret){  ... to show return html }

    var xhr = new XMLHttpRequest();

    xhr.open(method, path, true);  

    xhr.onerror = function(){        
        if (func) func( '{"status":"Invalid Link '+ path +'"}' )
    }

    xhr.onload = function(){

        if (this.status == 200){        


            // put returned html to element id 
            if ( id_contentHolder ){
                const e = getById(id_contentHolder);
                if ( e ) e.innerHTML = this.responseText;
            }

            if (func) func(this.responseText);                     

        // }else if( this.status == 404){
        //  p.innerHTML = " not found";
        
        }
    };
    xhr.send();         
}

function xxhrGet(url, callBackFunc = "", id_contentHolder = ""){
   xxhr("GET", url, callBackFunc, id_contentHolder);
}

function xxhrPost(url, data=[], callBackFunc = ""){
    
    let xhr = new XMLHttpRequest();
    let formData = new FormData();

    for( const name in data ){      
        formData.append(name, data[name]);  
    }

    xhr.open("POST", url, true );
    xhr.send(formData);

    xhr.onerror = function(){        
        if (callBackFunc) callBackFunc( '{"status":"Invalid Link '+ url +'"}' )
    }

    if ( callBackFunc ){
        xhr.onload = function(){        
            let ret = this.responseText
            if (this.status == 200){

                if ( 'json' in data){
                    if ( data.json == 1){
                        ret = JSON.parse(ret)                        
                    }
                }                
                callBackFunc(ret);                                                     

            }
        };
    }
}

// console.log( "js_funcs.js - end");
//---------------functions-----------------