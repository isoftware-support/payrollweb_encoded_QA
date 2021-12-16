
window.addEventListener('scroll', function(e) {
	options_cancel( false );
});

function options_select(btn)
{

	//check selected emps
	if ( ! getAll(".chk-emp:checked").length ) return;

	let o = $(btn).offset();	
	let div = $('#select-options');

	div.css("left", o.left + 20);
	div.css("top", o.top - window.scrollY);
	$(div).show();

}

function select_emp(e)
{

	let id = "#" + e.dataset.eno;
	let checked = $(id).prop("checked")

	let tag = e.tagName;
	if (tag == "INPUT"){
		chk_clicked = true;
		return;		
	}else{   //tr click
		if ( chk_clicked ){
			chk_clicked = false;
			return;
		}
	}
	
	// alert(id);
	$(id).prop("checked", !checked );

}

function options_cancel(uncheckEmps = false)
{
	div = $('#select-options').hide();

	// uncheck all checkbox
	if ( uncheckEmps ) $("input").prop("checked", false );
}

function options_apply()
{
	
	let emps = getAll(".chk-emp:checked");
	if ( ! emps.length ) return;

	let options = getAll(".chk-options:checked");

	let isDelegate = false;
	let isAttdUpload = false;
	let isMobileAccess = false;
	
	var emp_options = "";
	var option_flags = "";

	options.forEach(function(opt){

		console.log(opt);
		if (opt.value == "Delegate"){
			isDelegate = true;
			emp_options = "Delegated";
			option_flags += "<i class='fa fa-black-tie fs-16 c-icon-dark fw-20 ta-c'></i>";
		}

		if (opt.value == "AttdUpload"){
			isAttdUpload = true;
			if ( emp_options ) emp_options += ",";
			emp_options += "AttdUpload";
			option_flags += "<i class='fa fa-upload fs-16 c-icon-dark fw-20 ta-c'></i>";
		}

		if (opt.value == "MobileAccess"){
			isMobileAccess = true;
			if ( emp_options ) emp_options += ",";
			emp_options += "MobileAccess";	
			option_flags += "<i class='fa fa-mobile fs-16 c-icon-dark fw-20 ta-c'></i>";
		}

	});

	emps.forEach(function(emp){

		let aprNo = emp.dataset.ano;
		let empNo = emp.dataset.eno;
		let teamNo = emp.dataset.tno;
		let aprRole = emp.dataset.alvl;
		
		// deligate
		var url = '_team/delegate.php?rq=' + aprRole + '&sv=' + aprNo +
			'&tm=' + teamNo + '&en=' + empNo + '&dg='+ (isDelegate ? 1 : 0) + _session_vars;		
		xxhr('GET', url);

		// apply options to member
		url = "_team/delegate.php?func=applyOptions&en="+ empNo + "&o="+ emp_options + _session_vars;
		xxhr('GET', url);		
		
		// apply in grid		
		let td = getById('td-'+ empNo);
		td.innerHTML = option_flags;

	});

	// hide options
	options_cancel();

}

function showAppliedOptions(res){

	// let data = JSON.parse(res);
	// let id = "td-" + data.empNo;
	// let opts = data.opts;

	// let td = getById(id);

	// var images = "";
	// if ( opts.search(""))
	// 	if ( )
	
	// td.innerHTML = opts;

	// // hide options
	// options_cancel();

}

function debug_msg(res){
	getById("msg").innerHTML = res;
}

function delegates(svno,tmno,empno,rq_lvl,deg_val){
				
	/*
	//alert(rq_typ);
	var xmlhttpxxx;

	if(window.XMLHttpRequest)
	  {
	  xmlhttpxxx=new XMLHttpRequest();
	  }
	else
	  {
	  xmlhttpxxx=new ActiveXObject('Microsoft.XMLHTTP');
	  }

	xmlhttpxxx.onreadystatechange=function()
	  {
	  if (xmlhttpxxx.readyState==4 && xmlhttpxxx.status==200)
	    {
	    //alert('a');
	    var ajaxDisplay = xmlhttpxxx.responseText;
	    //document.getElementById(element_name).innerHTML = res[i] ; // approve
		var component_id = "_" + tmno + "_" + empno;
		//alert(component_id);
		document.getElementById(component_id).innerHTML = ajaxDisplay;
		//alert(xmlhttpxxx.responseText);
		
	  }            
	}

	xmlhttpxxx.open('GET','delegate.php?rq='+rq_typ+'&sv='+svno+'&tm='+tmno+'&en='+empno+'&dg='+deg_val,true);
	xmlhttpxxx.send();		
	*/
}

function getEmpThis(emp){	
	document.getElementById('hidden1').value=emp;
	document.getElementById('button_sub').click();
}




function show_team_name(tm,en,m){
	
	busy.show2();
		
	xxhr("GET", "_team/team_profile_ajax.php?q="+tm+"&e="+en+"&m="+m, (res)=>{
		
	    getById("teamprofile_div").innerHTML= res;
	    busy.hide();

		//getById('ddteam_member').disabled=false;

		
	});
	
}


function show_team_name_dd(tm,en){ // for dropdown


	xxhrGet("includes/team_member_dropdown.php?q="+tm+"&e="+en +"&o=tp", (res)=>{

		getById("ddteam_member").innerHTML = res;

		
	});

}			

