
if ( PAYROLLWEB === undefined){
	var PAYROLLWEB = {};
}

PAYROLLWEB.requests = {};
PAYROLLWEB.disapproved = {};
PAYROLLWEB.reimbursements = {};

$(document).ready(function(){

    //$('td #exclamation').css({'width':'16px','padding':'0 0 2px 0'});
    
    //$('tr.web_subpage:odd').css('background-color','#FFF9ED');    

    //selected from home
    $('tr.home-select').css('background-color','#E0EBEB');
        
    $('a.req_remarks, a.req_disapproved, a.tkt_remarks').click(function(){	
			return false;
		});    

		$('a.req_disapproved').click(		

			(e) =>{ 

				let id = e.target.id
				let apr = e.target.dataset.approval

				if ( isEmpty(id) ){
					id = e.target.parentElement.id
					apr = e.target.parentElement.dataset.approval
				}
				popRemarks( id, apr );
				
			}
		)

    $('a.req_remarks, a.tkt_remarks').hover(        

        function(e){  
        		
            var top = $(window).scrollTop();
            var id = $(this).attr('id');                             		        		
            var txt = PAYROLLWEB.requests[ "'"+id+"'" ];
            
            var divID = "div_"+id;

						//for webticket remarks            
            if (id.indexOf("tkt") > -1){
            	txt = $(this).data("remark");
            }            

            $('body').append(
            	`<div id='${divID}' class='tooltip'>
            		<p class='py-5'>Payroll Remarks:</p>
            		<p class='py-5'>${txt}</p> 
            	</div>`
            )                        
            
            var div = $('#'+ divID);
            $(div).css({'left':e.clientX - 120, 'top':e.clientY + 15 + top}).fadeIn('fast');
                                                 
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
    $('#approve_x, #clear_x, #disapproval_saved ').click(function(){   	
    	
        var num = $("input:checked[name^=apr]").length;
        if (num < 1){
        	return msgBox("Please select a request.")
        }

    	var xy = $('#clear_x').offset();    	
    	var width = parseInt($('#clear_x').css('width')) + 20;    	
    	
    	$('body').append("<div id='busygif'><img src=images/loading-gif.gif width=20px/></div>");  
    	$('div#busygif').css({'display':'block', 'position':'absolute', 'top':xy.top ,'left':xy.left + width});    	
		
    	// if (this.id != 'disapprove_x'){
    		$('img#floating_busygif').css('display','block');
    	// }
		

    });    

});


function selectIt(e){
	
	const id = e.dataset.id;	
	const radio = get("input[value='"+ id +"'][type='radio'");
	if (radio) radio.click();

}

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
		msgBox("Please select record to edit.");
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
		msgBox("Please select record to edit.");
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


function verifyDeleteRequest(q,n,m,r,l){

	// console.log(q,n,m,r,l);

	if(n==""){
		msgBox("Please select a record to delete.");
		return false;
	}		

	// console.log( q, n, m, r, l);
	msgBox("Are you sure you want to delete this Request?", 
		{ cancelButton: true, okCallBack: () => deleteRequest_confirmed(q,n,m,r,l) })

}

function deleteRequest_confirmed(q,n,m,r,l)
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
  
	if (l == "rq"){  // requests

		// create  a trigger before delete
		const p = [];
		p["func"] = "x";
		p["t"] = 5;
		p['d'] = -1;
		p['xp'] = `WebAuthorizationRequestNo = ${n}`; 
		p['el'] = 'AllowDeleteMyRequests';

		xxhrPost('ajax_calls.php', p, (res) =>{		

			// remove row
			const e = get(`input[type='radio'][value='${n}']`)
			if ( e ){
				const row = e.parentElement.parentElement;
				row.parentElement.removeChild(row);
				console.log(row)
			}

			// location.reload() 

		});    // request

		return;

		// reimbursements has own delete code in ReimbursementsDeletePostAction
		// tickets has own delelete code in requests_ticket_window.php - > clicked(this) js function

	}


	

	//window.location = "index.php?qid="+escape(q)+"&rn="+escape(r)+"&ar="+escape(n)+"&uen="+escape(m) + addpath;
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


function ShowDetails(rqType, isResizeWindow = false){	

	let n = rqType;
	

	let e = document.getElementById('row_ot_coa_ob');
	if (e) e.style.display = "none";		

	e = document.getElementById('row_leave');
	if (e) e.style.display = "none";

	e = document.getElementById('row_leave2');
	if (e) e.style.display = "none";	

	e = document.getElementById('row_sched'); 
	if (e) e.style.display = "none";	

	e = document.getElementById('row_sched2');
	if (e) e.style.display = "none";	

	if(n == 0 || n== 3 || n == 4 || n == 5){  //OT , COA, OB

		e = document.getElementById('row_ot_coa_ob');
		if (e) e.style.display = "";		

	}else if(n == 1){	//leave	

		e = document.getElementById('row_leave');
		if (e) e.style.display = "";

		e = document.getElementById('row_leave2');
		if (e) e.style.display = "";	

	}else if(n == 2){  //sched
		
		e = document.getElementById('row_sched');
		if (e) e.style.display = "";	

		e = document.getElementById('row_sched2');
		if (e) e.style.display = "";	

  }else if(n == 3){  //toil
		e = document.getElementById('row_toil');
		if (e) e.style.display = "";		
	}

	document.forms[0].request_shown_detail.value = n;


	//show highlight border
	var box = getById("req_type_back");
	var id = ["ot", "leave", "sc", "toil", "ob", "coa"];
	var sID = id[n];
	
	var w =  [ 75, 60, 120, 90, 115, 50];
    
	var xy = $( "#type_"+ sID ).offset();

	if ( box ){
		box.style.left = (xy.left - 5) + "px";
		box.style.width = w[n] + "px";
		box.style.top = (xy.top - 12 ) + "px";	
	}


	if ( isResizeWindow || n == 1 )
		 popWindowResize(); 

	// console.log( "details");	

}

// JavaScript Document