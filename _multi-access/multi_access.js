	
	
	const store_key = "multi_payrollweb"	

	if ( remote_payrollweb_access.active ) {
		
		init_multi_payrollweb_access();

	}else{

		// incase local storage is available for multiaccess
		if ( validate_local_data() ) load_multi_payrollweb_access();

	}


	function init_multi_payrollweb_access(){
	
		const links = remote_payrollweb_access.links;

		// load cached data if valid
		if ( validate_local_data() ){
			load_multi_payrollweb_access();
			return;
		}

		let cnt = 0;

		const p = { func: 'GCP', 
			token: remote_payrollweb_access.token, 
			eno: remote_payrollweb_access.eno,
			eid: remote_payrollweb_access.eid,			
			}

		for( const link of links){

			cnt ++;

			xxhrPost(link, p, res => {	

				const ret = JSON.parse( res);
				console.log( 'ret', ret);

				if ( ret.status == "success" ){
					
					let data = [];					

					const current = JSON.parse( localStorage.getItem( store_key ) );										
					if ( current !== null ) data = current;

					// check first before add
					let is_add = true;
					for( index in data ){

						const item = data[ index ]
						if ( item.owner == ret.data.owner ){
							is_add = false;
							break;
						}
					}
					if ( is_add )data.push( ret.data );					
					
					localStorage.setItem( store_key, JSON.stringify(data) );

				}

				if ( cnt == links.length  ){			
					load_multi_payrollweb_access()		
				}
			})

		}
	}


	function validate_local_data(){

		const local = JSON.parse( localStorage.getItem( store_key ) );

		if ( local == null ) return false;

		let is_valid = false;

		for(const item of local ){
			
			is_valid = true;			
			if ( item.user_token != remote_payrollweb_access.user_token ){
				localStorage.removeItem( store_key )
				is_valid = false;
				break
			}				
		}
		
		console.log( is_valid ? 'local loaded' : 'deleted local', local)

		return is_valid;
	}

	function load_multi_payrollweb_access(){

		const  data = JSON.parse( localStorage.getItem( store_key ) )
		if ( data !== null ){
		
			const items = [];
			for( const item of data){
				
				// skip current or main owner
				if ( item.owner == remote_payrollweb_access.owner ) continue;

				const params = { func: 'SC', p: `${item.userid}|${item.userpass}|${item.owner}` }

				const url = item.link + "?" + urlParams( params )

				const html = 
					`<a href="${url}" >
            <img class="icon-logo" src="${item.logo}" title="${item.name}" name='logo-icon' 
						>
          </a>`

				items.push( html )
			}

			if ( items.length ){
				const div = getById("multi-payrollweb-section")
				div.classList.remove("d-hide")	
				div.innerHTML = items.join(" ");
			}

		}
		
	}


	