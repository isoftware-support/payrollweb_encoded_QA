
	
	//button event
	var btn = get("#btnOk");
	btn.addEventListener('click',  showRawLogs);

	var busy = new BusyGif;	

	function showRawLogs(){

		var fr = get('#dFrom').value;
		var to = get('#dTo').value;

		busy.show2();
		xxhr("GET", 'xhtml_response.php?q=myRawLogs&f='+ fr +'&t='+ to, show);

	}

	function show(ret){

		console.log(ret);
		busy.hide();

		get("#logs").innerHTML = ret;

		setSortColumnEvent();
		
		// columnt sort indicator
		setColumnIndicator();


	}

	// show logs on page load
	showRawLogs();

