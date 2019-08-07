
PAYROLLWEB = {};
PAYROLLWEB.requests = {};
PAYROLLWEB.disapproved = {};
PAYROLLWEB.reimbursements = {};



$(document).ready(function(){

    //$('td #exclamation').css({'width':'16px','padding':'0 0 2px 0'});
    
    $('tr.web_subpage:odd').css('background-color','#FFF9ED');

    //selected from home
    $('tr.home-select').css('background-color','#E0EBEB');
        
    $('a.req_remarks,.req_disapproved').click(function(){	
			return false;
	});    

    $('a.req_remarks').hover(                         
        function(e){  

            var top = $(window).scrollTop();
            var id = $(this).attr('id');                             		        		
            var txt = PAYROLLWEB.requests["'"+id+"'"];
            var divID = "div_"+id;

			//for webticket remarks            
            if (id.indexOf("tkt") > -1){
            	txt = $(this).data("remark");
            }            

            // alert(e.clientX - 40 + " - " + (e.clientY + 15 + top));
            $('body').append("<div id='"+divID+"' class='tooltip'>Payroll Remarks:<br><br>"+ txt + "</div>");                        
            
            var div = $('#'+ divID);
            $(div).css({'left':e.clientX - 40, 'top':e.clientY + 15 + top}).fadeIn('fast');
                                                 
        },
        function(){
            var reqID = 'div#div_' + $(this).attr('id');
            $(reqID).remove();
            
        }
    );       

    //blocked status    
    $('img[src=\'img/pending.gif\'').each(function(){
    	
    	
    	var id = $(this).parent().attr('id');
		var blnReplace = true;

    	if (id !== undefined){  //team requests
    		
    	    //get exact id - flagx_????
    	    id = id.substring(6,100);

    	    //find checkbox contains the id
    	    if ($("input[type='checkbox'][name*='"+id+"']:visible").length > 0) blnReplace = false;
	    	// $(this).attr('src','img/blocked.png');
	    	// }	    	
    	}

    	if (blnReplace){
    		id = $(this).attr('id');    		
    		if ( id !== 'legend' && id !== 'valid'){
    			$(this).attr('src','img/blocked.png');
    		}
    	}
    });                 


    //busy gif on approval buttons
    $('#approve_x, #clear_x, #disapproval_saved, #disapprove_x').click(function(){   	


        var num = $("input:checked[name^=apr]").length;
        if (num < 1){
            alert("Please select a request.");
            return;
        }

    	var xy = $('#clear_x').offset();    	
    	var width = parseInt($('#clear_x').css('width')) + 20;    	
    	
    	$('body').append("<div id='busygif'><img src=images/loading-gif.gif width=20px/></div>");  
    	$('div#busygif').css({'display':'block', 'position':'absolute', 'top':xy.top ,'left':xy.left + width});    	
		
    	if (this.id != 'disapprove_x'){
    		$('img#floating_busygif').css('display','block');
    	}
		

    });    

});



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
	}
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

function popitup(url, w, h, r) {

	var left = (screen.width/2)-(w/2);
	var top = (screen.height/2)-(h/2) - 20;
	
	//record or id
	if(r==""){
		alert("Please choose at least one record.");
		return false;
	}	
	
  newwindow=window.open(url, 'name', 'toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=1,resizable=1, top='+top+', left='+left+', width='+w+', height='+h);
	newwindow.focus();
}



