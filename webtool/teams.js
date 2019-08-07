

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
    window.location = "teams.php?qid=01&en=" + escape(param) + "&t=" + document.forms[0].AssignTeam.value + getCurrent();
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
    window.location = "teams.php?qid=02&en=" + escape(param) + "&t=" + document.forms[0].AssignTeam.value + getCurrent();
}
function popitup(url) {
    newwindow=window.open(url, 'name', 'toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=0,resizable=0,width=430,height=200');
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


function GetSelectedTeam(){
	f = document.forms[0];
    for (i = 0; i < f.elements.length; i++) {
        if ((f.elements[i].name == "team_no") && (f.elements[i].type == "radio") && (f.elements[i].checked)) {
			radradiobuttonLocationValue = f.elements[i].value;
        }
    }  
    return radradiobuttonLocationValue;
}
function verifyDeleteTeam(n,t)
{
    x = document.forms[0];
    x = confirm("Are you sure you want to delete this Team?");
    if (!x) {
        return;
    }
	//alert(n);
	//alert("teams.inc.php?save=save&m=03&t="+escape(n)); 
	window.location="del_this.php?no="+n+"&ty="+t+"";	
	//nn = formPost("teams.inc.php?save=save&m=03&t="+escape(n), "");
   // window.location.reload();
}
function formPost(url, postStr)
{
    retval = "";
    xmlPossible = Sarissa.IS_ENABLED_XMLHTTP;
    alert(url);
    if (xmlPossible) {
        
        xmlObj = new XMLHttpRequest();
        xmlObj.open("POST", url, false);
        xmlObj.setRequestHeader("Content-Length", postStr.length);
        xmlObj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xmlObj.send(postStr);
        retval = xmlObj.responseText;
    }
    return retval;
}
function transferFrom(source, dest)
{
	
	//document.body.style.cursor="wait";
	//myVar=setTimeout(function(){document.body.style.cursor="default";},1000);
	
    var f, s, d, i, xx;
    f = document.forms[0];
    s = findControl(f, source);
    d = findControl(f, dest);	
	for (i = s.options.length-1; i >= 0; i--) {
	    if (s.options[i].selected) {
	        xx = new Option();
	        xx.value = s.options[i].value;
	        xx.text = s.options[i].text;
	        d.options[d.options.length] = xx;
	        s.options[i] = null;
	    }
	}	
     window.setTimeout(sortList(d),2);
	 window.setTimeout(sortList(s),2);
	
	
	// sort
	
	
}

function sortlistx(idx){
	
var lb = document.getElementById(idx);
arrTexts = new Array();

for(i=0; i<lb.length; i++) {
arrTexts[i] = lb.options[i].text;
}

arrTexts.sort();

for(i=0; i<lb.length; i++) {
lb.options[i].text = arrTexts[i];
lb.options[i].value = arrTexts[i];
}
}	
	
	
	



function listbox_moveacross4(sourceID, destID) {
	
    var src = document.getElementById(destID);
    var dest = document.getElementById(sourceID);
    //alert('a');  

    for(var count=0; count < src.options.length; count++) {
 
        if(src.options[count].selected == true) {

                var option = src.options[count];
 
                var newOption = document.createElement("option");
				//newOption.sort();
                newOption.value = option.value;
                newOption.text = option.text;
                newOption.selected = true;

                newOption.dataset.tl = option.dataset.tl;
                newOption.style.fontStyle = option.style.fontStyle;

                // newOption.dataset.tl = 0
                // if ( option.dataset.tl == 1){
                //     newOption.dataset.tl = 1;
                //     newOption.style.fontStyle = "italic";
                // }

                try {
                         dest.add(newOption, null); //Standard
                         src.remove(count, null);
                 }catch(error) {
                         dest.add(newOption); // IE only
                         src.remove(count);
                 }
                count--;
        }
    }
 
}


function listbox_moveacross3(sourceID, destID) { 
	
    var src = document.getElementById(destID);
    var dest = document.getElementById(sourceID);
    //alert('a');

    for(var count=0; count < src.options.length; count++) {
      
        if(src.options[count].selected == true) {


                var option = src.options[count]; 

                var newOption = document.createElement("option");
                newOption.value = option.value;
                newOption.text = option.text;
                newOption.selected = true;
                
                newOption.dataset.tl = option.dataset.tl;
                newOption.style.fontStyle = option.style.fontStyle;

                // newOption.style.fontStyle = "italic";
                try {
                         dest.add(newOption, null); //Standard
                         src.remove(count, null);
						 
                 }catch(error) {
                         dest.add(newOption); // IE only
                         src.remove(count);
                 }
                count--;
        }
    }

   
}

function sortlistx(idx){
	
	          var lb = document.getElementById(idx); 
                arrTexts = new Array(); 

                for(i=0; i<lb.length; i++) { 
                    arrTexts[i] = lb.options[i].text+':'+lb.options[i].value; 
                } 
                arrTexts.sort(); 
                for(i=0; i<lb.length; i++) { 
                    el = arrTexts[i].split(':'); 
                    lb.options[i].text = el[0]; 
                    lb.options[i].value = el[1]; 
                } 
          
	
	
}


function findControl(f, s)
{
    var i;
    for (i = 0; i < f.length; i++) {
        if (f[i].name == s) {
            return f[i];
        }
    }
    return null;
}

function sortList(d)
{   

    var i, j;
    for (i = 0; i < d.options.length - 1; i++) {
        for (j = i+1; j < d.options.length; j++) {
            if (d.options[i].text > d.options[j].text) {
                t1 = d.options[i].text;
                t2 = d.options[i].value;
                d.options[i].text = d.options[j].text;
                d.options[i].value = d.options[j].value;
                d.options[j].text = t1;
                d.options[j].value = t2;

            }
        }
    }
}
function submitTeamMembers()
{
    f = document.forms[0];
    z = findControl(f, 'supervisors[]');
    for (i = 0; i < z.options.length; i++) {
        z.options[i].selected = true;
    }
	z = findControl(f, 'members[]');
    for (i = 0; i < z.options.length; i++) {
        z.options[i].selected = true;
    }
    f.submit();
}
function SelectAll(FormName, ObjName, check){
	f = document.forms[FormName];
    for (i = 0; i < f.elements.length; i++) {
        if ((f.elements[i].name == ObjName) && (f.elements[i].type == "checkbox")) {
			f.elements[i].checked = check;            
        }
    }
}
function IsAllSelected(FormName, ObjName){
	var check = true;
	f = document.forms[FormName];
    for (i = 0; i < f.elements.length; i++) {
        if ((f.elements[i].name == ObjName) && (f.elements[i].type == "checkbox") && (f.elements[i].checked == false)) {
			check = false;            
			break;	
        }
    }
	f.select_all.checked = check; 
}
function updateEmployeesTeam(FormName, ObjName)
{
	f = document.forms[FormName];
    param = extractVals(FormName, ObjName);
    if (param == "") return alert("Please select at least one record.");
	f.selected_employees.value = param;
    f.submit();
}
function extractVals(FormName, ObjName)
{
    param = "";
    f = document.forms[FormName];
    for (i = 0; i < f.elements.length; i++) {
        if ((f.elements[i].name == ObjName) && (f.elements[i].type == "checkbox")
            && (f.elements[i].checked)) {
            if (param != "") param = param + ",";
            param = param + f.elements[i].value;
        }
    }
    return param;
}



