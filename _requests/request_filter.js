
// create div section parent
let parentId = "request_filter"
let e = get("body")
let div = document.createElement('div')
div.id = parentId
div.classList.add("modal-box", "bg-white", "br-2", "w-400", "wmx-400", "p-10", "ContentTextNormal")
div.style.left =-500
e.appendChild(div)

var section = ''

const app = Vue.createApp({

	template:`

		<!-- <div id="filter-ui" class="modal-box bg-white br-2 w-400 wmx-400 p-10 ContentTextNormal" style="left:-500"> -->
			<fieldset class="p-20">
			<legend>Filter Options</legend>

				<div >
					<div class="aligner">
						<label class="flex-1">&nbsp;</label>						
						<label class="flex-1">From Date</label>						
						<label class="flex-1">To Date</label>						
					</div>
				</div>

				<div class="mb-2">
					<div class="aligner">
						<label class="flex-1">Date Requested:</label>						
						<div class="flex-1">
							<input class="editbox" type="date" v-model="date_req_start">
						</div>
						<div class="flex-1">
							<input class="editbox" type="date" v-model="date_req_end">
						</div>
					</div>
				</div>

				<div v-if="isRequest" class="mb-2">
					<div class="aligner">
						<label class="flex-1">Target Requested:</label>						
						<div class="flex-1">
							<input class="editbox" type="date" v-model="date_target_start">
						</div>
						<div class="flex-1">
							<input class="editbox" type="date" v-model="date_target_end">
						</div>
					</div>
				</div>

				<div v-if="CONSLDT.active" class="mb-2 py-5 bg-lightgrey br-2 my-5">
					<div class="aligner">
						<label class=" bold pl-5">Entity:</label>						
						<div class=" flex-grow">						
							<select class="DropDownList w-300 ml-10 " v-model="CONSLDT.db" @change='db_change'>
								<option value=""></option>
								<option class='fs-14 ' v-for="(db, index) in CONSLDT.dbs" key="index" :value="db.db">{{ db.name }}</option>
							</select>
						</div>
					</div>
				</div>

				<div class="mb-2">
					<div class="aligner">
						<label class="flex-1">Employee Name:</label>						
						<div class="flex-2 ">
							<input v-model="name" class="editbox wp-98" type="text" >
						</div>
					</div>
				</div>

				<div class="mb-2">
					<div class="aligner">
						<label class="flex-1">Status:</label>						
						<div class="flex-2 ">
							<select v-model="status" class="DropDownList wp-98" >

								<option value="-2" ></option>
								<option value="0" >Pending</option>
								<option v-if="! isTicket" value="4" >Pending (Outdated)</option>
								<option value="1" >Approved</option>
								<option value="-1" >Disapproved</option>
								<option value="2" >Processed</option>	
													
							</select>

						</div>
					</div>
				</div>

				<div v-if="isRequest" class="mb-2">
					<div class="aligner">
						<label class="flex-1">Request Type:</label>						
						<div class="flex-2 ">

							<select class="DropDownList wp-98" v-model="type">								
								<option v-for="type in this._types" key="type.no" :value="type.no" >{{ type.title }}</option>
							</select>
						</div>
					</div>
				</div>

				<div class="mb-2">
					<div class="aligner">
						<label class="flex-1">Team:</label>						
						<div class="flex-2 ">
							<select class="DropDownList wp-98" v-model="team">
								<option v-for="team in teams" key="team.no" :value="team.no">{{ team.name }}</option>
							</select>
						</div>
					</div>
				</div>

 			<center class="mt-20">
					<button class="button w-80" type="button" @click="applyFilter( $event)">Apply Filter</button>
					<button class="button mx-5 w-80" type="button" @click="applyFilter($event, false)">Clear Filter</button>
					<button class="button w-60" type="button" @click="hideFilter">Cancel</button>
			</center>

			</fieldset>

			
		<!-- </div> -->
	`,

	data(){
		return{
			isReim: false,
			isRequest: false,
			isTicket: false,
			date_req_start: null,
			date_req_end: null,
			date_target_start: null,
			date_target_end: null,			
			name: '',
			status: -2,
			type: -1,
			team: -1,
			teams: [],
			CONSLDT: { dbs: [], active: false, db: '', err_msg: ''},
		}
	},

	// variables
	_types: [],
	_section: '',

	methods:{
		
		init(){
			Object.assign( this.data, this.$options.data() )
		},

		hideFilter(){

			hideItem( parentId)
			dimBack(false, 'dimback')
		},

		applyFilter( event, isApplyFilter = true){

			let p = [ `fr=${this._section}`, 'x=1'];				

			if ( isApplyFilter ){

				p.push(`fm=true`) 

				if ( parseInt(this.date_req_start ))		p.push( `fds=${this.date_req_start}`)
				if ( parseInt(this.date_req_end ))			p.push( `fde=${this.date_req_end}`)
				if ( parseInt(this.date_target_start )) p.push( `fts=${this.date_target_start}`)
				if ( parseInt(this.date_target_end )) 	p.push( `fte=${this.date_target_end}`)		

				if ( this.name )							p.push( `fen=${encodeURI(this.name)}`)
				if ( parseInt(this.status) > -2 )	p.push( 'fs=' + this.status )
				if ( parseInt(this.type) > -1 ) 	p.push( 'frt=' + this.type )
				if ( parseInt(this.team) > -1 ) 	p.push( 'frm=' + this.team)
				if ( this.CONSLDT.db) p.push( 'db=' + this.CONSLDT.db)

				if ( this.CONSLDT.active && this.CONSLDT.err_msg.length ){
					return msgBox( this.CONSLDT.err_msg )
				}						
			}

			const params = p.join('&')
			// console.log( params);

			let path = root_uri + "/xhtml_response.php?q=SaveFilter&"+ params + _session_vars;						
			xxhrGet(path, (res)=>{

				 // console.log( 'res',res)				
				// const ret = JSON.parse(res)
				// console.log(ret);
								
				document.location.reload();


			});
		},

		db_change(){

			this.load_MyTeams();

		},

		load_MyTeams(){

			// console.log('3', this.CONSLDT, 'xx');

			const p = {func: 'myTeams', db: this.CONSLDT.db }
			xxhrPost( root_uri + "/ajax_calls.php", p, (res) => {
				
				const ret = JSON.parse(res);
				// console.log( ret);

				this.CONSLDT.err_msg = "";  // default

				if ( ret.err_msg ){

					msgBox( ret.err_msg);

					this.teams = [];
					this.team = -1;

					this.CONSLDT.err_msg = ret.err_msg

				}else{

					let teams = Object.values(ret.data) 

					teams = [ {'no': '-1', 'name': '', 'desc': ''}, ...teams ]
					this.teams = teams;
				}

			})

		},

		load_RememberedUserFilter(){

			p = {func: 'GetRec', t:17, f:'*', xp:`f10 ='${uid}' and section = '${this._section}'`}
			xxhrPost( root_uri + "/ajax_calls.php", p, (res) => {

				const ret = JSON.parse(res)				

				if ( Object.keys(ret).length){

					this.name = ret.name
					this.status = ret.status
					this.type = ret.type
					this.CONSLDT.db = ret.db;
					this.team = ret.team

					if ( parseInt(ret.requestFrom) ) 		this.date_req_start = ret.requestFrom
					if ( parseInt(ret.requestTo ))  		this.date_req_end = ret.requestTo
					if ( parseInt(ret.targetFrom ))	  	this.date_target_start = ret.targetFrom
					if ( parseInt(ret.targetTo)) 				this.date_target_end = ret.targetTo

					// load my teams
					this.load_MyTeams();

				}
			})

		},

	},

	mounted(){

		// filter event
		const e = getById("requests-filter");
		if ( e ){
			e.onclick = ()=>{

				CenterItem( parentId );
				dimBack(true, 'dimback', ()=>{
					this.hideFilter();
				})
				
			}
		}
	},

	beforeMount(){

		this.CONSLDT.active = CONSLDT_active;
		this.CONSLDT.dbs = CONSLDT_dbs;

		const url = location.href;
		let section
		if ( url.indexOf("09b") > -1){
			this._section = "REIM"
			this.isReim = true

		}else if( url.indexOf("09d") > -1){
			this._section = "TICKET"
			this.isTicket = true

		}else if( url.indexOf("09") > -1){
			this._section = "REQ"
			this.isRequest = true
		}
		// console.log( this._section, 'req', this.isRequest, 'reim', this.isReim, 'ticket', this.isTicket)
		

		// request types
    this._types = [
    	{no: -1, title: ''},
    	{no: 0, title: 'Overtime'},
    	{no: 1, title: 'Leave'},
    	{no: 2, title: 'Schedule'},
    	{no: 3, title: 'TOIL'},
    	{no: 4, title: 'Official Business'},
    	{no: 5, title: 'Official COA'},
    ]
		
		if ( this._section == "REIM")
			this._types = [{no: 100, title: 'Reimbursements Request'}]

		// current filter record
		this.load_RememberedUserFilter();	

	}

}).mount( "#" + parentId )


