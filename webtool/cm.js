function togglecheckbox()
{
	f = document.forms[0];
    for (i = 0; i < f.elements.length; i++) {
        if ((f.elements[i].name == "idno[]") && (f.elements[i].type == "checkbox")) {
			f.elements[i].checked = f.selectall.checked;	
        }
    }  	
}
function updateTeam()
{
    param = extractVals();
    if (param == "") return alert("Please select at least one record.");
    window.location = "cm.php?qid=01&en=" + escape(param) + "&t=" + document.forms[0].AssignTeam.value + getCurrent();
}
function validation1()
{
	f = document.forms[0];
	if(f.WelcomeNotice.value == ""){
		alert("Invalid Welcome Notice Format.");
		f.WelcomeNotice.focus();
        return false;
	}
}


function onSubmitForm(frm_name){

    f = document.forms[0];
    if(trim(f.WelcomeNotice.value) == ""){
        alert("Invalid Welcome Notice Format.");
        f.WelcomeNotice.focus();
        return false;
    }

    f = document.forms[0];
    if(trim(f.WelcomeNoticeTitle.value) == ""){
        alert("Invalid Welcome Notice Title.");
        f.WelcomeNoticeTitle.focus();
        return false;
    }




}

function trim(s){   
    return s.replace(/^\s+|\s+$/g, '');
} 

function extractVals()
{
    param = "";
    f = document.forms[0];
    for (i = 0; i < f.elements.length; i++) {
        if ((f.elements[i].name == "idno[]") && (f.elements[i].type == "checkbox")
            && (f.elements[i].checked)) {
            if (param != "") param = param + ",";
            param = param + f.elements[i].value;
        }
    }

    return param;
}
function getCurrent()
{
    pp = window.location.href;
    return "&prevpage=" + escape(pp);
}
function updateSupervisorTeam()
{
    param = extractVals();
    if (param == "") return alert("Please select at least one record.");
    window.location = "cm.php?qid=02&en=" + escape(param) + "&t=" + document.forms[0].AssignTeam.value + getCurrent();
}
function checkCalendar()
{
    param = extractVals();
    if (param == "") return alert("Please select at least one record.");
    window.location = "cm.php?qid=03&en=" + escape(param) + "&t=" + document.forms[0].AssignTeam.value + getCurrent();
}
function popitup(url) {
    newwindow=window.open(url, 'name', 'toolbar=0,location=0,directories=0,status=1,menubar=0,scrollbars=0,resizable=0,width=470,height=420');
    if (window.focus) {
      newwindow.focus()
    }
	newwindow.moveTo(screen.availWidth/2-(500/2),screen.availHeight/2-(300/2));
}
function popitup(url,w,h) {
	var left = (screen.width/2)-(w/2);
	var top = (screen.height/2)-(h/2);
    newwindow=window.open(url, 'name', 'toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=0,resizable=0,width='+w+', height='+h+', top='+top+', left='+left);
	/* if (window.focus) {
      newwindow.focus()
    }
	newwindow.moveTo(screen.availWidth/2-(500/2),screen.availHeight/2-(300/2));*/
}
function ValidateNewsEventSection()
{
	f = document.forms[0];
	radradiobuttonLocationValue = "";
    for (i = 0; i < f.elements.length; i++) {
        if ((f.elements[i].name == "idno") && (f.elements[i].type == "radio") && (f.elements[i].checked)) {
			radradiobuttonLocationValue = f.elements[i].value;
        }
    }  
	if(radradiobuttonLocationValue==""){
		alert('Please select a record!');
		return false;
	}else{
		return true;
	}    
}
function NewsEventSection()
{
	f = document.forms[0];
    for (i = 0; i < f.elements.length; i++) {
        if ((f.elements[i].name == "idno") && (f.elements[i].type == "radio") && (f.elements[i].checked)) {
			radradiobuttonLocationValue = f.elements[i].value;
        }
    }  
    return radradiobuttonLocationValue;
}
function ValidateCalendarSection()
{	
	f = document.forms[0];
	radradiobuttonLocationValue = "";
    for (i = 0; i < f.elements.length; i++) {
        if ((f.elements[i].name == "idno") && (f.elements[i].type == "radio") && (f.elements[i].checked)) {
			radradiobuttonLocationValue = f.elements[i].value;
        }
    }  	
	if(radradiobuttonLocationValue == ""){
		alert('Please select a record!');
		return false;
	}else{
		return true;	
	}    
}
function CalendarSection()
{	
	f = document.forms[0];
	radradiobuttonLocationValue = "";
    for (i = 0; i < f.elements.length; i++) {
        if ((f.elements[i].name == "idno") && (f.elements[i].type == "radio") && (f.elements[i].checked)) {
			radradiobuttonLocationValue = f.elements[i].value;
        }
    }  	
    return radradiobuttonLocationValue;
}
function verifyDeleteNewsEvent(n)
{
    if(n==""){
		alert("Please choose at least one record.");
		return false;
	}
    x = document.forms[0];
    x = confirm("Are you sure you want to delete this News and Event?");
    //alert("CMNo: "+escape(n)+" username: "+escape(m));
    if (!x) {
        return;
    }
    //alert("http://gelo-desktop/webinterface3/webtool/cm.php?qid=02&na="+escape(n));
    nn = formPost("cm.php?qid=02&na="+escape(n), "");
    //nn = formPost("http://gelo-desktop/webinterface3/webtool/cm.php?qid=02&na="+escape(n), "");
    window.location.reload();
    
    
    //window.location = "cm.php?qid=02&na="+escape(n);
    //window.location.reload();
}

