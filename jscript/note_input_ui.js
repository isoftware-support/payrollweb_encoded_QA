{

	const body = get("body");

	const div = document.createElement('div');
	div.id = "input-note-area";	
	body.appendChild(div);

}

if ( note_busy == undefined)
	var note_busy = new BusyGif();

var timer;


const note_ui = Vue.createApp({

	template: `

	<div :id='box_id' class='modal-box bg-white br-5 ' :class='box_class' style="left:-999">		
		
		<div v-if='title.title' class="flex flex-space-between " :class="title.color">
				<p  class="h4 p-5 pl-10 c-white" >{{ title.title }}</p>
				<div class="p-3 m-5 br-10 bg-white opacity-7 clickable" @click="cancel"><img src="img/close.png" height="12"></img></div>
		</div>

		<div class="py-10 px-10 mb-5 ">	

			<p v-if='description' class='py-5'>{{ description }}</p>

			<p v-if="show_id_line"
				class="py-5 ta-l p-0" id="remarks" >Request No.: {{ id.toString().padStart(4, "0") }}
			</p>
			
			<!-- Request History UI -->
			<div v-show='is_msgr_mode' class="h-a" >			

				<p class="py-5 ta-l p-0" id="remarks" >History:</p>
				<div class='wp-96 bg-lightgrey-3 p-5 border-1' :class='request.notes_height_class'> 
					<div class="scroll-y hp-100 pr-5 flex-column"  ref="_notes" v-html="request.history"></div>					
				</div>

				<div v-if="request.add_note" class="aligner">
					<textarea v-model.trim="reason" ref="_reason2" class="MemoBox bg-white p-5 my-5 resizeNo wp-90 mt-10" rows=4></textarea>
					<div class="flex-column flex-gap-5 px-10 ">
						
						<input type="file" id="_att_file" ref="_att_file" class="d-none" v-model="file"
							@change="attachment_check" accept="image/*, application/pdf" >		    	

						<div class="w-20 p-3 bg-white shadow-2-hover br-10 border-1 cr-pointer" ref="_attach" id="_attach" 
							title="Attachment" @click="attachment_get"
						>
								<img src="images/paper_clip.png" width='20'></img>					
						</div>
						<div class="w-20 p-3 bg-white shadow-2-hover br-10 border-1 cr-pointer" title="Send Note" @click = "save">
							<img src="images/send.png" width='20' />
						</div>
						
					</div>
				</div>

			</div>
			
			<!-- Disapprove Request UI -->
			<div v-show="is_msgr_mode == false">
				<p class="py-5 ta-l p-0" id="remarks" >{{ title.label }}</p>

				<textarea v-model.trim="reason" id="r1" ref="_reason" class="MemoBox wp-100 bg-white p-5 resizeVer" rows=5></textarea>
				
				<center class="pt-10">
		    <input type="button" class="button w-60 mr-5" :class="save_button.width" :value="save_button.caption" @click="save" />
		    <input type="button" class="button w-60" value="Cancel" @click="cancel(true)" />	
		  	</center>
		  </div>

		</div>
	</div>
	`,

	data(){
			return this.init();
	},
	
	methods:{

		init(){

			return {
				box_id: 'input-note-box',
				box_class: 'w-270',
				title: {},
				title_def: '',
				id: -1,
				reason: '',
				description: '',
				owner: note_vars.owner,
				update_done: {notes: false, status: false},
				cnt: 0,				
				save_done: false,
				save_button: {caption: 'Save', width: 'w-60'},
				show_id_line: false,
				ajax_notes: '',
				block_filing: { date: '', team: '', team_name: '', reload_func: null },
				request: {history: ''},
				note: {id: 0},
				is_msgr_mode: false,
				file: '',
				vars: {},
				base_url: '',
		  }
		},

		reset(){
			
			// remember vars
			const mem =  Object.assign({}, this.$data)

			let initData = this.init();

	  	const keys = Object.keys(initData)
	  	keys.forEach( (name)=>{
	  		this[name] = initData[name];
	  	})

	  	this.base_url = mem.base_url
	  	this.request.count = mem.request.count
	  	this.request.id = mem.request.id
	  	this.request.type = mem.request.type

		},

	  save(){

	  	if ( this.save_done ) return

	  	if ( ! this.reason ){
				msgBox("Please input note or reason.")
				this.$refs._reason.focus()
	  		return
	  	}

	  	this.save_done = true
	  	
	  	const url = this.base_url + "/ajax_calls.php"

	  	if (this.owner == "CANCEL_APPROVALS"){

	  		note_busy.show2()
	  		
	  		const no = this.id

	  		this.update_done.notes = false
	  		this.update_done.status = false

	  		// save notes

		  		// type = 20 is NOTE_CANCEL_APPROVAL

		  		let p = {func: 'notes', section:'MyRequests', 
		  			type: 20, table:5, id: no, note: uriString(this.reason) }

					xxhrPost( url, p, (res) => {

						// console.log('add notes res',res)
						const ret = JSON.parse(res);
						// console.log( 'add notes', ret)
						
						this.ajax_notes = ret.data
						this.update_done.notes = true;
						this.send_mail()

					})	  		

				// update request status to cancelled
				 	p = { func: 'x', t:5, f:'f13', v:'-2', d:'0', xp:'f12='+ this.id }
				 	xxhrPost( url, p, (res) => {
						
						// console.log('update status res',res)

				 		const ret = JSON.parse(res)
				 		console.log( 'update req status', ret)

				 		this.update_done.status = true;
				 	  this.send_mail()
				 	})


	  	}else if(this.owner == "REQUEST_COE"){

				note_busy.show2()

	  		// type = 30 is NOTE_REQUEST_COE

	  		let p = {func: 'notes', section:'MyProfile', 
	  			type: 30, note: uriString(this.reason) }

	  		this.cancel()
				xxhrPost( url, p, (res) => {
					
					note_busy.hide()					
					msgBox( "COE request sent successfully.")
					// const ret = JSON.parse(res);
					// console.log( 'add notes', ret)
				})	  		
  	

	  	}else if(this.owner == "SUPERVISOR_NOTES" || this.owner == "MEMBER_NOTES"){
	  		
				note_busy.show2()

	  		// type = 40 is NOTE_APPROVER_NOTES
	  		const no = this.id

	  		let table = 5;
				let section = 'ScheduleRequests';
				if ( this.request.type == 3){  				// REQUEST_TYPE_TICKET
					section = "TicketRequests";
					table = '0'
				}else if( this.request.type == 2.9){	// REQUEST_TYPE_REIMB_DETAIL
					section = "RembursementRequest";
					table = 2
				}else if( this.request.type == 2){		// REQUEST_TYPE_REIM
					section = "RembursementRequest";
					table = 26
				}

	  		let p = {func: 'notes', section: section, 
	  			type: 40, table: table, id: no, note: uriString(this.reason), json: 1 }

	  		if ( this.owner == "MEMBER_NOTES") p.type = 70;

				const postIt = () => {

					xxhrPost( url, p, (ret) => {
						
						console.log('saved notes', ret)						
						
						this.ajax_notes = ret.data

						// show as cancelled
						if ( this.ajax_notes ){
							
						// remarks + cancelled approval notes							
							let el = getById( 'notes-40-' + no ) 						
							if (el){							
								el.innerHTML = ret.data
							}
						}

						note_busy.hide()
						this.save_done = false
						this.reason = ""
						this.attachement_clear();
						this.show()

						this.note.id = ret.note_id
						this.send_mail()

					})	  		
				}

		  	const file = getInputFile( '_att_file')
		  	if ( file ){

		  		p.att_file = file		
					resizeImageQuality(file, note_vars.imagefile_maxSizeKB, (blob) => {				

						if (blob != null ){
							p.att_file = new File([blob], file.name, { type: blob.type });						
						}					
						postIt()						
					})

				}else{
					postIt()				
				}				

	  	}else if(this.owner == "DISAPPROVAL"){										

	  		if ( note_vars.req_type == 3){  // ticket

	  			// collect all selected 
	  			const ids = getProp("input[type='checkbox'][no]:checked", 'no')
	  			
		  		let p = {func: 'notes', section: 'TicketRequests', type: 40, table:5, 
		  			m_ids: ids.join(","), note: uriString(this.reason), str: 'DISAPPROVAL', 
		  			json: 1 }

					xxhrPost( url, p, (ret) => {
						
						console.log('saved notes', ret)						
						
						this.note.id = ret.note_id
						this.send_mail()

					})	  		

	  			const btn = get("input[id='-1']")
	  			approveButtonClick(btn)

	  		}else if( note_vars.req_type == 2){  // main reimbursement disapproval

	  			// collect all selected 
	  			const ids = getProp("input[type='checkbox'][no]:checked", 'no')
	  			
		  		let p = {func: 'notes', section: 'RembursementRequest', type: 40, table:26, 
		  			m_ids: ids.join(","), note: uriString(this.reason), str: 'DISAPPROVAL', 
		  			json: 1 }

					xxhrPost( url, p, (ret) => {
						
						console.log('saved notes', ret)						
						
						this.note.id = ret.note_id
						this.send_mail()

					})	  		
	  			btn_disapprove()

	  		}else if( note_vars.req_type == 2.9){	// reimbursement detail disapproval

	  			// collect all selected 
	  			const ids = getProp("input[type='checkbox'][no]:checked", 'no')
		  		let p = {func: 'notes', section: 'RembursementRequestDetails', type: 40, table: 2, 
		  			m_ids: ids.join(","), note: uriString(this.reason), str: 'DISAPPROVAL', 
		  			json: 1 }

					xxhrPost( url, p, (ret) => {
						
						console.log('saved notes', ret)						
						
						// no need to send note mail alert to employee, per reim disapproval already sending mail
						// this.note.id = ret.note_id
						// this.send_mail()

					})	  		
	  			buttonClick( getById('disapprove_x') );

	  		}else{
					btn_disapprove(this.reason);			
				}
				this.cancel()

	  	}else if( this.owner == "BLOCK_LEAVE_FILING"){

	  		note_busy.show2()
				const p = {func: 'notes', type: 50, 'date': this.block_filing.date, id: this.block_filing.team,
					note: uriString(this.reason), json:1 
				}
				xxhrPost( url, p, (ret) => {
										
					// console.log('blocked date', ret)
					this.block_filing.reload_func()
					note_busy.hide()					
					this.cancel()

				})	  			  		

	  	}

	  },

	  send_mail(){
			
			if ( this.owner == 'SUPERVISOR_NOTES' || this.owner == 'MEMBER_NOTES' ){

				if ( ! note_vars.notifyNotes ) return;

				const ids = String(this.note.id).split(",");

				for( const id of ids){
					const url = this.base_url + "/mailer.php" ;
					const p = {func: 'note-notify', nid: id, json: 1}

					xxhrPost( url, p, (ret) => {
						console.log('note notification #' + id, ret);
					})
				}

			}else{
	  	
		  	if (this.update_done.status && this.update_done.notes ){

			  	const url = this.base_url + "/includes/db_funcs.php"

			  	const p = {func: 'approval_notification', 
			  		no: this.id,
			  		en: cancel_approval.emp_no,
			  		tp: cancel_approval.type ,
			  		apr: cancel_approval.action ,
			  	}
			  	this.cnt ++;  	

					this.cancel( false )					

		  		xxhrPost( url, p, (res) => {		  		

			  		const no = this.id

						// show as cancelled
						let el = get(`tr[data-id='${no}']`) 
						if (el){
							
							el.classList.add("bg-grey1")
							el.classList.add("f-cancel")

						  // remove cancel button
						  el = get(`img[data-id='${no}']`)						  
						  if ( el ) el.remove()

						  // replace status image
							el = get(`img[data-status-id='${no}']`)
							if ( el ) el.src = "img/approved-cancelled.png"
						}						

		  			// add to remarks column
						el = getById("rem-"+ no)					
						if ( el ) el.innerHTML = el.innerHTML + this.ajax_notes
						
			  		note_busy.hide()		
			  		this.cancel()					  		

			  	})
		  	}
	  	}

	  },

	  show(){	  	

	  	const titles = {	  		
	  		DISAPPROVAL: 			  {title: 'Disapproval of Request', color: 'bg-red-2' },
	  		CANCEL_APPROVALS:   {title: 'Cancel Approved Request', color: 'bg-menu' },
	  		REQUEST_COE: 			  {title: 'Request Certificate of Employment', color: 'bg-deep-green'},
	  		SUPERVISOR_NOTES: 	{title: this.title_def, color: 'bg-deep-green', label: 'Note:'},
	  		MEMBER_NOTES: 			{title: "My " + this.title_def, color: 'bg-deep-green', label: 'Note:'},
	  		BLOCK_LEAVE_FILING: {title: 'Block Leave Filing Schedule', color: 'bg-red-2', label: 'Reason:' },
	  	}


	  	this.title = titles[this.owner]	  	
	  	if ( ! this.title ) return;
	  	if ( ! this.title.label ) this.title.label = "Reason:"

	  	const show_me = () => {

	  		if ( ! this.request.notes_realtime ){
			  	dimBack(true, 'dim_back', () => this.cancel() );
					CenterItem(this.box_id )
				}
				
				if ( this.is_msgr_mode && this.request.add_note){					
					this.$refs._reason2.focus() 
				}else{
					this.$refs._reason.focus() 
				}				
			}

			if ( this.owner == "REQUEST_COE"){

				note_busy.show2()

				const url = this.base_url + "/ajax_calls.php"
				const p = {func: "notes", type:30, axn:'get_last_note', f:'note,datetime', by:this.id }

				xxhrPost(url, p, (res) => {

					note_busy.hide()

  				const ret = JSON.parse(res)

					if ( ret.status == "success" ){

						const {data} = ret

						msgBox( [{message:"You already submitted COE request.", class:"mb-10"}, 
							{message: 'Request Date: ' + DateFormat(data.datetime, 'M d, Y'), class: 'ml-10 '}, 
							{message: 'Reason: ' + data.note, class: 'ml-10'} ,
							{message: "Request another?", class:'mt-10'}], 
							{ title: 'COE Request',
								okCallBack: () => show_me(), 
								okCaption: 'Yes',
								cancelButton: true ,								
							}
							)

					}else{					
						show_me()
					}
				})
			
			}else if( this.owner == "SUPERVISOR_NOTES" || this.owner == "MEMBER_NOTES"){

				note_busy.show2();				

				const url = this.base_url + "/ajax_calls.php"
				const p = {func: "req_history", id: this.request.id, 
					type: this.request.type, json: 1 }

			  xxhrPost(url, p, (ret) => {

			  	note_busy.hide();

			  	console.log('show notes',ret, p);

			  	this.request.history = "";

			  	if ( ret.status == 'success' ){

			  		let history = ""

			  		for( const id in ret.data ){

			  			const item = ret.data[id];
			  			const align = ! item.emp ? "self-right" : "";

			  			let dttm = ""
			  			if ( item.dttm) dttm = `<label class='c-grey italic pl-5 fs-10'>${item.dttm}</label>`

			  			history += `
									<div class='mb-5 p-8 br-5 bg-white w-320 ${align}'>						  								  			
						  			<label class='c-grey'>${item.name}</label>
						  			${dttm}
						  			:
						  			<label class='lh-15 pb-5 ${item.class}'>${item.remark}</p>
									</div>`
			  		}		  		
			  		this.request.history = history;
				  	this.request.notes_count = ret.notes_count  // for realtime 

				  	show_me();

						// scroll to bottom
						setTimeout(() => {
					    this.$refs._notes.scrollTop = this.$refs._notes.scrollHeight;

					    if ( ! this.note_refresh_active ) this.refresh_notes()
						}, 300)

						this.attachement_clear()

			  	}else{
			  		msgBox("Request History not found.");
			  	}

			  })

			}else{
				show_me();
			}
	  },

	  refresh_notes(){

	  	if ( ! this.request.add_note && ! this.request.history ) return
	  
	  	this.note_refresh_active = true;

	  	setTimeout( () => {

				const url = this.base_url + "/ajax_calls.php"
				const p = {func: "notes", id: this.request.id, type: this.request.type, axn: 'count', json: 1 }

			  xxhrPost(url, p, (ret) => {	  		

			  	if ( typeof this.request.notes_count == 'undefined') return

			  	this.request.notes_realtime = true

			  	console.log( 'refresh notes', ret, this.request.notes_count, p )
			  	if ( ret.count != this.request.notes_count){
			  		note_busy.hide()
			  		this.show()
			  	}else{
			  		this.refresh_notes()
			  	}

			  })

	  	}, 2000)

	  },

	  attachment_get(){

	  	this.attachement_clear();
			this.$refs._att_file.click();

	  },

	  attachment_check(event){
	  	
	  	let filename = "";
	  	const file = event.target
	  	if ( checkAttachment(file, '', note_vars.file_maxSizeMB, true) ){

	    	const ret = file.value.split('\\');		
	    	filename = " File : " + ret[ret.length - 1];	    	
	    	classAdd('#_attach', "bg-green-1")

	  	}
	  	this.$refs._attach.title = "Attachment" + filename
	  	
	  },

	  attachement_clear(){

	  	if ( this.$refs._att_file ){

		  	this.$refs._att_file.value = '';  // clear file
		  	this.$refs._attach.title = "Attachment"
		  	classRemove('#_attach', "bg-green-1")
		  }
	  },

	  cancel( is_reset = true){
	  	
			if (is_reset) this.reset()
	  	dimBack(false, 'dim_back');
	  	hideItem(this.box_id);

	  	this.note_refresh_active = false
	  },

	  block_leave_filing_set(team, team_name, reload_func){
	  	this.block_filing.team = team
	  	this.block_filing.team_name = team_name
	  	this.block_filing.reload_func = reload_func
	  },

	  unblock_filing(){
			
			const unblock = () => {
				const p = {func: '-notes', type: 50, 'date': this.block_filing.date, 
					id: this.block_filing.team, json:1 
				}

				note_busy.show2()

				xxhrPost( "ajax_calls.php", p, (ret) => {														
					this.block_filing.reload_func()
					note_busy.hide()
				})
			}

			msgBox("Unblock date "+ DateFormat( this.block_filing.date, "M d, Y") + " to allow Leave filing?", 
				{	
					okCallBack: () => {
						unblock()
					},
					cancelButton: true,
				}
			)

	  },

		bind_events(){

			if ( typeof PAYROLLWEB_URI !== 'undefined') url = PAYROLLWEB_URI
			if ( typeof rootURI !== 'undefined') url = rootURI
			this.base_url = url

			// add click event to cancel buttons
				let e = getAll("img.cancel_approvals")
				if ( e ){
					
					e.forEach( (el) => {				
						el.onclick = () => {

							this.id = el.dataset.id
							this.owner = "CANCEL_APPROVALS"
							this.show_id_line = true
							this.show()
						}	
					})			
				}

			// request disapproval
				e = getAll('#disapprove_x')
				if ( note_vars.req_type == 3){  // ticket
					e = getAll("[id='-1']")
				}
				if ( e ){
					e.forEach( el => {
						el.onclick = (el) => {
							this.owner = "DISAPPROVAL"
							this.show()
						}						
					})
				}

			// request COE
				e = getById('request-coe')
				if ( e ){
					e.onclick = () => {
						this.id = emp_no
						this.owner = "REQUEST_COE"
						this.save_button = {caption: "Send Request", width: 'w-100'}
						this.show()
					}
				}

			// block schedule date
				e = getAll('div.block-sched-date')
				if ( e ){

					e.forEach((el) => {
						el.onclick = (event) => {

							const div = event.target
							this.block_filing.date = div.id												

							this.owner = "BLOCK_LEAVE_FILING"						
							this.description = "Disallow Leave Request filing on "+ DateFormat( div.id, 'M d, Y') +
								" for team members of "+ this.block_filing.team_name 

							this.show()
							return false  //prevent
						}
					})
				}

				e = getAll('div.blocked-date')
				if ( e ){
					e.forEach( (el) => {
						el.onclick = (event) => {
							this.block_filing.date = event.target.dataset.dt
							this.unblock_filing()
						}
					})
				}

			// notes
				e = getAll("a[name='add-note']")
				if ( e ){

					for( const el of e ){
					
						el.onclick = () => {				

							const tr = el.parentElement.parentElement
							const status = tr.dataset.status || tr.dataset.stat

							let add_note = status == -1 || status == 0 ?  true : false

							// reimbursement detail note - REQUEST_TYPE_REIM_DETAIL
							if ( note_vars.req_type == 2.9) add_note = true
				
							this.id = tr.dataset.id || tr.id
							this.title_def = tr.dataset.tn + " Request Notes - #" + this.id.toString().padStart(4, "0")						
							this.show_id_line = false
							this.is_msgr_mode = true
							this.box_class = 'w-400 h-400'
							
							this.request.id = this.id					
							this.request.type = note_vars.req_type;
							this.request.add_note = add_note
							this.request.notes_height_class = add_note ? "hp-60" : "hp-80" ;

							console.log(this.request.add_note, this.is_msgr_mode, this.request.id, this.request.type)
							this.show()
							return false  //prevent
						}
					}
				}
	  },
	},

	beforeMount(){
		this.bind_events()
	},

}).mount('#input-note-area')