function popitup_request(url,ar,w,h) {
	
	
	var left = (screen.width/2)-(w/2);
	var top = (screen.height/2)-(h/2);
	var f = document.forms[0];
	if(ar==""){
		alert("Please choose at least one record.");
		return false;
	}	
	
	newwindow=window.open(url, 'name', 'toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=1,resizable=1,width='+w+', height='+h+', top='+top+', left='+left);

newwindow.focus();	
	
	
   /* if (window.focus) {
        newwindow.focus()
    }
	newwindow.moveTo(screen.availWidth/2-(500/2),screen.availHeight/2-(300/2));    */
}
function RequestNo()
{	
	var radradiobuttonLocationValue = "";
	var f = document.forms[0];
    for (i = 0; i < f.elements.length; i++) {		
        if ((f.elements[i].name == "req_no") && (f.elements[i].type == "radio") && (f.elements[i].checked)) {
			radradiobuttonLocationValue = f.elements[i].value;
        }
    }  
    return radradiobuttonLocationValue;
}
function CalendarSection()
{
	f = document.forms[0];
    for (i = 0; i < f.elements.length; i++) {
        if ((f.elements[i].name == "idno") && (f.elements[i].type == "radio") && (f.elements[i].checked)) {
			radradiobuttonLocationValue = f.elements[i].value;
        }
    }  
    return radradiobuttonLocationValue;
}
function verifyDeleteRequest(q,n,m,r,l)
{
	
	
	if(q=="07"){ //webauthorization request only
		
    	var pathArray = r.split('&');
	
	
		if(pathArray[2]){
			
			addpath = "&" + pathArray[2];
		}else{
			
			addpath = "";
		}
	
	}else{
		
		var addpath = "";
	}
    
	
	if(n==""){
		alert("Please choose at least one record.");
		return false;
	}	

	x = document.forms[0];
	x = confirm("Are you sure you want to delete this Request?");
	if (!x) {
		return;
	}
	
			
	// if (q == "07b" || q == '07c'){
	
	// 	$.post('ajax_calls.php', {func:'delReim', q:q, no:n},
	// 	function(data){
	// 		// alert(data);
	// 	});		
	// 	alert("Reimbursement record deleted.");
	// }
	

	//window.location = "index.php?qid="+escape(q)+"&rn="+escape(r)+"&ar="+escape(n)+"&uen="+escape(m) + addpath;
     //alert(n);
	 document.getElementById('hidden_rn').value = r;
	 document.getElementById('hidden_ar').value = n;
	 document.getElementById('hidden_uen').value = m;
	 document.getElementById('hidden_filr').value = addpath;
	 document.getElementById('hidden_locr').value = l;
	 document.getElementById('button_sub2').click();	 
	 
	 
	 
	 
	//window.location.replace('index.php?qid=07&rq=&rp=0');	
	//window.location=document.referrer;
}
function verifyDeleteCalendar(n)
{
	 
		x = document.forms[0];
		x = confirm("Are you sure you want to delete this calendar?");
		if (!x) {
			return;
		}
		nn = formPost("cm.php?qid=03&na="+escape(n), "");
		//window.location.reload();
		window.location=document.referrer;
	
}

function formPost(url, postStr)
{
    retval = "";
    xmlPossible = Sarissa.IS_ENABLED_XMLHTTP;
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


function LeaveFilingMode(n){	

	var duration =	document.getElementById('leaves_duration');
	var shift = document.getElementById('leaves_shift');
	var selective = document.getElementById('leaves_selective');

	if( duration ) duration.style.display='none';
	if( shift ) shift.style.display='none';
	if( selective ) selective.style.display='none';

	if(n == 0){ //duration mode
		duration.style.display='';
		
	}else if(n == 1){	//shift mode
		shift.style.display='';
		
	}else if( n == 2){	//selective mode
		selective.style.display='';
	}	
	
}


function ShowDetails(n){	

	document.getElementById('row_ot_coa_ob').style.display = "none";		
	document.getElementById('row_leave').style.display = "none";
	document.getElementById('row_leave2').style.display = "none";	
	document.getElementById('row_sched').style.display = "none";	
	document.getElementById('row_sched2').style.display = "none";	

	if(n == 0 || n== 3 || n == 4 || n == 5){  //OT , COA, OB
		document.getElementById('row_ot_coa_ob').style.display = "";		

	}else if(n == 1){	//leave	
		document.getElementById('row_leave').style.display = "";
		document.getElementById('row_leave2').style.display = "";	

	}else if(n == 2){  //sched
		document.getElementById('row_sched').style.display = "";	
		document.getElementById('row_sched2').style.display = "";	

    }else if(n == 3){  //toil
		document.getElementById('row_toil').style.display = "";		
	}
	document.forms[0].request_shown_detail.value = n;

	

	//show highlight border
	var box = getById("req_type_back");
	var id = ["ot", "leave", "sc", "toil", "ob", "coa"];
	var sID = id[n];
	
	var w =  [ 75, 60, 120, 90, 115, 50];
    
	var xy = $( "#type_"+ sID ).offset();
	box.style.left = (xy.left - 5) + "px";
	box.style.width = w[n] + "px";
	box.style.top = (xy.top - 12 ) + "px";

	
}

// JavaScript Document