function verifyDeleteNewsEvent2(n)
{
    if(n==""){
		alert("Please choose at least one record.");
		return false;
	}
    x = document.forms[0];
    x = confirm("Are you sure you want to delete this Links?");
  //  alert("CMNo: "+escape(n)+" username: "+escape(m));
    if (!x) {
        return;
    }
    //alert("http://gelo-desktop/webinterface3/webtool/cm.php?qid=02&na="+escape(n));
    nn = formPost("cm.php?qid=03&na="+escape(n), "");
    //nn = formPost("http://gelo-desktop/webinterface3/webtool/cm.php?qid=02&na="+escape(n), "");
    window.location.reload();
    
    
    //window.location = "cm.php?qid=02&na="+escape(n);
    //window.location.reload();
}

//function verifyDeleteRequest(n,m)
//{
//	if(n==""){
//		alert("Please choose at least one record.");
//		return false;
//	}	
//	x = document.forms[0];
//	x = confirm("Are you sure you want to delete this Request?");
//	if (!x) {
//		return;
//	}
//	window.location = "index.php?qid=07&ar="+escape(n)+"&uen="+escape(m);
//}
function verifyDeleteCalendar(n)
{
    x = document.forms[0];
    x = confirm("Are you sure you want to delete this calendar?");
    if (!x) {
        return;
    }
	nn = formPost("cm.php?qid=03&na="+escape(n), "");
    window.location.reload();
}


function delete_this(n,t){
	
  if(t==2){
  x = confirm("Are you sure you want to delete this news?");
  }else if(t==3){
  x = confirm("Are you sure you want to delete this link?");	
  }else if(t==7){
  x = confirm("Are you sure you want to delete this HR update?");	
  }
    if (!x) {
        return;	
	}	
		

window.location="del_this.php?no="+n+"&ty="+t+"";	
	
}



function formPost(url, postStr)
{
    retval = "";
   //
    xmlPossible = Sarissa.IS_ENABLED_XMLHTTP;
//    if (xmlPossible) {
//        alert("passes if");
//        xmlObj = new XMLHttpRequest();
//        xmlObj.open("POST", url, false);
//        xmlObj.setRequestHeader("Content-Length", postStr.length);
//        xmlObj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
//        xmlObj.send(postStr);
//        retval = xmlObj.responseText;
//    }
    /*else if(window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari*/
    if(xmlPossible){//code for IE7+, Firefox, Chrome, Opera, Safari
        xmlObj=new XMLHttpRequest();
        xmlObj.open("POST", url, false);
        xmlObj.setRequestHeader("Content-Length", postStr.length);
        xmlObj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xmlObj.send(postStr);
        retval = xmlObj.responseText;

    }else{// code for IE6, IE5
        xmlObj=new ActiveXObject("Microsoft.XMLHTTP");
        xmlObj.open("POST", url, false);
        xmlObj.setRequestHeader("Content-Length", postStr.length);
        xmlObj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xmlObj.send(postStr);
        retval = xmlObj.responseText;
    }
    
    return retval;
}
function IsInteger(sText){
	var ValidChars = "0123456789"; 			
	var IsNumber=true;
	var Char;
	
	IsNumber = !(sText == '' || sText == null);
	for (i = 0; i < sText.length && IsNumber == true; i++) { 
		Char = sText.charAt(i); 
		if (ValidChars.indexOf(Char) == -1) {
			IsNumber = false;
		}	
	}
	
	
	return IsNumber;
}
function validateBirthdayCelebFields(){	
	var field1Obj = document.getElementById("previous_birthdays");
	var field2Obj = document.getElementById("upcoming_birthdays");		
	if(!IsInteger(field1Obj.value)){
		alert('Input is not a valid integer!');
		field1Obj.focus();
		field1Obj.select();
		return false;
	}
	if(!IsInteger(field2Obj.value)){
		alert('Input is not a valid integer!');
		field2Obj.focus();
		field2Obj.select();
		return false;
	}
	return true;
}
function validateNewsEventsFields(){	
	var fieldObj = document.getElementById("displayed_news");	
	if(!IsInteger(fieldObj.value)){
		alert('Input is not a valid integer!');
		fieldObj.focus();
		fieldObj.select();
		return false;
	}
	return true;
}
function validateRequestCutoffFields(){	
	var fieldObj;
	fieldObj = document.getElementById("cutoff1_threshold");	
	if(!IsInteger(fieldObj.value)){
		alert('Input is not a valid integer!');
		fieldObj.focus();
		fieldObj.select();
		return false;
	}
	fieldObj = document.getElementById("cutoff2_threshold");	
	if(!IsInteger(fieldObj.value)){
		alert('Input is not a valid integer!');
		fieldObj.focus();
		fieldObj.select();
		return false;
	}
	return true;
}
