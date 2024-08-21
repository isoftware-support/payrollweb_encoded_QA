

{
	const body = get("body");
	if (body){

		// reim detail
		let div = document.createElement('div');
		div.id = "reimb-request";	
		body.appendChild(div);
	}
}

// override_verify_amount
if ( typeof override_verify_amount == 'undefined'){
	override_verify_amount = 0;
}


busy = new BusyGif()	

const reimDetail = Vue.createApp({

	template: `

		<div id='reimb-request-ui' class='modal-box bg-white reimb-detail-width p-5' style="left: -999">
			
		<fieldset class="wp-99 p-20">
		<legend>Reimbursement Request</legend>

			<!-- no -->
			<div v-if="mode == VIEW || mode == EDIT" class="flex ml-5">
				<div class="reim-label">
					<label class="">No:</label>
				</div>
				<div class="reim-data">
					<p  class="lh-15 fs-n bold h5">{{nos}}</p>
				</div>
			</div>

			<!-- payee  -->
			<div class="flex ml-5">

				<div class="reim-label">
					<label class="pr-5 ">Payee:</label>
				</div>

				<div class="reim-data flex">					
					<div class="autocomplete wp-100 flex-7">
						<input id="payee" ref='payee' type="text" v-model='payee' class="wp-100">						
					</div>
					<button v-show="mode == ADD" type="button" id="add-payee" class="button w-30 ml-3 h-18">+</button>
					<a v-show="mode == EDIT && can_edit_payee" href="#" class="px-5" id="edit-payee" title="Edit Payee">
						<img src="img/edit2.png" class="h-15" alt="">
					</a>
				</div>
			</div>

			<!-- tin -->
			<div class="flex ml-5">
				<div class="reim-label">
					<label >TIN:</label>
				</div>
				<div class="reim-data flex">
					<input type="text" name="" class='w-150 bg-lightgrey-3' v-model='tin' readonly ref='tin'>
					<input class='ml-5' type="checkbox" id='vat' v-model='vat' @change="compute_vat" :disabled="mode == VIEW">
					<label class="ml-3 mt-3"  >VAT</label>
				</div>
			</div>

			<!--  particular -->
			<div class="flex ml-5">
				<div class="reim-label">
					<label >Particulars:</label>
				</div>
				<div class="reim-data">
					<input type="text" class='wp-100' v-model='particulars' ref="particulars">
				</div>
			</div>

			<!-- description -->
			<div class="flex ml-5">
				<div class="reim-label">
					<label class="lh-50" >Description:</label>				
				</div>
				<div class="reim-data">
						<textarea rows=3 v-model='description' ref="description"></textarea>
				</div>
			</div>

			<!-- invoice date -->
			<div class="flex ml-5">
				<div class="reim-label">
					<label >Invoice Date:</label>
				</div>
				<div class="reim-data">
					<input type="date" class='EditBox w-120' v-model='date' ref='date'>
				</div>
			</div>

			<!-- ref -->
			<div class="flex ml-5">
				<div class="reim-label">
					<label >Invoice Reference:</label>
				</div>
				<div class="reim-data">
					<input type="text" class='w-120' v-model='ref' ref='ref'>
				</div>
			</div>

			<!-- amount -->
			<div class="flex ml-5">
				<div class="reim-label">
					<label >Amount:</label>
				</div>
				<div class="reim-data">
					<label v-show="mode == VIEW" class="fw-110 lh-15 border-1 px-5" >{{ stringAmount }}</label>
					<input v-show="mode != VIEW" type="number" class='EditBox w-120' ref='amount' v-model='amount' @keyup="compute_vat" >
				</div>
			</div>

			<!-- approved amount  -->
			<div  v-if="verify.isOverrideAmount" class="flex ml-5">
				<div class="reim-label">
					<label >Approved Amount:</label>
				</div>
				<div class="reim-data">
					<input v-if="verify.isCanVerify" type="number" class='EditBox w-120' ref='approved_amount' v-model='approved_amount' >
					<label v-else class='fw-110 lh-15 border-1 px-5' >{{ verify.amount }}</label>
				</div>
			</div>

			<!-- Net of vat -->
			<div class="flex ml-5">
				<div class="reim-label">
					<label >Net of VAT Amount:</label>
				</div>
				<div class="reim-data">
					<label class='fw-110 lh-15 border-1 px-5' >{{ net_of_vat}}</label>
				</div>
			</div>

			<!-- vat amount -->
			<div class="flex ml-5">
				<div class="reim-label">
					<label >VAT Amount:</label>
				</div>
				<div class="reim-data">
					<label class='fw-110 lh-15 border-1 px-5' >{{ vat_amount }}</label>
				</div>
			</div>

			<!-- browse button -->
			<div class="flex ml-5">
				<div class="reim-label">
					<label class='lh-20'>{{ mode == VIEW ? 'Uploaded Picture' : 'Upload Picture' }}:</label>
				</div>
				<div class="reim-data">
					<div class="flex ">

						<input type="file" name="att_file" id="att_file" @change="pickFile" accept="image/*" class="d-none" > 
					  <input v-if="mode != VIEW" class="button w-100 mr-5" type="button" value="Browse" onclick="document.getElementById('att_file').click();" />  		

						<a v-show="att_file" id="att_file_link"  class="link_simple mt-3" href="#" > {{ att_file }}</a>
						<label v-if="local_att_file" class='bold mt-3'>{{ local_att_file }}</label>
						<label v-if="! att_file && mode == VIEW" class='bold mt-3 '>No attachment</label>
					</div>
				</div>
			</div>

			<!-- status -->
			<div v-if="mode == VIEW" class="flex ml-5">
				<div class="reim-label">
					<label class="pr-5">Status:</label>
				</div>
				<div class="reim-data">
					<p  class="lh-15 fs-n" v-html="status_text"></p>
				</div>
			</div>

			<!-- buttons -->
			<div class="flex flex-justify-center mt-20">
				<button v-if="mode !== VIEW" type='button' class='mr-5' @click="save">Submit</button>
				
				<!-- Mark as unverify - only when verify approval is empty-->
				<button v-if="verify.isCanUnverify" class="mr-5" @click="verifyOrUnverify(event, DISAPPROVED)">Mark as Unverified</button>

				<!-- verify amount -->
				<button v-if="verify.isCanVerify" class="mr-5"  @click="verifyOrUnverify(event, APPROVED)">Mark as Verified</button>

				<!-- compare method is in reimbursement_item_view.js -->
				<button v-show="mode == VIEW && with_image" type='button' id='btn-compare' class="mr-5" >Compare</button>

				<button type='button' class='mr-5' @click="cancel">{{ exit_caption }}</button>
			</div>

		</fieldset>
		</div>
	`,

	data() {
		return {
		  detail_no: 0,
			payee: '',
			payee_no: 0,
			tin: '',
			vat: false,
			particulars: '',
			description: '',
			date: '',
			ref: '',
			amount: 0,
			string_amount: '',
			approved_amount: '',
			net_of_vat: 0,
			vat_amount: 0,		
			with_image: false,
			payee_class: 'wp-100',
			att_file: '',
			local_att_file: '',
			mode: 0,
			exit_caption: 'Cancel',
			status_text: '',		
			is_saving: false,	
			
			verify: { 
					isVerifyMode: false,    // team approver view
					status: 0, 
					amount: 0,
					isCanVerify: false,
					isCanUnverify: false,
					verifierCode: '',
					isOverrideAmount: parseInt(override_verify_amount) ? true : false,
			},

			approval:{ status: 0, amount: 0 },

			main_approval:{ status: 0},
		  
		  can_add: true,
		  can_edit_payee: (typeof can_edit_payee == 'undefined') ? false : can_edit_payee,
		  nos: '',

		  // constant vars
		  ADD: 1, EDIT: 0, DELETE: -1, VIEW: 2, APPROVED: 1, DISAPPROVED: -1, APPROVAL_NONE: 0,
		}
	},
	
	methods: {
						
		init(){
			Object.assign( this.$data, this.$options.data() )			
		},

		add( is1stItem = false ){

			this.init()
			this.mode = this.ADD			
			this._show();
			this._readOnly(false)			
			this.is1stItem = is1stItem;  			
		},

		save(){

			if ( this.is_saving ) return

			// re select payee
			this._setPayee();			
			if ( ! this._checkEntry() ) return;

			this.is_saving = true

			busy.show2();

			const p = {func: 'SaveRecItem' }
			p.d = this.mode
			p.first_item = this.is1stItem ? 1 : 0;

			p.payee_no = this.payee_no
			p.vat = this.vat  ? 1 : 0
			p.part = uriString( this.particulars )
			p.desc = uriString( this.description )
			p.date = uriString( this.date )
			p.ref = uriString( this.ref )
			p.amount = this.amount
			p.net = this.net_of_vat;
			p.vat_amount = this.vat_amount			
			p.x = 1

			const postIt = () => {
				xxhrPost( rootURI + '/_reimbursements/reimbursement_request.php', p, (res)=>{

					busy.hide();
					
					// console.log('res ', res)
					const ret = JSON.parse(res);			
					// console.log( 'ret ', ret)

					if ( ret.err ){
						return msgBox( ret.err );
					}

					if ( this.is1stItem ){				
						// view recurring details
						location.href = rootURI + '/index.php?qid=07c';
					}else{					
						location.reload();
					}

				})
			}

			// file
			const file = getById('att_file')		
			if ( file.files.length ){

				const att = file.files[0]
				p.att_file = att

				resizeImageQuality(att, maxImageFileSize, (blob) => {

					if (blob != null ){
						p.att_file = new File([blob], att.name, { type: att.type });						
					}
					// console.log(' resize post', 'file:', blob, p.att_file)
					postIt()						
				})

			}else{
				// console.log( ' no files post')
				postIt()
			}

		},

		edit(){
			
			this.init()

			if ( ! this._selected() ) return;
			this.mode = this.EDIT			

			this.nos = reim_no.padStart(5,"0") + " - " + this.detail_no;
			this.getRecord(this.detail_no, this._show )
			this._readOnly(false)
		},

		delete( isMain = false ){
			
			this.isMain = isMain
			if ( ! this._selected( true ) ) return;

			const deleteAction = () => {

				busy.show2();

				const p = {func:'DelRecItem', rd: this.detail_no }

				if ( isMain ){
					p.func = 'DelRecMain'
				  p.rn = this.reim_no
				}

				xxhrPost( rootURI + '/_reimbursements/reimbursement_request.php', p, (res)=>{

					busy.hide();
					
					const ret = JSON.parse(res)

					if ( ret.err ){
						msgBox( ret.err );
						return
					}

					if ( ret.redirect ){
						location.href = ret.redirect;						
					}else{
						location.reload();
					}
				})
			}

			msgBox("Are you sure you want to delete this Request?", 
				{ cancelbutton: true, okCallBack: deleteAction } )

		},
		
		view(event){

			event.preventDefault()
			
			this.init()

			const e = event.target;
			this.mode = this.VIEW
			this.exit_caption = "Close"

			// emp or approver view mode
			this.verify.isVerifyMode = (e.dataset.mode == 'verify') ? true: false
			this.verify.verifierCode = e.dataset.code

			this.nos = reim_no.padStart(5, "0") + " - " + e.dataset.no;
			this.getRecord( e.dataset.no, this._show )									
			this._readOnly(true)

		},

		pickFile(event){
			
			let filename = ""
			if ( checkAttachment(event.target, "", maxFileSize, true) )
				filename = event.target.files[0].name;

			this.att_file = ""
			this.local_att_file = filename

		},

		cancel(){

	  	dimBack(false, 'dim_back');
	  	hideItem('reimb-request-ui');
		},

		verifyOrUnverify(event, approval = 0){

			let amount = 0;

			if ( ! this.verify.isOverrideAmount ){				
				amount = this.amount

			}else{

				if ( this.approved_amount <= 0 && approval == this.APPROVED ){
					msgBox("Invalid approved amount.", {
						okCallBack: () => this.$refs.approved_amount.focus()
					})
					return;
				}

				amount = this.approved_amount
				if (amount > this.amount ) amount = this.amount;

			}

			// console.log( 'isOverrideAmount', this.verify.isOverrideAmount, 'approval', approval)
			// return

			const url = rootURI + '/_approvals/reimbursement_verify_approval.php?' +
				`rd=${detail_no}&stats=${approval}&apramt=${amount}&tl=${apr_no}`;
			xxhrGet( url, (res) => {
				// console.log('res', JSON.parse(res))
		    location.reload();				
			})

		},

		compute_vat( event ){
			
			let net = this.amount, vat = 0;

			if( this.vat && this.amount > 0 ){
				
				vat = 0
				net =  (this.amount - 0 ) / vat_rate;
			  net = Math.round(net * 100) / 100;
				
				if( net > 0 ){					
					vat = this.amount - net;
					vat = Math.round(vat * 100) / 100				
				}
			}
			
		 	this.net_of_vat = NumberFormat(net)
			this.vat_amount = NumberFormat(vat);
			
		},

		new_added_payee( newPayeeId ){

			// called from payee vuew app
			busy.show2();

			const select_new_payee = ()=>{
				this._setPayee( newPayeeId )
				busy.hide()
			}

			this._loadPayees( select_new_payee );
		},

		getRecord( _detail_no, callBack  ){
			
			busy.show2()
					
			let url = rootURI + `/_reimbursements/reimbursement_request.php?func=GetRecItem&dn=${_detail_no}`		
			url = url + (`&vcd=${this.verify.verifierCode}`)

			xxhrGet( url, (res)=>{
								
				const ret = JSON.parse(res);
				const detail = ret.res;
				
				// console.log('detail', ret, url)

				this.payee = detail.payee_name
				this.payee_no = detail.payee_no
				this.tin = detail.tin
				this.vat = parseInt(detail.vat) ? true: false;
				this.particulars = detail.particulars
				this.description = detail.description
				this.date = detail.invoice_date
				this.ref = detail.invoice_ref
				this.amount = detail.amount
				this.net_of_vat = detail.net_of_vat
				this.vat_amount = detail.vat_amount
				this.compute_vat(null);
				this.status_text = detail.status_text
				this.with_image = detail.with_image

				// public var - used too in reimbursement_item_view.js
				encoded_detail_no = detail.encoded_detail_no;
				detail_no = _detail_no;

				// attachment
				if (detail.with_image){
					this.att_file = "Attachment"

					// pic viewer
					const src = rootURI + `/reimbursephoto.php?h=1&rd=${encoded_detail_no}&rn=${encoded_reim_no}`;				

					const params = { prefix: 'view-img', rootFolder: rootURI, src: src, outsideButtons: true};
					const view_att_file = new PicViewer( params );			
					view_att_file.showOnClickOf( 'att_file_link')

				}else{
					this.att_file = ""
				}
				
				// console.log( 'verify mode',this.verify)
				if ( this.verify.isVerifyMode ){

					// verify status
					let status = detail.image_approval_status
					if ( status ){					
						
						this.verify.verified = true
						this.verify.status = status
						
						if ( detail.amount_approved) this.verify.amount = NumberFormat(detail.amount_approved)

						if ( status == this.DISAPPROVED ) this.verify.isCanVerify = true

						if ( status == this.APPROVED ) this.verify.isCanUnverify = true

					}else{
						
						// blank verification
						if ( detail.is_verifier ){
							this.verify.isCanVerify = true
							this.verify.isCanUnverify = true
						}

					}

					// approval status
					if ( detail.amount_approval_status || detail.is_main_with_approval){

						this.approval.status = detail.amount_approval_status
						this.approval.amount = detail.amount_approved

						this.verify.isCanVerify = false
						this.verify.isCanUnverify = false
					}

				}

				// console.log( 'verify', this.verify)
				callBack();

				busy.hide();
			});
		},

		_hide(){
			hideItem('reimb-request-ui');
	  	dimBack(false, 'dim_back');
		},

		_show(){
	  	dimBack(true, 'dim_back', () => this.cancel() );
			CenterItem('reimb-request-ui');

			// console.log('approved amount',this.$refs.approvedAmount)
			if ( this.isVerify ) this.$refs.approved_amount.focus()
		},

		_selected( isDelete = false){

			let ret = false;

			this.detail_no = 0;
			this.reim_no = 0;

			const e = get("input[type='radio']:checked");
			if ( e ){
				if ( this.isMain ){
					this.reim_no = e.value
				}else{
					this.detail_no = e.value;
				}
				ret = true;
			}else{
				const action = isDelete ? "delete.": "edit."
				msgBox("Please select record to " + action );
			}
			return ret
		},

		_setPayee( payeeId = 0){
			
			let name = this.$refs.payee.value
			this.payee = name
			this.tin = ""

			let payee;
			if ( payeeId ){
				/*
					called when new payee added
				*/
				this.payee = "" 	// payee name
				payee = this._payees.find( (payee) => parseInt(payee.no) == parseInt(payeeId) )							

			}else{
				payee = this._payees.find( (payee) => payee.name == name )			
			}

			if ( payee ){

				// payee name
				if (! this.payee ) this.payee = payee.name;

				this.payee_no = payee.no
				this.tin = payee.tin
				this.vat = parseInt(payee.vat) ? true : false

				this.compute_vat();
			}		
			// console.log( 'payee', payee)
		},

		_checkEntry(){
			
			let e = null			
			if ( this.amount <= 0) e = this.$refs.amount
			if ( ! this.ref.trim() ) e = this.$refs.ref
			if ( ! this.date.trim() ) e = this.$refs.date
			if ( ! this.description.trim() ) e = this.$refs.description
			if ( ! this.particulars.trim() ) e = this.$refs.particulars
			if ( ! this.tin.trim() ) e = this.$refs.payee
			if ( ! this.payee.trim()) e = this.$refs.payee					

			if ( e !== null ){
				this._empty_element = e
				msgBox("Please check your entry.", {okCallBack: ()=>{ e.focus() } })
				return false;
			}

			return true;
		},

		_readOnly( bln ){
			
			this.$refs.amount.disabled = bln;
			this.$refs.ref.disabled = bln;
			this.$refs.date.disabled = bln
			this.$refs.description.disabled = bln
			this.$refs.particulars.disabled = bln
			this.$refs.payee.disabled = bln	
		},

		_loadPayees(callBack=""){

			const url = rootURI + "/_reimbursements/reimbursement_request.php?func=GetPayees"
			xxhrGet( url, (res)=>{

				// console.log('res', res);
				const ret = JSON.parse(res)

				// collect payees
				const payees = []
				const names = []
				for( key in ret.res){

					const payee =  ret.res[key];
					names.push( payee.name )
					payees.push( payee )

				}
				this._payees = payees;
				
				autocomplete( "payee", names, this._setPayee);				

				if ( callBack ) callBack()

			});
		}

	},
	
	computed:{

		stringAmount(){
			let s = 0;
			if ( this.amount ) s = NumberFormat(this.amount)
			return s;
		},
	},

	created(){

		// load payees		
		this._loadPayees();
	},

	beforeMount(){		

		// bind button events
		let e;

		// add reim detils
		e = getById("add_reimb");
		if ( e ) e.onclick = ()=> this.add();

		/*
		add 1st reim item from main reim window
		*/
			// add button
			e = get("input[id='addlang']")
			if ( e ) e.onclick = ()=> this.add( true )		
			// floating button add button
			e = get("a[id='addlang']")
			if ( e ) e.onclick = ()=> this.add( true )					

		// edit
		e = getById("edit_reimb");
		if ( e ) e.onclick = ()=> this.edit();

		// delete
		e = getById('delete_reimb');
		if ( e ) e.onclick = ()=> this.delete();		

		/*
		delete from main reimbursement page
		*/
			e = get("input[id='deletelang']")
			if ( e ) e.onclick = () => this.delete( true )

			e = get("a[id='deletelang']")
			if ( e ) e.onclick = () => this.delete( true )

		// back
		e = getById("reim_detail_back")
		if ( e ) e.onclick = () => window.location='index.php?qid=07b'

		// link view event
		let es = getAll(".reim_view");
		if ( es ){
			es.forEach((e)=>{				
				e.onclick = () => {
					this.view(event)
				}
			})
		}	
		
	},


}).mount("#reimb-request")


