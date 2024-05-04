
{

	let body = get("body");

	let div = document.createElement('div');
	div.id = "user-account";	
	body.appendChild(div);

}

if ( busy == undefined)
	var busy = new BusyGif();

var timer;


Vue.createApp({

	template: `

	<div id='ua_box' class='modal-box bg-white p-20 w-350'  style="left:-999">
		<form @submit.prevent='save' method="post">

		<fieldset class=' p-20' width='87%'>
	  	<legend id='ua_caption' >{{ title }}</legend>
		
			<div class="aligner">
			<label class='fw-100 '>Employee:</label>
			<select v-model='employee_no' @change='name_change' ref='_employees'  class='flex-1'>
			</select>
			</div>

			<div class="aligner" v-show='! isEmployee'>
			<label class='fw-100 '>Filed As:</label>
			<input v-model='filed_as' type="text"  class="flex-1" ref="_filedas">
			</div>

			<div class="aligner">
			<label class='fw-100 '>Email</label>
			<input v-model='email' type="email" ref="_email"  class="flex-1 EditBox">
			</div>

	  	<div class="aligner ">
			<label class='fw-100'>Username:</label>	
			<input v-model="username" type="text"  ref='_username' class="flex-1" >
			</div>
			  
			<div class="aligner">
			<label class='fw-100 '>Password:</label>
			<input v-model='password' type="password" ref="_password"  class="flex-1">
			<input @click="randomPass"class='button w-50 ml-5' type="button" value='Reset' tabindex="-1">
			</div>
			
			<div class="aligner">
			<label class='fw-100 '>Confirm Password:</label>
			<input v-model='confirm_password' type="password" ref="_password_confim"  class="flex-1">
			</div>

			<div class="aligner">
			<label class='fw-100 '>Privileges:</label>
			<select v-model='privilege_no' ref='_privileges' class='flex-1' :value='privilege_no'></select>
			</div>

			<br>
			<div class='aligner'>
			<input  v-model='email_alert' id='email_alert' class='mr-5'   type="checkbox"/>
			<label for="email_alert">Email user of changes to account information.</label>
			</div>
			<br>

			<div class="aligner flex-justify-center">
				<button  type='submit' class="button mr-5">Save</button>
				<input @click='cancel' type="button" value="Cancel" class="button" >
			</div>

			<div  v-html="error_msg" v-show="error_msg" :class="error_class" class=' ta-c pt-10' style='font-weight: normal; width: 280px;'>
			</div>

		</fieldset>	
		</form>
	</div>
	`,

	data(){
			return this.init();
	},
	
	methods:{

		init(){
			return {
		  	title: "Add User Account",
		  	id: -1,
		    username: "",
		    password: "",
		    confirm_password: "",
		    employee_no: -1,
		    isEmployee: false,
		    filed_as: "",
		    email: "",
		    privilege_no: -1,
		    email_alert: false,
		    isEdit: false,	  
		    error_msg: "",
		    error_class: ""		    
		  }
		},

	  save(){
	  	
	  	if ( ! this.check_fields() ) return

	  	busy.show2();

	  	let p = {func:'UserAccount', d:1, sep:'||' };
	  	p.f = "id1, f4, f5, filedas, email, wugno, alertssumm".replaceAll( ", ", p.sep )

	  	p.v = `${this.employee_no} | '${this.username}' | '${this.password}' | '${this.filed_as}' | `;
	  	p.v += `'${this.email}' | ${this.privilege_no} | ${this.email_alert ? 1 : 0}`
	  	p.v = p.v.replaceAll(" | ", p.sep)

	  	if ( this.isEdit ){
	  		p.d = '0';
	  		p.id = this.id
	  	}
	  	
	  	if ( this.email_alert )
	  		this.error_message("Sending account info email to user.", 20, "c-green")

	  	xxhrPost( rootURI + "/ajax_calls.php", p, (res)=>{

	 			const ret = JSON.parse(res) 			
	 			console.log('ret', ret)
	 			
	  		if ( ret.errors ){	  	
	  			let sec = ret.errors.length * 3;
	  			sec = sec < 5 ? 5 : sec

	  			const errors = ret.errors.map((msg)=> `<div class='mb-5'>${msg}</div>` )
	  			this.error_message( errors.join(""), sec)
	  			busy.hide();

	  		}else{
		  		location.reload();
	  		}

	  	})
		
	  },

	  delete(){

		  busy.show2();
		  
		  const e = get("input[type='radio']:checked");
		  const no = e.value, user = e.dataset.user; 

		  const p = { func:"UserAccount", d:-1, id:no }
		  xxhrPost( rootURI + "/ajax_calls.php", p, (res)=>{
		  	
		  	// console.log( 'res', res);
		  	
		  	const ret = JSON.parse(res);
  	  	if ( ret.success ){
  	  		location.reload();
					// removeGrandParent(e.id);
		  	}
		  	busy.hide();
		  })
		  
	  },
		add(){

			this.reset()			
			this.$refs._employees.innerHTML = emps_add_list.join("");
			this.show()

 		},
	  edit(){
	  	
	  	const radio = get("input[type='radio']:checked");
	  	if ( ! radio ) return;

	  	const no = radio.value

	  	busy.show2()

	  	this.isEdit = true;
	  	this.title = "Update User Account"
  		this.$refs._employees.innerHTML = emps_edit_list.join("");

      

	    // get record
	    const p = {func:'GetRec', t:9, xp:`id2=${no}`, sep:'||', rc:1}
	    p.f = 'entryNo,id1,f4,wugno,filedAs,email,alertssumm'.replaceAll(",", p.sep)

	    xxhrPost( rootURI + "/ajax_calls.php", p, (res)=>{
	      
	      // console.log('res', res);      
	      
	      const ret = JSON.parse(res)
	      this.id = no
	      this.username = ret.f4
	      this.employee_no = ret.id1
	      this.isEmployee = ret.id1 > 0 ? true : false;
	      this.filed_as = ret.filedAs
	      this.email = ret.email
	      this.privilege_no = ret.wugno
	      this.email_alert = ret.alertssum ? true : false

	      this.show()
	      busy.hide();

	    });

	  },
	  show(){
	  	dimBack(true, 'dim_back', () => this.cancel() );
			CenterItem('ua_box');
			this.$refs._employees.focus()

	  },
	  cancel(){

	  	this.reset()
	  	dimBack(false, 'dim_back');
	  	hideItem('ua_box');

	  },
	  
	  randomPass() {

	  	busy.show2();

			xxhrPost( rootURI + "/ajax_calls.php", {'func': 'GenPass'}, (res)=>{
				
				const ret = JSON.parse(res)
				const pass = ret.result;

				this.password = pass
				this.confirm_password = pass

		   	// copy to clipboarad
			  navigator.clipboard.writeText(pass)

			  this.error_message("New password copied to the clipboard.", 4, "c-green")

			  busy.hide();

			});
		},

	  error_message( msg, sec = 5, colorClass = "c-red" ){

	  	this.error_class = colorClass
			this.error_msg = msg;
			if (timer) window.clearTimeout(timer);
			timer = setTimeout( () => this.error_msg = "", sec * 1000);	  	
	  },

	  check_fields(){
			
			let msg = "", e = "";
			
			if ( this.privilege_no < 0 ) msg = "Please select privilege item."

  		if ( this.password && this.password != this.confirm_password )
  			msg = 'Please confirm the password. Password did not match.'

	  	if ( ! this.isEdit ){
	  		if ( !this.password ) 	msg = "Password is empty."
	  	}

			if ( !this.username ) msg = "Please input username."

			if ( !this.email ) 				msg = "Email is empty."
			if ( !this.isEmployee && !this.filed_as ) 		msg = "Filed As is empty." 		

	  	if (msg){
	  		this.error_message(msg)
	  		return false
	  	}
	  	return true
	  },

	  name_change(){	  	
	  	
	  	this.isEmployee = this.employee_no > 0 ? true : false

	  	this.email = emps_email[ this.employee_no ];
			this.username = emps_init_usernames[ this.employee_no ];
	  },

		reset(){

			// set blank to all properties				

			let initData = this.init();

	  	const keys = Object.keys(initData)

	  	keys.forEach( (name)=>{
	  		this[name] = initData[name];
	  	})

		},

	},

  mounted(){

		this.$refs._privileges.innerHTML = privileges_list.join("");
	},

	beforeMount(){

		// bind add button
		let e = getById('add_user')
		if ( e) e.onclick = this.add
		
		e = getById('edit_user')
		if ( e ) e.onclick = this.edit
		
		e = getById('delete_user')
	  if (e){
	  	e.onclick = () => {
		  	const e = get("input[type='radio']:checked");
		  	if ( !e ) return
			  
			  const no = e.value, user = e.dataset.user; 
			  
			  msgBox(`Are you sure you want to delete user '${user}'?`, 
			  	{okCallBack: this.delete, cancelButton: true}
			  )
			}
		}

		// row event
		e = getAll("tr[name='user-entry']")
		if ( e ){
			
			e.forEach( (el) => {
				el.style.cursor = "pointer"

				el.onclick = () => {
					const id = "rdo_" + el.dataset.no
					getById(id).checked = true
				}

				el.ondblclick = () => {
					this.edit()
				}
			})
			
		}

  }

}).mount('#user-account')




