{

	const body = get("body");

	const div = document.createElement('div');
	div.id = "input-note-area";	
	body.appendChild(div);

}

if ( busy == undefined)
	var busy = new BusyGif();

var timer;


const note_ui = Vue.createApp({

	template: `

	<div :id='box_id' class='modal-box bg-white w-270 br-5 ' style="left:-999">		
		
		<p class="h4 p-5 pl-10 c-white" :class="title.color"  >{{ title.title }}</p>

		<div class="py-10 px-15 mb-5 ">	

			<p v-if='description' class='py-5'>{{ description }}</p>

			<p v-if="show_id_line"
				class="py-5 ta-l p-0" id="remarks" >Request No.: {{ id.toString().padStart(4, "0") }}
			</p>
			<p class="py-5 ta-l p-0" id="remarks" >{{ title.label }}</p>

			<textarea v-model.trim="reason" ref="_reason" class="MemoBox wp-100 bg-white p-5" rows=5></textarea>

			<center class="pt-10">
	    <input type="button" class="button w-60 mr-5" :class="save_button.width" :value="save_button.caption" @click="save" />
	    <input type="button" class="button w-60" value="Cancel" @click="cancel(true)" />	
	  	</center>

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
				title: {},
				id: -1,
				reason: '',
				description: '',
				owner: 'DISAPPROVAL',
				update_done: {notes: false, status: false},
				cnt: 0,
				save_done: false,
				save_button: {caption: 'Save', width: 'w-60'},
				show_id_line: false,
				ajax_notes: '',
				block_filing: { date: '', team: '', team_name: '', reload_func: null },
		  }
		},

		reset(){
			
			let initData = this.init();

	  	const keys = Object.keys(initData)
	  	keys.forEach( (name)=>{
	  		this[name] = initData[name];
	  	})

		},

	  save(){

	  	if ( this.save_done ) return

	  	if ( ! this.reason ){
				msgBox("Please input reason.")
				this.$refs._reason.focus()
	  		return
	  	}

	  	this.save_done = true
	  	
	  	const url = PAYROLLWEB_URI + "/ajax_calls.php"

	  	if (this.owner == "CANCEL_APPROVALS"){

	  		busy.show2()
	  		
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

				busy.show2()

	  		// type = 30 is NOTE_REQUEST_COE

	  		let p = {func: 'notes', section:'MyProfile', 
	  			type: 30, note: uriString(this.reason) }

	  		this.cancel()
				xxhrPost( url, p, (res) => {
					
					busy.hide()					
					msgBox( "COE request sent successfully.")
					// const ret = JSON.parse(res);
					// console.log( 'add notes', ret)
				})	  		

	  	}else if(this.owner == "SUPERVISOR_NOTES"){

				busy.show2()

	  		// type = 40 is NOTE_APPROVER_NOTES
	  		const no = this.id

	  		let p = {func: 'notes', section:'MyTeamRequests', 
	  			type: 40, table:5, id: no, note: uriString(this.reason) }

				xxhrPost( url, p, (res) => {
					
					const ret = JSON.parse(res)
					this.ajax_notes = ret.data

					// show as cancelled
					if ( this.ajax_notes ){

						let el = getById( 'notes-40-' + no ) 						
						if (el){							
							el.innerHTML = ret.data

						}else{

							el = getById("rem-"+ no) // remarks element
							if ( el )
								el.innerHTML = el.innerHTML + this.ajax_notes
							
						}
					}

					busy.hide()
					this.cancel()
				})	  		

	  	}else if(this.owner == "DISAPPROVAL"){										

				btn_disapprove(this.reason);			
				this.cancel()

	  	}else if( this.owner == "BLOCK_LEAVE_FILING"){

	  		busy.show2()
				const p = {func: 'notes', type: 50, 'date': this.block_filing.date, id: this.block_filing.team,
					note: uriString(this.reason), json:1 
				}
				xxhrPost( url, p, (ret) => {
										
					console.log('blocked date', ret)
					this.block_filing.reload_func()
					busy.hide()					
					this.cancel()

				})	  			  		

	  	}

	  },

	  send_mail(){
			
	  	if (this.update_done.status && this.update_done.notes ){

		  	const url = PAYROLLWEB_URI + "/includes/db_funcs.php"

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
					if ( el )
						el.innerHTML = el.innerHTML + this.ajax_notes
					

		  		busy.hide()		
		  		this.cancel()					  		

		  	})

	  	}

	  },

	  show(){	  	

	  	const titles = {	  		
	  		DISAPPROVAL: 			  {title: 'Disapproval of Request', color: 'bg-red-2' },
	  		CANCEL_APPROVALS:   {title: 'Cancel Approved Request', color: 'bg-menu' },
	  		REQUEST_COE: 			  {title: 'Request Certificate of Employment', color: 'bg-deep-green'},
	  		SUPERVISOR_NOTES: 	{title: 'Add Request Notes', color: 'bg-deep-green', label: 'Note:'},
	  		BLOCK_LEAVE_FILING: {title: 'Block Leave Filing Schedule', color: 'bg-red-2', label: 'Reason:' },
	  	}

	  	this.title = titles[this.owner]	  	
	  	if ( ! this.title.label ) this.title.label = "Reason:"

	  	const show_me = () => {

		  	dimBack(true, 'dim_back', () => this.cancel() );
				CenterItem(this.box_id);

				this.$refs._reason.focus()
			}

			if ( this.owner == "REQUEST_COE"){

				busy.show2()

				const url = PAYROLLWEB_URI + "/ajax_calls.php"
				const p = {func: "notes", type:30, axn:'get_last_note', f:'note,datetime', by:this.id }

				xxhrPost(url, p, (res) => {

					busy.hide()

					// console.log('res',res)
					const ret = JSON.parse(res)
					console.log('ret', ret)

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

			}else{
				show_me();
			}
	  },

	  cancel( is_reset = true){
	  	
			if (is_reset) this.reset()
	  	dimBack(false, 'dim_back');
	  	hideItem(this.box_id);

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

				busy.show2()

				xxhrPost( "ajax_calls.php", p, (ret) => {														
					this.block_filing.reload_func()
					busy.hide()
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
			e = getById('disapprove_x')
			if ( e ){
				e.onclick = () => {
					this.owner = "DISAPPROVAL"
					this.show()
				}
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

			e = getAll("a[name='add-note']")
			if ( e ){
				e.forEach((el) => {

					const tr = el.parentElement.parentElement
					// console.log('tr',tr)
					el.onclick = () => {						
						this.owner = "SUPERVISOR_NOTES"
						this.id = tr.dataset.id
						this.show_id_line = true
						this.show()
						return false  //prevent
					}
				})
			}


	  },

	},

	beforeMount(){
		this.bind_events()
	},

}).mount('#input-note-area')

