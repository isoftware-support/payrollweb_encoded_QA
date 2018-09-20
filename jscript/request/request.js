function request_extractVals(){
    param = "";
    f = document.forms[0];
    for (i = 0; i < f.elements.length; i++) {
        if ((f.elements[i].name == "id[]") && (f.elements[i].type == "checkbox")
            && (f.elements[i].checked)) {
            if (param != "") param = param + ",";
            param = param + f.elements[i].value;
        }
    }
    return param;
}
function request_UpdateUserStatus(basepage){
	param = request_extractVals();
	s = document.getElementById("update_status");	
	//if (param == "") return alert("Please select at least one record.");
	
	window.location = basepage + request_getCurrentFilter() + "&u=" + escape(param) + "&s=" + s.value + "&up=true";
}
function request_SelectAll(check){
	f = document.forms[0];
    for (i = 0; i < f.elements.length; i++) {
        if ((f.elements[i].name == "id[]") && (f.elements[i].type == "checkbox") && (f.elements[i].disabled==false)) {
			f.elements[i].checked = check;            
        }
    }
	request_AllSelected();
}
function request_AllSelected(){
	var check = true;
	f = document.forms[0];
    for (i = 0; i < f.elements.length; i++) {
        if ((f.elements[i].name == "id[]") && (f.elements[i].type == "checkbox") && (f.elements[i].checked == false && !f.elements[i].disabled)) {
			check = false;            
			break;	
        }
    }
	f.select_all.checked = check; 
}
function request_getCurrent()
{
    pp = window.location.href;
    return "?prevpage=" + escape(pp);
}
//function request_filter_popup(url, prevpage) {	

function request_filter_popup(url,prevpage,w,h,loc) {

	var left = (screen.width/2)-(w/2);
	var top = (screen.height/2)-(h/2);
	var f = document.forms[0];
		
	newwindow=window.open(url + '?prevpage=' + escape(prevpage) + request_getCurrentFilter(loc) + request_getCurrentState(loc), 'name', 'toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=0,resizable=0,width='+w+', height='+h+', top='+top+', left='+left);
	newwindow.moveTo(screen.availWidth/2-(500/2),screen.availHeight/2-(300/2)); 
	newwindow.focus();
}

function request_reloadParent(){	
	opener.location.reload(true);
	self.close();
}
function request_getCurrentFilter(loc){	
    
	f = document.forms[0];	
	
	if(loc==1){
	
		return '&fm=' + escape(f.fm.value) + '&fds=' + escape(f.fds.value) + '&fde=' + escape(f.fde.value) + 
			'&fts=' + escape(f.fts.value) + '&fte=' + escape(f.fte.value) + 
			'&fen=' + escape(f.fen.value) + '&fs=' + escape(f.fs.value) + '&frt=' + escape(f.frt.value) + '&frm=' + escape(f.frm.value    );	
	}else{

	    //alert('hi');
	    //return '&fm=' + escape(f.fm.value) + '&fds=' + escape(f.fds.value) + '&fde=' + escape(f.fde.value);	
		return '&fm=' + escape(f.fm.value) + '&fds=' + escape(f.fds.value) + '&fde=' + escape(f.fde.value) + 
			'&fts=' + escape(f.fts.value) + '&fte=' + escape(f.fte.value) + 
			'&fen=' + escape(f.fen.value) + '&fs=' + escape(f.fs.value) + '&frt=' + escape(f.frt.value) + '&frm=' + escape(f.frm.value    );					
	}		
}

function request_getCurrentState(loc){	
	f = document.forms[0];	
	return '&u=' + escape(f.u.value) + '&s=' + escape(f.s.value) + '&loc=' + loc ; 
}
