
{ 
	const body = get("body");
	if (body){

		// payee
		let div = document.createElement('div');
		div.id = "reimb-payee";	
		body.appendChild(div);

	}
}

busy = new BusyGif()	

Vue.createApp({

	template: `

		<div id='reimb-payee-ui' class='modal-box bg-white wp-80 wmx-400 p-5 d-block' style="left: -999; z-index: 300">
		<fieldset class="p-20">
		<legend>Payee Details</legend>

			<div class="ml-5 ">

				<div class="aligner">
					<label >Payee:</label>
					<input class="ContentTextNormal" size="42" type="text" ref="payee" v-model="payee"
						autocomplete="off" id="payeex" >
				</div>

				<div class="aligner">
					<label >TIN: </label>
					<input class="w-200" type="text" id="tin" ref="tin" 
						v-model='tin' placeholder="###-###-###-###"   pattern = d{3}-d{3}-d{3}-d{3} autocomplete="off" >
					<input class="mx-5" type="checkbox" id="chkvats" ref="vat" v-model="vat"> 
					<label>VAT</label>
				</div>

				<div class="aligner">
					<label>Address1:</label>
					<textarea ref="address1" rows=2 cols=39 v-model="address1" ></textarea>
				</div>

				<div class="aligner">
					<label>Address2:</label>
					<textarea ref="address2" rows=2 cols=39 v-model="address2" ></textarea>
				</div>

				<div class="aligner">
					<label>City: </label>
					<input type="text" ref="city" v-model="city" size="30">
				</div>


				<div class="aligner">
					<label>Province: </label>				
					<input type="text" ref="province" v-model="province" size="30" >
				</div>

				<div class="aligner">			
					<label>Zip: </label>
					<input type="text" ref="zip" v-model="zip" size="30" >
				</div>
				
				<div class="aligner">
					<label>Country: </label>		
					<select id="country" ref="country" v-model="country" >			
					</select>
				</div>

				<div class="flex flex-justify-center py-5">
					 <input class='Button mr-5' type='button' @click='save' value='Save'/>
					 <input class='Button' type='button' value='Close'  @click="close"/>
				</div>
			</div>

		</fieldset>
		</div>
	`,

	data(){
		return{
			payee_no: 0,
			payee: '',
			tin: '',
			vat: false,
			address1: '',
			address2: '',
			city: '',
			province: '',
			zip: '',
			country: '',
			ADD: 1, EDIT: 0,
			mode: 1,   // add mode
		}
	},

	methods:{
		init(){
			Object.assign( this.$data, this.$options.data() )			
		},

		add(){
			this.init()
			this.show()
		},

		edit(){
			
			this.init();

			const no = reimDetail.$data.payee_no		
			xxhrGet( rootURI + `/_reimbursements/reimbursement_request.php?func=GetPayee&n=${no}`, (res) => {

				// console.log('res', res)
				let ret = JSON.parse(res).res
				// console.log(ret)
				
				this.payee_no = no
				this.payee = ret.name
				this.tin = ret.tin
				this.vat = parseInt(ret.vat) ? true : false
				this.address1 = setDefault( ret.address1 )
				this.address2 = setDefault(ret.address2)
				this.city = setDefault( ret.city )
				this.province = setDefault( ret.province )
				this.zip = setDefault( ret.zip )
				this.country = setDefault( ret.country )

				this.show()

				this.mode = this.EDIT
			})

		},

		save(){

			if ( ! this._checkEntry() ) return

			const p = {func: 'x', t:18, d:1, sep:"|:|" }
			p.f = "Name, tin, vat, Address1, Address2, City, Province, Zip, Country".replaceAll(", ", p.sep)

			const vat = this.vat ? 1 : 0
			p.v = String(`${this.payee}|| ${this.tin}|| ${vat}|| ${this.address1}|| ${this.address2}|| ` +
				`${this.city}|| ${this.province}|| ${this.zip}|| ${this.country}`).replaceAll("|| ", p.sep)

			// event log
			p.el = 'AllowEditReimbursementsPayee'
			p.el_1l = 'Action'
			p.el_1v = 'New Payee Added'

			if ( this.mode == this.EDIT ){
				p.d = this.mode
				p.xp = `f11=${this.payee_no}`
			}

			xxhrPost(rootURI + "/ajax_calls.php", p, (res) =>{				
				// console.log( 'res', res)	
				if ( typeof reimDetail == "object" ){

					let id = res
					if ( this.mode == this.EDIT) id = this.payee_no
							
					// select new payee				
					reimDetail.new_added_payee(id)
					this.close()

				}
			})


		},
		close(){
			hideItem('reimb-payee-ui');
	  	dimBack(false, 'dim_it');			
		},

		show(){
	  	dimBack(true, 'dim_it', ()=> this.close(), '', .3, 299);
			CenterItem('reimb-payee-ui');			
		},

		_checkEntry(){

			let e
			if ( ! this.address1) e = this.$refs.address1
			if ( ! this.tin ) e = this.$refs.tin
			if ( ! this.payee ) e = this.$refs.payee	

			if ( e ){

				const focusBlank = () => e.focus() 
				msgBox("Please check your entry.", 
					{okCallBack: focusBlank } )
				return false;
			}
			return true
		}
	},

	mounted(){
		this.country = "Philippines"
		print_country( this.$refs.country.id)

	},

	beforeMount(){
		
		// bind to add payee object
		let e = getById("add-payee")
		if (e) e.onclick = () => this.add()
		
		// bind to edit payee object
		if ( reimDetail.$data.can_edit_payee ){
			e = getById("edit-payee")
			if (e) e.onclick = () => this.edit()
		}
	}

}).mount("#reimb-payee")