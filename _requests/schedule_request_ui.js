

{
	const body = getById("wrapper");
	if (body){

		// sched request 
		let div = document.createElement('div');
		div.id = "sched-request";	
		body.appendChild(div);
	}
}

busy = new BusyGif()	

const type_names = ['Overtime', 'Leave', 'Change Schedule', 'TOIL',	'Official Business', 'COA']


const reimDetail = Vue.createApp({
	template: `

		<!-- <div id='sched-request-ui' class='modal-box bg-white wp-80 wmx-500 p-5' style="left: -999"> -->

		<div id='sched-request-ui' class='modal-box bg-white wp-80 wmx-600 p-5 ss-hide' style="left: -999">
			
			<fieldset class="p-20 pl-30">
			<legend>{{title}}</legend>

			<!-- ERROR -->
			<div class="c-red p-5 h5" v-html="error_msg"></div>

			<!-- type -->
			<div v-if="submit_mode != SUBMIT_APPROVER_ADD" class="flex ml-5">
				<div class="req-label py-10">
					<p class="">Request Type:</p>
				</div>
				<div class="req-data ">

					<div v-if="submit_mode == SUBMIT_ADD || submit_mode == SUBMIT_APPROVER_ADD" 
						class="w-200 my-5">
						<select v-model="type">
							<option value="5" >COA</option>
							<option value="0" >Overtime</option>
							<option v-if="rules.can_avail_leave" value="1" >Leave</option>
							<option value="4" >Official Business</option>
							<option v-if="rules.can_sched_change" value="2" >Change Schedule</option>
							<option v-if="rules.can_toil" value="3" >TOIL</option>
						</select>
					</div>

					<div v-else class="my-5 ">						
						<label class='h4 mr-5'>{{type_name}}</label>
						<label class="h4">( No: {{req_no_text}} )</label>
					</div>
				</div>
			</div>

			<!-- approver overtime request for member -->
			<div v-if="submit_mode == SUBMIT_APPROVER_ADD"class="flex ml-5">
				<div class="req-label py-10">
					<p class="">Overtime Request for:</p>
				</div>
				<div class="req-data ">

					<div class="w-250 my-5">
						<select v-model="approver.member_no">
							<option v-for="member in vars.members" :value="member.no">{{member.name}}</option>
						</select>
					</div>
				</div>
			</div>

			<!-- leave types -->
			<div v-if="type == TYPE_LEAVE" class="flex ml-5">
				<div class="req-label py-10">
					<p class="">Leave Type:</p>
				</div>
				<div class="req-data ">
					<div class="w-200 my-5">
						<select v-model="leave.type">
							<option v-for="item in vars.leave_types" :value="item.code">{{item.description}}</option>
						</select>
					</div>
				</div>
			</div>

			<!-- leave filing mode -->
			<div v-if="type == TYPE_LEAVE"class="flex ml-5">

				<div class="req-label flex flex-column flex-justify-center">
					
					<div class="ml-20">
						<div v-if="rules.can_shift_mode" class="flex flex-align-right">
							<label for="leave-shift" >Shift</label>
							<input type="radio" id="leave-shift" class="m-0 ml-5" name="leave-file-mode" v-model="leave.mode" value="1">
						</div>
				
						<div v-if="rules.can_duration_mode" class="flex mt-5 flex-align-right">
							<label for="leave-duration" >Duration</label>
							<input type="radio" id="leave-duration" class="m-0 ml-5" name="leave-file-mode" v-model="leave.mode" value="0">
						</div>
				
						<div v-if="rules.can_selective_mode" class="flex mt-5 flex-align-right">
							<label for="leave-selective" >Selective</label>
							<input type="radio" id="leave-selective" class="m-0 ml-5" name="leave-file-mode" v-model="leave.mode" value="2">
						</div>
					</div>
				</div>
				
				<div class="req-data flex flex-column flex-justify-center">
					
					<!-- shift mode -->
					<div v-if="leave.mode == LEAVE_SHIFT" class="flex">
						<input type="date" class="editbox" v-model="leave.dttm_from">
						<select class="w-250 ml-5 lh-20" v-model="leave.shift_code">							
							<option class="lh-30" v-for="item in vars.shift_codes" :value="item.code" >{{item.desc}}</option>
						</select>
					</div>

					<!-- leave duration mode -->
					<div v-if="leave.mode == LEAVE_DURATION">
						<div class="my-5">
							<label class="my-5">{{leave.duration_text}}</label>
						</div>
						
						<div class="flex my-5">
							<input class="EditBox " :type="leave.duration_date_type" id="leave.dttm_from" step="any" 
								v-model="leave.dttm_from" @change="date_changed" />
							<label class="pt-5 px-5">to</label>
							<input class="EditBox " :type="leave.duration_date_type" id="leave.dttm_to" step="any" 
								v-model="leave.dttm_to" @change="date_changed" />
						</div>
						
						<div v-if="rules.can_duration_hours_mode" class="flex mb-5">
							<input type="checkbox" id="in-days" v-model="leave.in_days" @change="in_days_changed">
							<label class="mt-2 ml-5" for="in-days">In Days</label>
						</div>

						<!-- batch filing date -->
						<div v-if="leave.batch_dates" id="leave_batch_filing_box" v-html="leave.batch_dates"></div>

					</div>

					<!-- selective mode -->
					<div v-if="leave.mode == LEAVE_SELECTIVE" class="flex">
						<input type="date" class="editbox" v-model="leave.dttm_from">	
						<select class="w-70 mx-5" v-model="leave.selective_hour" @change="">
							<option v-for="item in vars.selective_hours" :value="item.value">{{item.desc}}</option>
						</select>
						<label class="mt-5">(Hours)</label>
					</div>


				</div>
			</div>

			<!-- duration -->
			<div v-if="type == TYPE_COA || type == TYPE_OB || type == TYPE_OT || type == TYPE_TOIL" class="flex ml-5">
				<div class="req-label py-10 ">
					<label class="">Duration:</label>
				</div>
				<div class="req-data pt-5 ">
					<div class="flex my-5">
						<input class="EditBox " type="datetime-local" step="any" id="dttm_from"
							v-model="dttm_from" @change="date_changed"/>
						<label class="pt-5 px-5">to</label>
						<input class="EditBox " type="datetime-local" step="any" id="dttm_to"
							v-model="dttm_to" @change="date_changed" @click="date_to_suggest"/>
					</div>
					<div class="my-5">
						<label class="my-5">{{duration_text}}</label>
					</div>
				</div>
			</div>

			<!-- change schedule -->
			<div v-show="type == TYPE_SC" class="flex ml-5">
				<div class="req-label py-10 ">
					<label class="">Change Schedule:</label>
				</div>
				<div class="req-data pt-5 ">
					<div class="flex my-5">
						<label class="mt-5 fw-30" >From:</label>
						<input class="EditBox mx-5" type="date" ref="sched_date" step="any" v-model="sched_change.date" @change="schedChange_date_status" />
						<label class="mt-5 ">{{sched_change.status}}</label>
					</div>
					<div class="flex my-5">
						<label class="mt-5 fw-30" >To:</label>
						<select class="ml-5 w-200" v-model="sched_change.shift_code">
							<option value="RESTDAY">- - - - - - - - REST DAY - - - - - - - -</option>
							<option v-for="item in vars.shift_codes" :value="item.code">{{item.desc}}</option>
						</select>
						
					</div>
				</div>
			</div>

			<!-- Attachment -->
			<div v-if="submit_mode != SUBMIT_APPROVER_UPDATE"class="flex ml-5">
				<div class="req-label py-10 ">
					<label class="">Attachment:</label>
				</div>
				<div class="req-data  ">

					<input class="button mt-3" type="button" value="Browse" onclick="document.getElementById('att_file').click();" />  		
					<label class="ml-5" id="att_file_name">{{filename}}</label>

					<input type="file" name="att_file" id="att_file" 
						onchange="checkAttachment(this, 'att_file_name', req_vars.maxFileSize );" accept="image/*, application/pdf" style="display:none;">		    	

				</div>
			</div>

			<!-- Remarks -->
			<div class="flex ml-5  ">
				<div class="req-label py-10 ">
					<label class="">Reason:</label>
				</div>
				<div class="req-data flex flex-column flex-justify-center">
					<p v-if="submit_mode == SUBMIT_APPROVER_UPDATE" class="label" >{{reason}}</p>
					<textarea v-else class="my-5 wp-100" v-model="reason" rows=3 ></textarea>
				</div>
			</div>

			<!-- Approver Override Remarks -->
			<div v-if="submit_mode == SUBMIT_APPROVER_UPDATE" class="flex ml-5  ">
				<div class="req-label py-10 ">
					<label class="">Override Comment:</label>
				</div>
				<div class="req-data ">
					<div>
					<textarea class="my-5" v-model="approver.reason" rows=2 ></textarea>
					</div>
				</div>
			</div>

			<!-- button -->
			<center class="mt-10">
				<button type="button" class="" @click="save" >{{submit_text}}</button>
				<button type="button" class="ml-5" @click="cancel">Cancel</button>
			</center>
	`,

	data(){
		return{

			title: "Create Schedule Request",
			submit_text: "Submit Request",

			type: 0,		
			type_name: '',
			submit_mode: 1,
			reason: '',
			req_no: 0,
			error_msg: '',
			filename: '',
			time_value : {value: 0, unit: "hour"},

			dttm_from: '', dttm_to: '',
			duration_text: 'Actual Total Hours: 0',

			sched_change: {
				shift_code: 'RESTDAY',
				shift_code_from: '',
				date: '',
				status: 'Open Schedule',				
			},

			leave: {
				type: 0,
				mode: 1,
				shift_code: '',
				selective_hour: '',
				in_days: false,
				in_days_value: 0,
				duration_text: 'Length: 0',
				dttm_from: '',
				dttm_to: '',
				batch_dates: '',
			},

			approver:{
				member_no: 0,
				reason: '',
			},

			rules: {},
			vars: {},
			
			TYPE_OT: 0, TYPE_LEAVE: 1, TYPE_SC: 2, TYPE_TOIL: 3, TYPE_OB: 4, TYPE_COA: 5,

			LEAVE_DURATION: 0, LEAVE_SHIFT: 1,  LEAVE_SELECTIVE: 2,

			SUBMIT_ADD: 1, SUBMIT_UPDATE: 2, SUBMIT_APPROVER_ADD: 11, SUBMIT_APPROVER_UPDATE: 22,

		}
	},

	methods: {

		init(){ 
			Object.assign( this.$data, this.$options.data() )	

			this.leave.mode = req_vars.leave_mode
			this.rules = req_rules
			this.vars = req_vars

			// console.log( 'rules',this.rules)
			// console.log( 'vars', this.vars)

			// submit mode
			this.submit_mode = req_vars.submit_mode

			// duration hours 
			this.leave.duration_date_type = req_rules.can_duration_hours_mode ? 'datetime-local' : 'date';		
			
			// always in days if no leave hours filing
			this.leave.in_days = req_rules.can_duration_hours_mode ? false : true;


			// filename label
			let e = getById("att_file_name");
			if ( e ) e.innerHTML = ""

			// clear files
			e = getById('att_file')		
			if ( e ) e.value = ''

		},

		add( event, mode = this.SUBMIT_ADD){ 
			this.init()
			
			this.submit_mode = mode;

			if (mode == this.SUBMIT_APPROVER_ADD ){
				this.type = this.TYPE_OT
				this.title = "Create Team Member Overtime Request"
			}

			this._show() 
		},

		approver_edit(event, req_no, member_no){

			event.preventDefault();

			this.init()

			this.req_no = req_no
			this.approver.member_no = member_no
			this.edit(event, this.SUBMIT_APPROVER_UPDATE )

		},

		edit( event, mode = this.SUBMIT_UPDATE){			

			event.preventDefault()

			if ( mode == this.SUBMIT_UPDATE ){
				this.init()				
				if ( ! this._selected("edit") ) return
			}

			const p = {func: 'GetReq', req_no: this.req_no, x:1 };
			if ( mode == this.SUBMIT_APPROVER_UPDATE ){
				p.member_no = this.approver.member_no
			}

			busy.show2()
			xxhrPost('_requests/schedule_request_api.php', p, (res) =>{		

				// console.log(res)	
				const ret = JSON.parse(res)
				// console.log(ret);				

				const type = ret.type
				
				this.submit_mode = mode		

				this.title = "Update Schedule Request"
				this.submit_text = "Update Request"
				if ( mode == this.SUBMIT_APPROVER_UPDATE ){
					this.title = "Override Schedule Request"
					this.submit_text = "Submit Override"					
				}

				this.req_no_text = this.req_no.padStart(3,0)

				this.type = type
				this.type_name = type_names[ type]					

				this.reason = ret.reason
				this.filename = null
				if ( ret.filename ) this.filename = ret.filename

				if ( type == this.TYPE_OT  || type == this.TYPE_COA ||
					   type == this.TYPE_OB  || type == this.TYPE_TOIL
					){

					this.dttm_from = ret.dttm_from
					this.dttm_to = ret.dttm_to					
					this.date_changed()

				}else if( type == this.TYPE_LEAVE ){

					const leave_mode = ret.leave_mode

					this.leave.type = ret.leave_type
					this.leave.mode = leave_mode
					this.leave.dttm_from = ret.dttm_from

					if ( leave_mode == this.LEAVE_SHIFT ){
						this.leave.shift_code = ret.shift_code

					}else if( leave_mode == this.LEAVE_SELECTIVE){
						this.leave.selective_hour = ret.selective_hour

					}else{   // duration

						this.leave.in_days = ret.leave_in_days
						this.in_days_changed()
						this.leave.dttm_from = ret.dttm_from
						this.leave.dttm_to = ret.dttm_to						

						this.date_changed()
					}

					// console.log( 'data', this.leave);
					
				}else if( type == this.TYPE_SC){
					this.sched_change.date = ret.dttm_from
					this.sched_change.shift_code = ret.sched_to
					
					this.schedChange_date_status()
				}							
				
				this._show()
				busy.hide()					
			})
		
		},
		
		cancel(){
			hideItem('sched-request-ui');
	  	dimBack(false, 'dim_back');
		},

		save(){
			
			if ( ! this._checkentry() ) return

			busy.show2();

			const type = parseInt(this.type)
			const mode = this.submit_mode

			const p = {mode: mode, req_type: type}

			if ( this.dttm_from ) p.dttm_from = this.dttm_from
			if ( this.dttm_to ) p.dttm_to = this.dttm_to
			p.reason = this.reason

			// file
			const file = getById('att_file')		
			if ( file ){
				if ( file.files ){
					p.att_file = file.files[0];
				}
			}

			if( type == this.TYPE_LEAVE){
				
				if ( this.leave.dttm_from ) p.dttm_from = this.leave.dttm_from
				if ( this.leave.dttm_to ) p.dttm_to = this.leave.dttm_to
				p.leave_type = this.leave.type
				p.leave_mode = this.leave.mode

				if ( this.leave.mode == this.LEAVE_SHIFT ){
					p.shift_code = this.leave.shift_code

				}else if( this.leave.mode == this.LEAVE_SELECTIVE ){
					p.selective_hour = this.leave.selective_hour
				}else if( this.leave.mode == this.LEAVE_DURATION){
					if (this.leave.selected_batch_dates) 
						p.leave_batch_filing_dates = this.leave.selected_batch_dates
				}

			}else if( type == this.TYPE_SC){

				if ( this.sched_change.date ) p.dttm_from = this.sched_change.date
				p.sched_from = this.sched_change.shift_code_from
				p.sched_to = this.sched_change.shift_code

			}

			// edit mode
			if ( mode == this.SUBMIT_UPDATE || mode == this.SUBMIT_APPROVER_UPDATE){
				p.reqno = this.req_no
			}

			if( mode == this.SUBMIT_APPROVER_ADD || mode == this.SUBMIT_APPROVER_UPDATE ){
				p.member_no = this.approver.member_no
				p.override_comment = this.approver.reason
			}			
			p.x = 1

			// return console.log( p)
			
			xxhrPost("_requests/schedule_request_api.php", p, (res)=>{

				// console.log('res', res)
				const ret = JSON.parse(res)
				// console.log('ret', ret );

				busy.hide()

				this.error_msg = ""
				if ( ret.error ){
					this._errorMsg( ret.error )

				}else{
					location.reload()
				}
			})

		},

		approver_delete(event, member = {} ){

			this.init()

			// console.log( member);
			this.req_no = member.req_no
			this.approver.member_no = member.member_no
			this.approver.row_to_remove = member.row;

			this.delete(event, this.SUBMIT_APPROVER_UPDATE)

		},

		delete(event, mode = this.SUBMIT_UPDATE ){

			event.preventDefault();

			// console.log( mode)
			// employee mode
			if ( mode == this.SUBMIT_UPDATE ) {
				if ( ! this._selected("delete") ) return	
			}
			

			const deleteRequest = ()=>{

				const p = { func:"DelReq", req_no: this.req_no, mode: mode, x:1};
						
				if ( mode == this.SUBMIT_APPROVER_UPDATE ){
					p.member_no = this.approver.member_no
				}

				busy.show2()       
				xxhrPost( '_requests/schedule_request_api.php', p, (res)=>{

					// console.log( res)
					const ret = JSON.parse(res)
					// console.log( JSON.parse(res))

					if ( ret.error ){
						msgBox( ret.error )
					}else{

						// remove row
						if ( mode == this.SUBMIT_UPDATE ){  // employee mode

							let e = get(`input[type='radio'][value='${this.req_no}']`)
							if ( e ){
								const row = e.parentElement.parentElement;
								row.parentElement.removeChild(row);
							}

							// select next available row
							e = get("input[type='radio'][name='req_no']")
							if ( e ) e.checked = true
							

						}else{

							const row = this.approver.row_to_remove
							if ( row ){
								row.parentElement.removeChild( row )
							}
						}
					}
					
					busy.hide()					
				})
			}

			msgBox(`Are you sure you want to delete this Request #${this.req_no}?`, 
				{ cancelbutton: true, okCallBack: deleteRequest })		

		},	

		in_days_changed(){

			this.leave.duration_date_type = this.leave.in_days ? "date" : "datetime-local";

			this.leave.dttm_from = ''
			this.leave.dttm_to = ''			
			this.leave.duration_text = "Time Value: 0"
			this.leave.in_days_value = 0
			this._loadLeaveDates()
		},

		date_changed(event){

			if ( [this.TYPE_COA, this.TYPE_OB, this.TYPE_OT, this.TYPE_TOIL].includes( parseInt(this.type) ) ){
				
				// set dttm_to when empty 					
				if ( this.type != this.TYPE_COA ){
					if ( this.dttm_from && ! this.dttm_to ) this.dttm_to = this.dttm_from
				}

				// duration hours value
				this.duration_text = "Time Value: " + this._compute_hours(this.dttm_from, this.dttm_to)
			}

			// leave duration value
			if ( this.type == this.TYPE_LEAVE ){

				// to is empty 	
				if ( this.leave.dttm_from && ! this.leave.dttm_to) this.leave.dttm_to = this.leave.dttm_from

				this.leave.in_days_value = 0	
				this.leave.duration_text = "Time Value: " + this._compute_hours(this.leave.dttm_from, this.leave.dttm_to, true)

				if ( !name || name != "batch_dates") this._loadLeaveDates()

			}
		},

		date_to_suggest(event){

			if ( event.target.id == "dttm_to"){
				if ( this.type == this.TYPE_COA && ! this.dttm_to && this.dttm_from ){
					this.dttm_to = this.dttm_from
				}
			}
		},

		schedChange_date_status(){

			// console.log( 'schecChange_date_statu');

			busy.show2();

			xxhrPost("ajax_calls.php", {func: 'GetSched', dt: this.sched_change.date, x:1}, 
			(res) => {

				// console.log( res)
				const ret = JSON.parse(res)
				// console.log('ret', ret)
				this.sched_change.status = ret.res.status
				this.sched_change.shift_code_from = ret.res.sc
				
				busy.hide();
			})
		},

		_show( isClickDim = false){

			let func = () => {};
			if ( isClickDim ) func = this.cancel;

	  	dimBack(true, 'dim_back', func );
			CenterItem('sched-request-ui');
		},

		_compute_hours(dttmFrom, dttmTo, checkInDays = false ){

			let txt = "0";		
			
			this.time_value = {value: 0, unit: "hour"}

			let hr = 0;
			if ( dttmFrom && dttmTo ){

				var _start = new Date( dttmFrom );
				var _end = new Date( dttmTo );

				var diff = ( _end - _start);	
				var sec = diff / 1000;
				var min = sec / 60;
				hr = min / 60;			
				
				if ( checkInDays && this.leave.in_days ){			

					let days = parseInt( hr / 24) + 1;			

					txt = days + " day"
					if (days > 1) txt = txt + "s"
					this.leave.in_days_value = days

					this.time_value = {value: days, unit: "day"}

				}else{

					let val = 0;
					if (hr >= 1){
						val = hr.toFixed(2)
						txt = val.toString() + " Hour"
					}else if( min >= 1 ){
						val = min.toFixed(0)
						txt = val.toString() + " Min"
					}else{
						val = sec.toFixed(0)
						txt = val.toString() + " Sec"
					}

					if ( parseFloat(val) > 1 ) txt += "s"

					this.time_value = {value: hr, unit: "hour"}

				}
				
			}
			return txt;
		},

		_loadLeaveDates(){

			if ( ! this.rules.can_batch_filing) return;
			
			let dtFrom = this.leave.dttm_from
			let dtTo = this.leave.dttm_to

			let dates = [];
						
			if ( dtFrom && dtTo ){

				dtFrom = DateFormat(dtFrom, "Y-m-d")
				dtTo = DateFormat(dtTo, "Y-m-d")				
				// console.log(dtFrom, dtTo)      

				if ( dtTo > dtFrom ){

		      dtFrom = new Date( dtFrom );
		      dtTo = new Date( dtTo );      

		      const holidays = this.vars.calendar_holidays

		      if ( dtFrom < dtTo ){
						
						// previousely selected dates on date range change
						const listedDates = getAll("input[name='batch_dates']");

						let dates1 = [], dates2 = [];
						let cnt = 1, index = 1;
						while(true){

							const date = DateFormat( dtFrom, "d-M-Y D" );
							const day = DateFormat( dtFrom, "D");
							const v = DateFormat( dtFrom, "Y-m-d" );
							
							const id = `leave_dates_${cnt}`;

							let color = "";
							if ( day == "Sun" || day == "Sat")
								color = "c-red";

							if ( Array.isArray(holidays) ){
								if ( holidays.includes(v) ){
									color = "c-red bold ";

									// #8494 - disallow leave filing on holidays
									if ( ! this.rules.can_file_on_holidays ){
										dtFrom.setDate( dtFrom.getDate() + 1);
										continue;
									}									
								}
							}
												
							let checked = 'checked';
							
							// put check status to previously selected dates
							if ( listedDates.length ){						
								for(let i = 0; i < listedDates.length; i++ ){
									const chk = listedDates[i];
									if ( chk.dataset.dt == v  ){
										checked = chk.checked ? "checked" : "";
										break;
									}
								}
							}

							let chk = 
								`<input class='mr-3' type='checkbox' name='batch_dates' id='${id}' ${checked} data-dt='${v}' ` 
							chk += " @click='date_changed' />"
							chk +=	`<label class='fw-130 ${color}' for='${id}'>${date}</label>`

							if (index == 1){
								dates1.push( chk );
							}else{
								dates2.push( chk );
							}

							if (dtFrom >= dtTo) break;
							dtFrom.setDate( dtFrom.getDate() + 1);

							cnt++;
							index++;
							if (index > 2) index = 1;

						} // end while

						dates1.forEach( (item, index) => {

							let  e = "<div class='aligner'>" + item;

							if ( index < dates2.length){
								e += dates2[index];
							}
							e += "</div>";
							dates.push(e);					
						})								
					}
				}
			}
			
			this.leave.batch_dates = dates.join("");  // dates
		},

		_errorMsg( msg ){
			this.error_msg = msg
			setTimeout(()=>{ this.error_msg = ""}, 20000);			
		},

		_checkentry(){

			let msg = ""

			const type = this.type
			const mode = this.leave.mode

			let dttm_from = this.dttm_from
			let dttm_to = this.dttm_to

			if ( type == this.TYPE_LEAVE){
				dttm_from = this.leave.dttm_from
				dttm_to = this.leave.dttm_to

				if (mode == this.LEAVE_SHIFT || mode == this.LEAVE_SELECTIVE)
					dttm_to = ""
			}

			if ( type == this.TYPE_SC){
				dttm_from = this.sched_change.date
				dttm_to = ""
			}

			// reason			
			if ( ! this.reason ) msg = "Please input reson for this request."				
			if ( this.submit_mode == this.SUBMIT_APPROVER_UPDATE && ! this.approver.reason)
				msg = "Please input override comment.";
			


			// check datetime to
			if ( type == this.TYPE_OT || 
					type == this.TYPE_TOIL	|| 
					type == this.TYPE_OB	||
					( type == this.TYPE_LEAVE && this.leave.mode == this.LEAVE_DURATION )	){  // only for duration

				if (! dttm_to ) msg = "Please input valid end date time."
			}

			// data time from
			if ( type == this.TYPE_OT 		|| 
					 type == this.TYPE_TOIL 	||
					 (type == this.TYPE_COA && ! this.dttm_to) ||
					 type == this.TYPE_OB 		||
					 type == this.TYPE_SC 		||
					 type == this.TYPE_LEAVE ){

				if (! dttm_from ) msg = "Please input valid date."
			}

			// datefrom and datetime to
			if ( type == this.TYPE_OT 		|| 
					 type == this.TYPE_TOIL 	||
					 type == this.TYPE_OB 		||
					 (type == this.TYPE_COA && dttm_from && dttm_to )
					 ){

				if ( this.dttm_from && this.dttm_to ){
					if ( Date.parse(this.dttm_from) > Date.parse(this.dttm_to) ) 
						msg = "Please input valid date time.";	

					if ( this.dttm_from == this.dttm_to)
						msg = "Date time from and to cannot be equal."
				}	
			}

			//leave
			if ( type == this.TYPE_LEAVE){			
				
				if ( mode == this.LEAVE_SELECTIVE ){  
					if ( ! this.leave.selective_hour) msg = "Please select leave hours value."

				}else if( mode == this.LEAVE_SHIFT ){  					
					if ( ! this.leave.shift_code ) msg = "Please select shift schedule."
				
				}else if( mode == this.LEAVE_DURATION ) {  

					if ( this.leave.in_days && ! this.leave.in_days_value )
						msg = "Please select leave date"
				}

				// ---------------
				// check batch date filing if inDays
				// ---------------
				let chks = getAll("input[name='batch_dates']");
				if ( this.rules.can_batch_filing && this.leave.in_days && chks.length  ){

					chks = getAll("input[name='batch_dates']:checked");
					if (! chks.length){
						msg = "Please select date.";
					}

					let v = [];
					chks.forEach( (e)=>{
						v.push( e.dataset.dt );
					})
					this.leave.selected_batch_dates = v.join();
				}

				if ( ! this.leave.type ) msg = "Please select leave type."
			}

			//sched change
			if ( type == this.TYPE_SC ){
				
				if ( this.sched_change.shift_code == this.sched_change.shift_code_from )
					msg = "From and To shift schedule are the same.";
			}

			// ot
			if ( type == this.TYPE_OT ){

				if ( this.vars.min_ot_hours > 0 && this.time_value.value < this.vars.min_ot_hours ){
					msg = `Minimum Overtime value is ${this.vars.min_ot_hours} `
					msg += + this.vars.min_ot_hours > 1 ? "hours." : "hour."
				}
			}
			
			if ( msg ){
				msgBox(msg)
				return false
			}
			return true
		},

		_selected( action ){

			this.req_no = 0

			let e = get("input[type='radio'][name='req_no']:checked")			
			// console.log( 'selected', e)
			if ( e ){
				this.req_no = e.value		
				return true
			}

			msgBox(`Please select a record to ${action}.`);
			return false
		},

	},

	beforeMount(){	

		this.init()

		// bind to buttons
		let e = getById("edit_req")
		if ( e ) e.onclick = this.edit;		

		e = getById("add_req")
		if ( e ) e.onclick = this.add

		e = getById("delete_req")
		if ( e ) e.onclick = this.delete

		e = getById("team_add_x")
		if ( e ) e.onclick = () => this.add( null, this.SUBMIT_APPROVER_ADD )

		// approver override
		e = getAll("a[name='override_member_req']")
		if ( e ){
			e.forEach((a) => {

        const td = a.parentNode;
        const req_no = td.dataset.no;           
        const member_no = td.dataset.eno;

				a.onclick = (event)=> this.approver_edit(event, req_no, member_no) ;
				
			})
		}

		// approver delete		
		e = getAll("a[name='delete_member_req']")
		if ( e ){
			e.forEach((a) => {

        const td = a.parentNode
        const p = {
        	req_no: 		td.dataset.no,
        	member_no: 	td.dataset.eno, 
        	type_name: 	td.dataset.type,
        	row: 				td.parentElement
        }

				a.onclick = (event)=> this.approver_delete(event, p )
				
			})
		}
		

	}

}).mount("#sched-request")