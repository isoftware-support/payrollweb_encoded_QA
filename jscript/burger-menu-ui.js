{
	const body = getById("body-content");
	if (body){

		// sched request 
		let div = document.createElement('div');
		div.id = "burger-menu-wrapper";	
		body.appendChild(div);
	}
}

const burger_menu = Vue.createApp({

template: `
		
		<div v-if="isLoggedIn" 
			id="burger-menu" class="ss-show bg-menu-sub c-white h4 py-10 px-5 fade-out">
		    
		    <!-- &raquo; &laquo; -->
		    <div>
		    	<p data-key='Home' class="burger-menu-item" @click="linkTo('Home')">Home</p>
		    	<div v-if=" allowed('MyAccount') " 
		    		id="my-account"
		    		class="burger-menu-item aligner" 		    		
		    		@click = "sub_menu" >   				    				    				    		
		    		<p >{{ title('MyAccount') }}</p> 
		    		<p id="my_account_arrow" class="fs-20 ml-20" v-html="my_account_arrow"></p>		    		
		    	</div>
				</div>

				<!-- My account menu -->
				<div id="my-account-menu" class="c-white h4 ml-30 d-hide" ref="my_account_menu">
					<p v-if="allowed('MyProfile')" class="burger-menu-item" @click="linkTo('MyProfile')"> {{ title('MyProfile')}}</p>
			    <p v-if="allowed('MyRecurring')" class="burger-menu-item" @click="linkTo('MyRecurring')" >{{title('MyRecurring') }}</p>
					<p v-if="allowed( 'MyRawLogs')" class="burger-menu-item" @click="linkTo('MyRawLogs')" >{{ title('MyRawLogs')}}</p>
			    <p v-if="allowed( 'MyAttendances' )" class="burger-menu-item" @click="linkTo('MyAttendances')">{{ title('MyAttendances') }}</p>
			    <p v-if="allowed( 'MyPayroll' )" class="burger-menu-item" @click="linkTo('MyPayroll')">{{ title( 'MyPayroll' ) }}</p>
			    <p v-if="allowed( 'MySchedules' )" class="burger-menu-item" @click="linkTo('MySchedules')">{{ title( 'MySchedules' ) }}</p>
					<div v-if="allowed( 'MyRequests' )" 
						id="my-requests"
						class="aligner burger-menu-item"
						@click="sub_menu">	
			    	<p >{{ title( 'MyRequests' ) }}</p>
			    	<div id="my_requests_arrow" class="fs-20 ml-20 animate__animated" v-html="my_requests_arrow"></div>
				  </div>				    

					<!-- My requests -->
					<div id="my-requests-menu" class="h4 c-white ml-20 d-hide" ref="my_requests_menu">
							<p v-if=" allowed('MySchedRequests') " class="burger-menu-item" @click="linkTo('MySchedRequests')">{{ title('MySchedRequests') }}</p>
					    <p v-if=" allowed('MyReimbRequests') " class="burger-menu-item" @click="linkTo('MyReimbRequests')">{{ title('MyReimbRequests') }}</p>
					    <p v-if=" allowed('MyTicketRequests') " class="burger-menu-item" @click="linkTo('MyTicketRequests')">{{ title('MyTicketRequests') }}</p>
					</div>

				</div>
				
				<!-- my team -->
				<div v-if=" allowed('MyTeam') "  
					id="my-team" class="burger-menu-item aligner"
					@click="sub_menu">
	    		<p>{{ title('MyTeam') }}</p>
	    		<p class="ml-20 fs-20" v-html="my_team_arrow"></p>		    		
		  	</div>

					<!-- My Team menu -->
					<div id="my-team-menu" class="h4 c-white d-hide" ref="my_team_menu">
						<div class="ml-30">
							<p v-if=" allowed('MyTeamProfile') " class="burger-menu-item" @click="linkTo('MyTeamProfile')">{{ title('MyTeamProfile') }}</p>
				 	    <p v-if=" allowed('MyTeamRawLogs') " class="burger-menu-item" @click="linkTo('MyTeamRawLogs')">{{ title('MyTeamRawLogs') }}</p>
					    <p v-if=" allowed('MyTeamAttendances') " class="burger-menu-item" @click="linkTo('MyTeamAttendances')">{{ title('MyTeamAttendances') }}</p>
					    <p v-if=" allowed('MyTeamPayroll') " class="burger-menu-item" @click="linkTo('MyTeamPayroll')">{{ title('MyTeamPayroll') }}</p>
					    <p v-if=" allowed('MyTeamLeaves') " class="burger-menu-item" @click="linkTo('MyTeamLeaves')">{{ title('MyTeamLeaves') }}</p>		
					    <p v-if=" allowed('MyTeamLeaveSchedules') " class="burger-menu-item" @click="linkTo('MyTeamLeaveSchedules')">{{ title('MyTeamLeaveSchedules') }}</p>		
					    <p v-if=" allowed('MyTeamSchedules') " class="burger-menu-item" @click="linkTo('MyTeamSchedules')">{{ title('MyTeamSchedules') }}</p>		
					    <div v-if=" allowed('MyTeamRequests')" 
					    	id="my-team-requests"
					    	class="aligner burger-menu-item"
					    	@click = "sub_menu">
					    		<p >{{ title('MyTeamRequests') }}</p>	
					    		<p class="fs-20 ml-20" v-html="my_team_requests_arrow"></p>
					  	</div>
				  	
							<!-- My Team Requests  -->
							<div id="my-team-requests-menu" class="h4 c-white ml-20 d-hide" ref="my_team_requests_menu">
									<p v-if=" allowed('MyTeamSchedRequests') " class="burger-menu-item" @click="linkTo('MyTeamSchedRequests')">{{ title('MyTeamSchedRequests') }}</p>
							    <p v-if=" allowed('MyTeamReimbRequests') " class="burger-menu-item" @click="linkTo('MyTeamReimbRequests')">{{ title('MyTeamReimbRequests') }}</p>
							    <p v-if=" allowed('MyTeamTicketRequests') " class="burger-menu-item" @click="linkTo('MyTeamTicketRequests')">{{ title('MyTeamTicketRequests') }}</p>						    
							</div>

				  	</div>
				  
					</div>				

				<div class="p-5 px-10" class="burger-menu-item" @click="linkTo('Logout')" >Logout</div>

		</div>

`,

data(){
	return{
		div_name: "burger-menu",
		div_id: "#burger-menu",
		isLoggedIn: false,
		isMobile: false,
		isShown: false,		
		menu_items: {},
		my_account_arrow: '&raquo;',
		my_requests_arrow: '&raquo;',
		my_team_arrow: '&raquo;',
		my_team_requests_arrow: '&raquo;',
	}
},

methods: {

	sub_menu(event){

		let id = event.target.id
		if ( isEmpty(id) ) id = event.target.parentElement.id

		classToggle( `#${id}-menu`, 'd-hide')
		classToggle( `#${id}-menu`, 'd-show')
		
		if ( id == "my-account"){			
			this.my_account_arrow = toggleValue( this.my_account_arrow, "&raquo;", "&laquo;")			
		}else if( id == "my-team"){
			this.my_team_arrow = toggleValue( this.my_team_arrow, "&raquo;", "&laquo;")
		}else if( id == "my-requests"){
			this.my_requests_arrow = toggleValue( this.my_requests_arrow, "&raquo;", "&laquo;")
		}else if( id == "my-team-requests"){
			this.my_team_requests_arrow = toggleValue( this.my_team_requests_arrow, "&raquo;", "&laquo;")
		}		

		// remember menu state
		let menu_status = {
			my_account: this.$refs.my_account_menu.classList.contains("d-show"),
			my_team: this.$refs.my_team_menu.classList.contains("d-show"),
			my_requests: this.$refs.my_requests_menu.classList.contains("d-show"),
			my_team_requests: this.$refs.my_team_requests_menu.classList.contains("d-show"),
		}
		localStorage.setItem('menu-status', JSON.stringify(menu_status) )			

	},

	linkTo( keyName ){

		if ( keyName == "Logout"){

			localStorage.removeItem("menu-status");
			
		}else{
		}

		const item = menu_items[ keyName ];
		const url = `${rootURI}/index.php?qid=${item.id}`
		location.href = url;

	},

	allowed( keyName){
		return menu_items[ keyName ].allowed
	},
	title( keyName){
		return menu_items[ keyName ].title
	}
	,
	toggleMenu(){

		classToggle("#burger-menu", "fade-in")
		classToggle("#burger-menu", "fade-out")
		
		const isVisible = getById("burger-menu").classList.contains("fade-in")

		const hideDim = ()=>{
			classToggle("#burger-menu", "fade-in")
			classToggle("#burger-menu", "fade-out")
			dimBack(false, 'dimback')
		}
						
		if ( isVisible){
			
			dimBack2( {dimIt: true, id: 'dimback', 
				opacity: 0.05, zIndex: 99,	hideCallback: hideDim
			})
			classAdd("#dimback", "ss-show")

		}

	}

},


mounted(){

	let e = getById("burger-menu")
	if ( e ) e.style.zIndex = 101
	
},

beforeMount(){
	
	this.isLoggedIn = isLoggedIn
	this.menu_items = menu_items
	

	let e = getById("burger-menu-icon")
	if ( e ){
		e.onclick = () => {			

			const menu_status = localStorage.getItem('menu-status') 
			if ( menu_status ){
				const status = JSON.parse(menu_status)	

				if ( status.my_account ){
					this.my_account_arrow = "&laquo;"
					classReplace( "#my-account-menu", 'd-hide', 'd-show')
				}

				if ( status.my_requests ){
					this.my_requests_arrow = "&laquo;"
					classReplace( "#my-requests-menu", 'd-hide', 'd-show')
				}
				if ( status.my_team){
					this.my_team_arrow = "&laquo;"
					classReplace( "#my-team-menu", 'd-hide', 'd-show')
				}
				if ( status.my_team_requests ){
					this.my_team_requests_arrow = "&laquo;"					
					classReplace( "#my-team-requests-menu", 'd-hide', 'd-show')
				}
			}
		
			this.toggleMenu()

		}
	}
	
},

}).mount("#burger-menu-wrapper");


// // window click
// window.addEventListener('click', function(e){   

// 	console.log('visible',isVisible)

// 	const menu = getById("burger-menu")
// 	const div = getById()
// 	if ( isVisible ){
// 		// console.log('visible',isVisible)
// 			// classToggle("#burger-menu", "fade-in")
// 			// classToggle("#burger-menu", "fade-out")
// 	}

// });
