
// disable login if registration is required

	if ( registration_required ){

		const div = getById("login_user");
		div.style.opacity = 0.5;
		div.disabled = true;

		const es = getAll( ".login" );		
		es.forEach((e)=>{

			e.disabled = true;
			//log( e.type);
			// button
			if ( e.type == "submit") e.type = "button";
			// link
			if( e.tagName == "A"){
				e.href="#";
				e.classList.add("disabled");
			}
			
		});
	}



function registerOnline(e){

	const busy = new BusyGif();

	busy.show2();

	const company = encodeURIComponent(e.dataset.name);
	const key = e.dataset.key;
	const o = e.dataset.p;
	const dm = e.dataset.dm;

	//live
	let url = reg_online_link + "?c="+ company + "&k="+ key + "&o="+o + "&dm="+ dm	
	//url = url.replace("http", "https");	

	url += "&t="+ Math.random();
	xxhrGet(url, (res)=>{

	  console.log('stat', res);
	  
	  let ret
	  try{
   		ret = JSON.parse(res);
   	}catch( e ){
   		console.error(e); 
   		ret = {'error': "Unable to connect to licensing service."}
   	}
		
   	// console.log( 'register', ret);

		const e = getById("license_status");
		if ( ret.error ){
			
			e.classList.add("c-red");
			e.innerHTML = ret.error.replace("<br>", "\n");
			
			busy.hide();

		}else{			

			let txt = "";
			url = PAYROLLWEB_URI + "/_licensing/licensing.php";		
			ret.func = 'reg_online';

			xxhrPost( url, ret, (res)=>{

				const reg = JSON.parse(res);

				console.log( reg)

				if ( reg.status == "success" ){

					e.classList.remove("c-red");					

					txt = "Registration Successful.\n\n"+ 
						"Edition: "+ ret.base_edition +"\n"+
						"Expiry: "+ ret.expiry;

					setTimeout( ()=>{
						const div = getById("reg_product");
						if ( div ){
							$(div).fadeOut(500);						
							location.reload();
						}
					}, 5000);

					// change button 
					const btn = getById("reg_btn");
					btn.value = "Done";
					$(btn).click(()=>{
						$("#reg_product").fadeOut(500);
						setTimeout( ()=> location.reload(), 500);
					});					

				}else{
					e.classList.add("c-red");
					txt = "Invalid Registration verification."
				}
				e.innerHTML = txt;

				busy.hide();
			});
		}
		
	});
	

}
	