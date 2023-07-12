/*

// ---------------------	
// #3263 self save component
// ---------------------	

	data-selfsave=1  			- to activate a element as selfsave
	data-t = <TYPENAME>  	- webtoolconfig typename value
	data-d = <descrition> - webtoolconfig description field value
	data-f = "c,v,v1,v2 or v3" - a field to update depend when element event triggered
	         lv
*/
	
	const setting_save_self = (e) =>{		

		// console.log( "activated", typeof e);
		// console.dir(e)
		// return;

		let el = null
		if ( e instanceof HTMLElement){
		 el = e
		} else {
			el = e.target
		}

		if ( "selfsave2" in el.dataset){
			const txt = el.dataset.selfsave2
			console.log('txt',txt)
			const a = JSON.parse(txt);
			console.log('a', a)
			return
		}

		// call function
		if ( "cf" in el.dataset){					
			const fn = new Function("param", el.dataset.cf + "(param)");
			fn(el);
		}

		const busy = new BusyGif();
		busy.show2();

		let url = root_uri + "/ajax_calls.php"
		const p = {func: 'UpdateSettings', t: 1}
		p.f = ""
		p.v = ""

		// to = table override
		if ( "to" in el.dataset ) p.t = el.dataset.to

		// fields = s : string, n: numeric
			const keyFields = {'t':'s', 'v':'n', 'v1':'n', 'v2':'n', 'v3':'s', 
				'c':'n', 'c2':'n', 'd':'s', 'n':'n', 's':'n', 'e':'n', 'i':'n'}
			const fields = Object.keys(keyFields)

			// const fields = ["t", "v", "v1", 'v2', 'v3', "c", "d", "n", "s", "e", "i"]

			fields.forEach( (field) =>{

				// const field = fields[i]						
				if ( field in el.dataset ){
					if ( p.f ) p.f += "|"
					if ( p.v ) p.v += "|"
					p.f += field
					p.v += el.dataset[ field ]
				}
			})

		// filter
		let xp = "";				
		if ( "xp" in el.dataset ){
			
			let xps = el.dataset.xp 		 // ex. "t:s,c" means t is string, c is not
			xps = xps.replaceAll(':s')   // remove :s or string type indicator
			xps = xps.split(",")         // to array
		
			xps.forEach( (field) => {

				let value = el.dataset[ field ]

				// check type
				if ( keyFields[ field ] == "s") value = wrapWith( value )
				
				if ( xp ) xp += " and "
				xp += field + "=" + value
			})

		}else{
			if ( "t" in el.dataset ) xp = `t='${el.dataset.t}'`
		}

		p.xp = xp

		// field to update		
		p.f += `|${el.dataset.f}`
		if ( el.type == "checkbox" ){
			p.v += "|"
			p.v += el.checked ? "1" : "0"
		
		}else if( el.type == "radio" || el.type == 'text' ||
			el.type == "datetime-local" || el.type == 'time' ||
			el.tagName == "TEXTAREA" || el.tagName == "SELECT" ||
			el.type == 'password' || el.type == 'date'
			){				

			p.v += `|${el.value}`

		}else if( el.type == "number"){
			let v = el.value
			if ( isEmpty(v) ) v = "0"
			p.v += `|${v}`

		}			
		p.x = 1

		// console.log( 'p', p)				
		// return

		if ( isEmpty(p.f) || isEmpty(p.v) ){

			busy.hide()
			return;
		}

    xxhrPost(url, p, (res)=>{
    	
    	// console.log('res', res)
    	const ret = JSON.parse(res)
    	console.log('ret', ret)

    	busy.hide()
    	delete busy
    	
			if ( "cb" in el.dataset){				
				const fn = new Function("param", el.dataset.cb + "(param)");
				fn(el);
			}

    });

	}

	// ----------------------------------------------
	// collect all self save elements and add events
	// ----------------------------------------------		
	{
		
		// console.log('self update unit')		

		const chks = getAll("[data-selfsave='1']")
		chks.forEach( (e) => {

			if ( e.type == 'number' || e.type == 'text' ||
				   e.type == "datetime-local" || e.type == "time" ||
				   e.tagName == "TEXTAREA" || e.tagName == "SELECT" ||
				   e.type == 'password' || e.type == 'date'
			){					

				e.onchange = setting_save_self;

			} else {
				// checkbox, radio
				e.onclick = setting_save_self;
			}
		})

	}

