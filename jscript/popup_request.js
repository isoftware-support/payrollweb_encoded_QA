		
	

	//comput time	
	var dttmFrom = document.getElementById('dttmFrom');
	var dttmTo = document.getElementById('dttmTo');
  
	var dttmFrom_Leave = document.getElementById('dttmFrom_Leave');
	var dttmTo_Leave = document.getElementById('dttmTo_Leave');

	dttmTo.onchange = function(){ computeHours(); };

	if (dttmFrom_Leave) dttmFrom_Leave.onchange = () => {  loadLeaveDates(); computeHours(true); };
	if (dttmTo_Leave) dttmTo_Leave.onchange = () => { loadLeaveDates(); computeHours(true); };

	

	function computeHours( isLeaves = false ){
		
		let inDays = false;
		let txt = "Actual Total Hours: 0";		
	
		let _start_v = "", _end_v = "";

		if ( isLeaves == true ){

			txt = "Lenght: 0 day";
			_start_v = dttmFrom_Leave.value;
			_end_v =  dttmTo_Leave.value;

			inDays = document.getElementById("leave_inDays").checked;

		}else{
			_start_v = dttmFrom.value;
			_end_v =  dttmTo.value;
		}
		
		let hr = 0;
		if ( _start_v && _end_v ){

			var _start = new Date(_start_v);
			var _end = new Date( _end_v );

			var diff = ( _end - _start);	
			var sec = diff / 1000;
			var min = sec / 60;
			hr = min / 60;			
			
			if (inDays){			

				let days = parseInt( hr / 24) + 1;			
				if ( isLeaveBatchFiling ){

					let chks = getAll("input[name='leave_batch_dates']");
					if ( chks.length ){   // if leave batch dates are created
						chks = getAll("input[name='leave_batch_dates']:checked");
						days = chks.length;
					}
				}

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
		let spanId = "total_hours";
		if ( isLeaves == true )
			spanId = "leaves_hours";

		getById( spanId).textContent = txt;

	}

	function wholeDays(e){ 

		const inDays = e.checked;
	
    const eFrom = document.getElementById("dttmFrom_Leave");
		const eTo = document.getElementById("dttmTo_Leave");    	
   	
   	const dateFrom = eFrom.value,
   		dateTo = eTo.value;

   	let dateFormat = "Y-m-d";
    if( inDays ){			
    	eFrom.type = "date";
    	eTo.type = "date";
    }else{
    	eFrom.type = "datetime-local";
    	eTo.type = "datetime-local";
    	dateFormat += " 00:00:00";
    }		    		  	 

  	if ( dateFrom )
  	 	eFrom.value = DateFormat( dateFrom, dateFormat );
  	
  	if ( dateTo )
  		eTo.value = DateFormat( dateTo, dateFormat );

    loadLeaveDates();
	}		

	function loadLeaveDates()
	{

		if ( ! isLeaveBatchFiling ) return;

		const isInDays = getById('leave_inDays').checked;	
		let isDates = false;

		const div = getById('leave_batch_filing_box');
		let dtFrom = getById('dttmFrom_Leave').value;
		let dtTo = getById('dttmTo_Leave').value;

		let dates = [];

		if ( dtFrom && dtTo ){

      dtFrom = new Date( dtFrom );
      dtTo = new Date( dtTo );
      if ( dtFrom < dtTo ){
				
				isDates = true;

				const listedDates = getAll("input[name='leave_batch_dates']");

				let dates1 = [], dates2 = [];
				let cnt = 1, index = 1;
				while(true){

					const date = DateFormat( dtFrom, "d-M-Y D" );
					const day = DateFormat( dtFrom, "D");
					const v = DateFormat( dtFrom, "Y-m-d" );

					const id = `leave_dates_${cnt}`;

					let color = "";
					if ( day == "Sun" || day == "Sat")
						color = "c-red";

					if ( Array.isArray(holidays) ){
						if ( holidays.includes(v) )
							color = "c-red bold";
					}
					

					let checked = 'checked';
					if ( listedDates.length ){

						checked = "";
						for(let i = 0; i < listedDates.length; i++ ){
							const chk = listedDates[i];
							if ( chk.dataset.dt == v && chk.checked ){
								checked = "checked";
								break;
							}
						}

					}

					if ( cnt > listedDates.length )
						checked = "checked";

					// from posting eith error
					if ( posted_leave_batch_filing_dates.length ){

						checked = "";						
						const dates = posted_leave_batch_filing_dates.split(",");
						if ( Array.isArray(dates) ){
							if ( dates.includes(v) ){
								checked = "checked";
								// console.log(v);									
							}
						}
					}


					const chk = 
						`<input class='mr-3' type='checkbox' name='leave_batch_dates' id='${id}' ${checked} data-dt='${v}' ` +
						" onclick='computeHours(true)' />"+
						`<label class='fw-130 ${color}' for='${id}'>${date}</label>`;

					if (index == 1){
						dates1.push( chk );
					}else{
						dates2.push( chk );
					}

					if (dtFrom >= dtTo) break;
					dtFrom.setDate( dtFrom.getDate() + 1);

					cnt++;
					index++;
					if (index > 2) index = 1;

				} // end while

				dates1.forEach( (item, index) => {

					let  e = "<div class='aligner'>" + item;

					if ( index < dates2.length){
						e+= dates2[index];
					}
					e += "</div>";
					dates.push(e);					
				})								
			}
		}
		div.innerHTML = dates.join("");  // dates

		let show = isInDays && isDates ? "" : "none";

		div.style.display = show;

		if ( posted_leave_batch_filing_dates.length )
			computeHours(true);

		popWindowResize();

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
					e[i].removeAttribute('onclick');
					e[i].removeAttribute('id');
					e[i].removeAttribute('value');					
				}
			}
		}

		// alert( param.requestType);
		//total hours for ob, coa, ot
		if ( param.requestType == "4" || param.requestType == "5" || param.requestType == "0" || param.requestType == "3"){
			computeHours();
		}		

		// resize submit button
		if ( isApproverEdit ){
			 getById("submit").classList.remove("w-100");
			 getById("submit").classList.add("w-150");
		}

		loadLeaveDates();
	
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

				// ---------------
				// check batch date filing if inDays
				// ---------------
				let chks = getAll("input[name='leave_batch_dates']");
				if ( isLeaveBatchFiling && chks.length && inDays ){

					chks = getAll("input[name='leave_batch_dates']:checked");
					if (! chks.length){
						retval = false;
						msg = "Please select date.";
					}

					let v = [];
					chks.forEach( (e)=>{
						v.push( e.dataset.dt );
					})
					getById('leave_batch_filing_dates').value = v.join();
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

		// console.log( date, '- ', days, ' - ', hours, ' - ', mins );

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
