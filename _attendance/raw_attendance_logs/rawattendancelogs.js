
	
	//button event
	var btn = get("#btnOk");
	btn.addEventListener('click',  showRawLogs);

	var busy = new BusyGif;	

	function showRawLogs(){

		let fr = get('#dFrom').value,
			  to = get('#dTo').value,
			  member = get('#team_emps');

	  let memNo = -1;	  
	  if ( member ) memNo = member.value;

		busy.show2();
		xxhr("GET", 'xhtml_response.php?q=myRawLogs&f='+ fr +'&t='+ to +'&m='+ memNo + _session_vars, show);

	}

	function show(ret){

		// console.log(ret);
		busy.hide();

		get("#logs").innerHTML = ret;

		setSortColumnEvent();
		
		// columnt sort indicator
		setColumnIndicator();


	}

	// show logs on page load
	showRawLogs();

