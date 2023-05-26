


  
  let busy = new BusyGif();

// link click event
	let e_check = getById('liveupdate');

	e_check.onclick = (e) => {	 

	  e.preventDefault(); 
	  
	  const e_msg = getById('update-msg');
	  e_msg.innerHTML = ""

	  busy.show2();		

	  const p = { func: 'CKVersion' }
	  xxhrPost( PAYROLLWEB_URI + "/webtool/_liveupdate/liveupdate.php", p, (res)=>{
	  	
	  	console.log( 'check version', res)
	  	const ret = JSON.parse(res);
	  	console.log( 'Check version', ret);

	  	// hide check update
	  	if ( ret.status == "old" || ret.status == "updated")
	  		hideItem(e.target.id, false)

	  	let msg = "Current Phoenix PayrollWEB version is up to date."; 	
	  	if ( ret.status == "old"){
	  		
	  		msg = `An update is available. Phoenix PayrollWEB latest version is ${ret.version}.`;
	  		msg += `<br><br><a href="#" id="do-next" class="ta-c version_note">Download latest version ${ret.version}</a>`;

	  		classReplace('#update-msg', 'c-red', 'c-blue');	  		
	  		e_msg.innerHTML = msg;

		  	// next action
		  	getById('do-next').onclick = () => downloadUpdate(ret.version);

	  	}else if( ret.status == 'downloaded'){  // update file already available

	  		msg = `Latest PayrollWEB version ${ret.version} update is already available.`
	  		msg += `<br><br><a href="#" id="do-next" class="ta-c version_note">Apply downloaded update.</a>`;
	  		
	  		classReplace('#update-msg', 'c-red', 'c-blue');	  		
	  		e_msg.innerHTML = msg;

	  		hideItem( e.target.id, false);

		  	// next action
		  	getById('do-next').onclick = () => applyUpdate(ret.version);

		  }else if( ret.status == "updated"){
				
				e_msg.innerHTML = msg;

	  	}else{ 

	  		e_msg.innerHTML = 'Download link not available. Please contact the system administrator.';
	  		classReplace('#update-msg', 'c-blue', 'c-red');	  		
	  	} 		  	

	  	busy.hide();
	  })

	};

function downloadUpdate( version ){
	
	busy.show2();

	const e_msg = getById('update-msg');
	e_msg.innerHTML = `Downloading latest update ${version}...`;
	
  const p = { func: 'DLUpdate', 'v': version }
  xxhrPost( PAYROLLWEB_URI + "/webtool/_liveupdate/liveupdate.php", p, (res)=>{

  	console.log( 'download updaes', res); 	

  	const ret = JSON.parse(res);
  	console.log( 'download update', ret );
  	if ( ret.status == 'success'){
  		
  		msg = `Latest PayrollWEB version ${version} download successful.`
  		msg += `<br><br><a href="#" id="do-next" class="ta-c version_note">Apply downloaded update.</a>`;
  		
  		classReplace('#update-msg', 'c-red', 'c-blue');	  		

  	}else{
  		
  		msg = "Failed to download update. Please contact the system administrator.";
  		classReplace('#update-msg', 'c-blue', 'c-red');	  		

  	}

  	e_msg.innerHTML = msg;

  	const e_next = getById('do-next');
  	if ( e_next ) e_next.onclick = () => applyUpdate(version);

  	busy.hide();
  })

}

function applyUpdate( version ){
	
	busy.show2();

	const e_msg = getById('update-msg');
	e_msg.innerHTML = `<br>Extracting update files.`;

	const p = {func: 'ExtractUpdate', v: version}	
	xxhrPost( PAYROLLWEB_URI + "/webtool/_liveupdate/liveupdate.php", p, (res) => {

		console.log( 'extract', res);

		let ret = JSON.parse( res );
		e_msg.innerHTML += ' - done';

		console.log( 'extract', ret);

		if ( ret.status == 'success'){

			p.func = 'ApplyUpdate'
			xxhrPost(PAYROLLWEB_URI + "/webtool/_liveupdate/liveupdate.php", p, (res) => {

				console.log('ApplyUpdate', res);

				ret = JSON.parse( res )	
				console.log('ApplyUpdate', ret);

				e_msg.innerHTML += '<br>' + ret.msg;

				if ( ret.status == 'success'){					

					// run update script file
					xxhrPost( ret.url, {}, (res) => {
						
						ret = JSON.parse(res);
						console.log("run script", ret)

						// chech finish update											
						let msg = " - update script run done.";
						if ( ret.status == 'success'){
							msg += "<br><br>Update successful. PayrollWEB version is now "+ version + "<br>";

						}else{
							msg += `<br><br> 
								<p class='c-red'>Update failed. PayrollWEB files are currently in use.</p>`

						}
						e_msg.innerHTML += msg + "<br>Please press F5 to refresh the page."
						busy.hide();	
						
					})

				}else{
					busy.hide();	
				}				
				
			})				

		}else{
			busy.hide();
		}

	});

	


}