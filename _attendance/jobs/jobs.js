


var msgAttdNo = 0;            // for message purpose


// showAttendanceJobs();


// --------------- show job records ---------------------

function showAttendanceJobs()	
{

	// show all attendance with jobs breakdown records	
	let aNo = [], empNo, cutoff, pp;

	let links = getAll(".jobs-link-collapse");
	for( let i = 0; i < links.length; i++){

		let e = links[i];
		let attd = linkDataValue(e, false);		

		aNo.push( attd.no );
		empNo = attd.empNo;
		cutoff = attd.date;
		pp = attd.pp;		
	}
	
	xxhr("GET", "xhtml_response.php?q=GetJobs&no="+ aNo.join(",") +"&e="+ empNo +"&c="+ cutoff +"&p="+ pp + _session_vars, showJobsRecord);

}


function showJobsRecord( ret )
{
	
	busy.hide();
	
	let e, attd, tr;

	let jobs = JSON.parse(ret);
	let oldNo = -1;

	let attNoToDisableChanges = 0;

	let toRemoveSave = [];

	jobs.forEach(function( job, index ){		

		if ( oldNo !== job.no ){

			oldNo = job.no;

			e = getById("job_link_"+ job.no);	
			attd = linkDataValue(e);
			tr = e.parentElement.parentElement;   //get tr parent tag 
			createJobsSection( tr, attd );

			e.innerHTML = "<center>-</center>";

			attNoToDisableChanges = 0;
		}		

		//add job row
		newJobRow(attd.no, attd.hours, false);

		if ( ! isTeamMode && job.stat == "1" ){
			attNoToDisableChanges = attd.no;
			toRemoveSave.push( attd.no);
		}

		//apply data values
		//job code
		let el = get("select[data-no='jobcode_"+ attd.no +"']");
		el.value = job.job;
		el.dataset.no = 'done';

		//sub code
		el = get("input[data-no='subcode_"+ attd.no +"']");
		el.value = job.sub;
		el.dataset.no = 'done';

		//hours
		el = get("input[data-no='hours_"+ attd.no +"']");
		el.value = parseFloat(job.hours);
		el.dataset.no = 'done';		

		//approval
		el = get("input[data-no='approval_"+ attd.no +"']");
		if ( el){
			el.checked = job.stat == "1" ? true : false;
			el.dataset.no = 'done';
			if ( ! isTeamMode ) el.disabled = true;
		}


	});


	// remove new and save link if approved - on employee side only
	toRemoveSave.forEach( function(no){

		el = get("#save_"+ no);
		if (el) el.parentNode.removeChild(el);	

		// remove Remove item link
		while(true)	{
			el = get("#remove_"+ no);
			if ( el ){
				el.parentNode.removeChild(el);
			}else{
				break;
			}
		}
	});

	
}

// --------------- ---- ---------------------

function createJobEntry(e){

		//change tag text
	var isHide = false;
	if (e.text.trim() == "+"){
		e.innerHTML = "<center>-</center>";
	}else{
		e.innerHTML = "<center>+</center>";
		isHide = true;
	}

	var attd = linkDataValue(e);

	// get attendance jobs row
	let el = getById("jobs_row_"+ attd.no);   //dynamically created row

	if ( isHide ){

		el.style.display='none';

	}else{		
		
		if ( el ){
			el.style.display='';

		}else{

			let tr = e.parentElement.parentElement;   // parent row

			createJobsSection( tr, attd );
			newJobRow(attd.no, attd.hours);
		}
	}	
}


function saveJobs(empNo, attdNo, maxHours, date, pp, isApproveJobs = false)
{
	
	msgAttdNo = attdNo;

	//check total hours
	let totalHours =  totalJobHours( attdNo );
	if ( totalHours > maxHours ){
		showMessage("Total job hours exceeds attendance total hours. Entry not saved.");
		return;
	}
	

	//items
	let jobCodes = getAll('#jobcode_'+ attdNo);
	let subCodes = getAll('#subcode_'+ attdNo);
	let hours = getAll('#hours_'+ attdNo);
	
	let approvals;;
	if ( isTeamMode ){

		if ( isApproveJobs ){		// put check to all checkbox
			getAll('#approval_'+ attdNo).forEach( function(chk){
				chk.checked = true;
			});
		}

		approvals = getAll('#approval_'+ attdNo);
	}

	let aTxt = [];
	for(let i = jobCodes.length-1; i >= 0; i--){
		let hour = parseFloat(hours[i].value);
		if ( hour > 0 ){

			let approval = 0;
			if ( isTeamMode ) approval = ( approvals[i].checked ? 1 : 0 );   // approval is always 0 if add/edit from employee side

			aTxt.push( 
					[ jobCodes[i].value, subCodes[i].value, hours[i].value, approval ].join("|") );
		}
	}

	// console.log( aTxt, aTxt.length );

	let ids = [empNo, date, pp, attdNo];

	//for message display
	msgAttdNo = attdNo;

  	busy.show2();
  	let url = "xhtml_response.php?q=SaveJobs&i="+ ids.join('~') +"&d="+ aTxt.join('~') + _session_vars + "&debug=1";  
  	xxhr("GET", url, function(res){
  		
  		busy.hide();

  		let ret = JSON.parse(res);
  		console.log(ret);

  		let msg = ret.msg;
  		if ( isApproveJobs ) msg = "Jobs successfuly saved and approved.";
  		showMessage( msg ); 
	});                    

}

