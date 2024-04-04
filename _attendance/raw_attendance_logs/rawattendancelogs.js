
	
	//button event
	var btn = get("#btnOk");
	btn.addEventListener('click',  showRawLogs);

	// select name event 
	const sel_member = getById('team_emps')
	if ( sel_member ) sel_member.onchange = showRawLogs


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

	function show(res){

		const ret = JSON.parse(res)

		console.log(ret);		
		
		busy.hide();

		get("#logs").innerHTML = ret.html;

		setSortColumnEvent();
		
		// columnt sort indicator
		setColumnIndicator();

	}

	// show logs on page load
	showRawLogs();

