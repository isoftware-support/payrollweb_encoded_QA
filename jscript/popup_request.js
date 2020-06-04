		
	

	//comput time	
	var dttmFrom = document.getElementById('dttmFrom');
	var dttmTo = document.getElementById('dttmTo');
  
	var dttmFrom_Leave = document.getElementById('dttmFrom_Leave');
	var dttmTo_Leave = document.getElementById('dttmTo_Leave');

	dttmTo.onchange = function(){ computeHours(); };
	if (dttmFrom_Leave) dttmFrom_Leave.onchange = function(){ computeHours(true); };
	if (dttmTo_Leave) dttmTo_Leave.onchange = function(){ computeHours(true); };

	

	function computeHours( isLeaves = false ){
		
		var inDays = false;
		var txt = "Actual Total Hours: 0";		

		console.log( 'here');
		console.log("indays="+ inDays);
		
		if ( isLeaves == true ){

			txt = "Lenght: 0 day";
			var _start_v = dttmFrom_Leave.value;
			var _end_v =  dttmTo_Leave.value;

			inDays = document.getElementById("leave_inDays").checked;

		}else{
			var _start_v = dttmFrom.value;
			var _end_v =  dttmTo.value;
		}
		
		var hr = 0;
		if ( _start_v && _end_v ){
			var _start = new Date(_start_v);
			var _end = new Date( _end_v );

			var diff = ( _end - _start);	
			var sec = diff / 1000;
			var min = sec / 60;
			hr = min / 60;			

			
			if (inDays){			
				var days = parseInt(hr / 24) + 1;
				txt = "Length: " + days + " day";
				if (days > 1) txt = txt + "s";

				if ( isLeaves ) document.getElementById('leave_days').value = days;

			}else{
				if (hr >= 1){
					txt = "Actual Total Hours: " + hr.toFixed(2).toString();
				}else if( min >= 1 ){
					txt = "Actual Total Mins: " + min.toFixed(0).toString();
				}else{
					txt = "Actual Total Seconds:" + sec.toFixed(0).toString();
				}

				if ( isLeaves ) document.getElementById('leave_hours').value = hr.toFixed(2).toString();				
			}
			
		}
			
		//ot hours regardless of type selected
		getById('ot_hours').value = hr;
		if ( isLeaves == true ){
			var span = document.getElementById('leaves_hours');
		}else{
			var span = document.getElementById('total_hours');
		}
		span.textContent = txt;

	}

	function wholeDays(e){ 


		var inDays = e.checked;
		
    	var dttmFrom_Leave = document.getElementById("dttmFrom_Leave");
    	var dttmTo_Leave = document.getElementById("dttmTo_Leave");    	

	    if( inDays ){			
	    	dttmFrom_Leave.type = "date";
	    	dttmTo_Leave.type = "date";

	    }else{
	    	dttmFrom_Leave.type = "datetime-local";
	    	dttmTo_Leave.type = "datetime-local";
	    }		    		  	 
	}		
	  
	//coa ot ob date to suggestion
	document.getElementById('dttmFrom').onchange = function(){

		var dttmTo = document.getElementById('dttmTo');
		var option = document.querySelector("input[name='request_type']:checked");

		
		let bln = false;
		if ( option ){
			if ( option.value === "0" || option.value === "3") bln = true; //suggest in OT & TOIL only
		}

		if ( isApproverAdd ) bln = true;

		if ( bln ){   
			if ( ! dttmTo.value){  //empty
				dttmTo.value = this.value;
			}
		}

		computeHours();
	}

	//schedule change
	document.getElementById('dttmSched').onchange = function(){
		showSchedStatus(this);
	};



	function showSchedStatus(e){

		var xhttp = new XMLHttpRequest();
		document.getElementById('sched_from').value = "RESTD";  //empty default

		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
			       
		       	var res = xhttp.responseText;

		       	if ( res.indexOf('error') > -1 ){
		       		document.getElementById('sched_status').value = "Open Schedule";
		       		document.getElementById('sched_status_display').innerHTML = "Open Schedule";
		       		return;
		       	}

				var a = res.split('|');
				var html =  a[0];
				var kind   =  a[1];	
				var sched = a[2];
				if ( isEmpty( sched) ) sched = "RESTD";
								
				document.getElementById('sched_from').value = sched.replace(/[\n\r]+/g, '');

				if(kind == 'multiple'){										
					html = html + "&nbsp; Multiple Schedule";
				}
				document.getElementById('sched_status_display').innerHTML = html;	//display
				document.getElementById('sched_status').value = html;				//for post back

			}
		};

		var date = e.value;
		xhttp.open('GET','get_sched.php?dateid='+date+'&empx='+param.uen, true);
		xhttp.send();			

	};


	document.getElementById('body').onload = function(){
				
		//leave
		// leave_SL_view();

		//schedule
		if ( param.requestType == "2"){
			var dt = getById('dttmSched');
			showSchedStatus(dt);
		}

		

		//leave
		if ( param.requestType == "1"){
			// leave_SL_view();
			computeHours(true);
		}

		//disable request type if editing
		if ( param.submit_var === "editR"){
			var e = getByName('request_type');			
			for( var i = 0; i < e.length; i++ ){				
				if ( parseInt(e[i].value) != parseInt(param.requestType) ){
					e[i].disabled = true;
					// e[i].parentNode.removeChild(e[i]);
				}
			}
		}

		// alert( param.requestType);
		//total hours for ob, coa, ot
		if ( param.requestType == "4" || param.requestType == "5" || param.requestType == "0" || param.requestType == "3"){
			computeHours();
		}		


	}

	function validate_onSubmit(){	

		var retval = true;		
		var f = document.forms[0];

		var request_types;
		for (i = 0; i < f.elements.length; i++) {
	        if ((f.elements[i].name == "request_type") && 
				(f.elements[i].type == "radio") && (f.elements[i].checked)) {
				request_types = f.elements[i].value;
	        }
	    }  	  

    //hid request error
		var err = document.querySelector(".request-error");
		if ( err ) err.style.display = "none";

		var msg = "";

		var dttmFrom = document.getElementById('dttmFrom').value;
		var dttmTo = document.getElementById('dttmTo').value;

		var reason = getById("reason").value.trim();

		//request mode: 01 = Add, 02 = Edit, 03 = approver override		
		if (getById("isApproverEdit").value == "1" ){		//
			
			var comment = getById("override_comment").value.trim();
			if ( ! comment ){
				retval = false;
				msg = "Please input an override comment.";
			}

		}

		//submit var
		getById('submit').name = param.submit_var;	

		switch(request_types){						

		case '0':		// OT
		case '3': 		// TOIL

			if (! reason ){
				retval = false;
				msg = "Please input reason for this request.";
			}
			if (! dttmTo ){
				retval = false;
				msg = "Please input valid end date time.";
			}
			if (! dttmFrom ){
				retval = false;
				msg = "Please input valid start date time.";
			}
			if ( dttmTo && dttmFrom ){
				if ( Date.parse(dttmFrom) > Date.parse(dttmTo) ){
					retval = false;
					msg = "Please input valid date time.";	
				}
			}			

			break;

		case '4':  // OB
		case '5':  //coa		
		
				if (! reason ){
					retval = false;
					msg = "Please input reason for this request.";
				}
				if (! dttmTo && ! dttmFrom ){
					retval = false;
					msg = "Please input valid date time.";
				}
				if ( dttmTo && dttmFrom ){
					if ( Date.parse(dttmFrom) > Date.parse(dttmTo) ){
						retval = false;
						msg = "Please input valid date time.";	
					}
				}
			break;		

		case '1':     		//leave

			var leavetype = document.getElementById('leave_type').value;
			var mode = get("input[name='leave_mode']:checked").value;
			
			if (! reason ){
				retval = false;
				msg = "Please input reason for this leave request.";
			}
			
			if ( mode == "2" ){  //selective
				//selective hours mode				
				var dt = get('#dtSelective').value;
				if (! dt ){
					retval = false;
					msg = "Please input valid date.";
				}

				var hours = get('#selective_hours').value; 
				if ( hours == "-1"){
					retval = false;
					msg = "Please select leave hours value.";
				}

			}else if( mode == "0") {  //duration

				var dttmFrom_Leave = document.getElementById('dttmFrom_Leave').value;
				var dttmTo_Leave = document.getElementById('dttmTo_Leave').value;

				var inDays = document.getElementById('leave_inDays').checked;							
				var days = document.getElementById('leave_days').value;
				var isDuration = document.querySelector('input#duration').checked;

				if (! dttmTo_Leave ){
					retval = false;
					msg = "Please input valid end date.";
				}
				if (! dttmFrom_Leave ){
					retval = false;
					msg = "Please input valid start date.";
				}
				if ( ! retval && ! inDays) msg = msg + " time";

				if ( parseInt(days) <= 0 && inDays == 1 ){
					retval = false;
					msg = "Please select valid date.";								
				}

			}else if( mode == "1"){  //shift

				var dttm = document.getElementById('dttmShift').value;
				if ( !dttm ){
					retval = false;
					msg = "Please input valid date."
				}
			}

			if ( leavetype == "-1"){
				retval = false;
				msg = "Please select Leave Type.";				
			}
			break;

		case '2':   //sched change
			
			var start_date = document.getElementById('dttmSched').value;			
			var sched_from = document.getElementById('sched_from').value;
			var sched_to = document.getElementById('sched_to').value;

			if ( ! reason ){
				retval = false;
				msg = "Please input reason for this request.";
			}			
			if (! start_date ){
				retval = false;
				msg = "Please input valid start date.";
			}
			if ( sched_from == sched_to ){
				retval = false;
				msg = "From and To shift schedule are the same.";
			}
			break;						
		}
		
		if ( !retval) alert(msg);		
		return retval;
	}

	function isDateValid( sDate ){

		var date = new Date( sDate);
		var days =  date.getDate();
		var hours = date.getHours();
		var mins = date.getMinutes();

		var ret = true;
		if ( days == 0 || ( hours == 0 && mins == 0)) ret = false;

		console.log( date, '- ', days, ' - ', hours, ' - ', mins );

		return ret;
	}

	
	function trim_string(str){
		return str.replace(/^\s+|\s+$/g, '');
	}

	function leave_SL_view(){

		// var span = document.getElementById('med_attach');
		// var leavetype = document.getElementById('leave_type').value;
		// span.style.display = "none";
		// if ( leavetype === "22"){
		// 	span.style.display = "";
		// }else{
		// 	//reset attachments
		// 	document.getElementById('content_file').value='';
		// 	document.getElementById('med_file_txt').value='';
		// 	document.getElementById('cttype').value='';
		// }		

	}

	function CopyMe(oFileInput, sTargetID) {
	    var arrTemp = oFileInput.value.split('\\');
	    // alert(sTargetID);
	    document.getElementById(sTargetID).value = arrTemp[arrTemp.length - 1] ;
	}