function showMessage( msg ){

    busy.hide();
    let p = getById('msg_here_'+ msgAttdNo);
    p.style.display = '';
    p.innerHTML = msg;      

    setTimeout(function(){ 
    	p.style.display='none'; }, 5000);    
}


function newJobRow(attdNo, maxHours, isNew = true)
{

	msgAttdNo = attdNo;

	let hours = 0;
	if ( isNew ){
		hours = reminingHours(attdNo, maxHours);
		let msg = "";
		if ( hours == 0) msg = "Already reached maximum attendance hours.";
		if ( hours < 0 ) msg = "Total job hours already exceed the maximum attendance hours.";
		
		if ( hours <= 0 ){
			showMessage( msg );
			return;
		}
	}

	//job codes
	let jobs=[];	
	for(var i = 0; i < jobCodes.length; i++){
			jobs.push("<option value='"+ jobCodes[i] +"'>"+ jobCodes[i] +"</option>");	
	}


	var t=[];
	t.push("<tr class='DataFieldValue DataRowHeight' >");

	let id = 'jobcode_'+ attdNo;
	t.push("<td class=''>" +
		"<select id='"+ id +"' class='DropDownList wp-90' data-no='"+ id +"'>"+ jobs.join("") +"<select></td>");

	id = "subcode_"+ attdNo;
	t.push("<td class='' align='center'><input class='EditBox wp-90 mb-2' data-no='"+ id +"' type='text' size='10' id='"+ id +"'></td>");

	id = "hours_"+ attdNo;
	t.push("<td class=''  align='center'><input class='EditBox wp-90' data-no='"+ id +"' type='number' id='"+ id +"' value='"+ hours +"'></td>");

	// approval
	id = "approval_"+ attdNo;
	let chk = "<input class='CheckBox' type='checkbox' data-no='"+ id +"' id='"+ id +"'>";
	if ( ! isTeamMode ) chk = '&nbsp;';	
	t.push("<td align='center'>"+ chk +"</td>");

	// remove link
	id = "id='remove_"+ attdNo +"'";
	t.push("<td colspan='' class='DataFieldValue ' ><a "+ id +" class='DataFieldValueLink' href='#' onclick='removeJob(this); return false;'>Remove</a></td>");

	t.push("</tr>");


	var table = getById('jobs_table_'+ attdNo);
	var row = table.insertRow(table.length);
	row.innerHTML = t.join("");

}

function reminingHours(attdNo, maxHours)
{

	let leftHours = maxHours - totalJobHours(attdNo);
	return leftHours;
}

function totalJobHours( attdNo )
{

	let aHours = getAll( '#hours_'+ attdNo );
	let totalHours = 0;
	for(let i = 0; i < aHours.length; i++){		
		
		let hours = parseFloat( aHours[i].value );
		if ( isNaN(hours) ) hours = 0;
		totalHours += hours ;
	}
	return totalHours;

}


function removeJob(e)
{
	
	let tr = e.parentElement.parentElement;
	let table = tr.parentElement;
	table.removeChild(tr);

}

function createJobsSection( tr, attd )
{

		let table = tr.parentElement;
		let rowIndex = tr.rowIndex;
		let id;

		let approvalTitle = "Approval";
		if ( !isTeamMode ) approvalTitle = "&nbsp;";

		var a = [];
		a.push("<td class='jobs-bc ContentTextNormal' colspan='100'>");		
		a.push("<div class='jobs-bc jobs-row'>");		
		a.push("<table id='jobs_table_"+ attd.no +"' class='DataFieldValue' width='400px'> ");		
		a.push( "<tr class='ContentTableHeading '>" +
				"<th class='py-2'>Job Code</th>" +
				"<th >Sub Code</th>" +
				"<th >Hours</th>" +
				"<th >"+ approvalTitle +"</th>" +
				"<th >&nbsp;</th>" +
				"</tr>"
				);
		a.push("<col width='25%'><col width='20%'><col width='15%'><col width='15%'><col width='25%'>");
		a.push("</table>");

		id = " id='save_"+ attd.no +"' ";
		a.push("<div "+ id +">")
		a.push("<br>");	
		a.push("<a href='#' class='DataFieldValueLink' onclick='newJobRow("+ attd.no +", "+ attd.hours +"); return false;'>New Job</a>");
		a.push("<a href='#' class='DataFieldValueLink px-10' onclick='saveJobs("+ attd.all +"); return false;'>Save Jobs</a>");

		if ( isTeamMode ){			
			a.push("<a href='#' class='DataFieldValueLink' onclick='saveJobs("+ attd.all +", true); return false;'>Approve Jobs</a>");
		} 
		a.push("</div>")
		a.push("<p class='jobs-message' id='msg_here_"+ attd.no +"'></>")
		a.push("</div>");
		a.push("</td>");
	
		var row =  table.insertRow( rowIndex + 1);
		row.id = "jobs_row_"+ attd.no;
		row.innerHTML = a.join("");
}


function linkDataValue(e, isQuoteDate = true)
{

	var a = e.dataset.attd.split("_");
	if ( isQuoteDate ) a[3] = '"'+ a[3] +'"';  //date as string
	var attd = { empNo:a[0], no:a[1], hours:a[2], date:a[3], pp:a[4], all:a.join(",") };
	return attd;

}
