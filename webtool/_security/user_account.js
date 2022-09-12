

if ( busy == undefined)
	var busy = new BusyGif();

var timer;

const app  =  Vue.createApp({
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

	  	p.v = `${this.employee_no} | '${this.username}' | '${this.password}' | '${this.filed_as}' | `
	  	p.v += `'${this.email}' | ${this.privilege_no} | ${this.email_alert ? 1 : 0}`
	  	p.v = p.v.replaceAll(" | ", p.sep)

	  	if ( this.isEdit ){
	  		p.d = '0';
	  		p.id = this.id
	  	}

	  	xxhrPost( rootURI + "/ajax_calls.php", p, (res)=>{

	 			const ret = JSON.parse(res)
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

	  	const e = get("input[type='radio']:checked");
	  	if ( !e ) return
		  
		  const no = e.value, user = e.dataset.user; 
		  	
		  if ( ! confirm(`Are you sure you want to delete user '${user}'?`) ) return;

		  busy.show2();

		  const p = { func:"UserAccount", d:-1, id:no }
		  xxhrPost( rootURI + "/ajax_calls.php", p, (res)=>{
		  	
		  	// console.log(res);

		  	const ret = JSON.parse(res);
  	  	if ( ret.success ){
					removeGrandParent(e.id);
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
	  	
	  	busy.show2()

	  	this.isEdit = true;
	  	this.title = "Update User Account"
  		this.$refs._employees.innerHTML = emps_edit_list.join("");

      const no = radio.value

	    // get record
	    const p = {func:'GetRec', t:9, xp:`id2=${no}`, sep:'||', rc:1}
	    p.f = 'entryNo,id1,f4,wugno,filedAs,email,alertssumm'.replaceAll(",", p.sep)

	    xxhrPost( rootURI + "/ajax_calls.php", p, (res)=>{
	      
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
	  	dimBack(true, '', this.cancel);
			CenterItem('ua_box');
			
			this.$refs._username.focus()

	  },
	  cancel(){
	  	this.reset()
	  	dimBack(false);
	  	hideItem('ua_box');

	  },
	  randomPass() {

			const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZ{}@;[]!#$%&*()=-_+<>~`";
			const string_length = 8;
			let pass = '';

			for (let i = 0; i < string_length; i++) {
				const rnum = Math.floor(Math.random() * chars.length);
				pass += chars.substring(rnum,rnum+1);	
			}
			this.password = pass
			this.confirm_password = pass

	   	// copy to clipboarad
		  navigator.clipboard.writeText(pass)

		  this.error_message("New password copied to the clipboard.", 4, "c-green")
		},

	  error_message( msg, sec = 5, colorClass = "c-red" ){

	  	this.error_class = colorClass
			this.error_msg = msg;
			if (timer) window.clearTimeout(timer);
			timer = setTimeout( () => this.error_msg = "", sec * 1000);	  	
	  },
	  check_fields(){
			
			let msg = "", e = "";
			if ( !this.privilege_no ) msg = "Please select privilege item."
			if ( !this.email ) 				msg = "Email is empty."
			if ( !this.isEmployee && !this.filed_as ) 		msg = "Filed As is empty."
  		
  		if ( this.password && this.password != this.confirm_password )
  			msg = 'Please confirm the password. Password did not match.'

	  	if ( ! this.isEdit ){
	  		if ( !this.password ) 	msg = "Password is empty."
	  	}
			if ( !this.username ){
				msg = "Please input username."
			}

	  	if (msg){
	  		this.error_message(msg)

	  		return false
	  	}
	  	return true

	  },

	  name_change(){	  	
	  	this.isEmployee = this.employee_no > 0 ? true : false
	  	// console.log( this.isEmployee)
	  },

		reset(){
				
				const initData = this.init()

		  	const keys = Object.keys(this)
		  	keys.forEach( (name)=>{
		  		if ( typeof this[name] !== 'function' ){
		  			this[name] = initData[name];
		  		}
		  	})

		},

	  load(){

			this.$refs._privileges.innerHTML = privileges_list.join("");

			// bind add button
			getById('add_user').onclick = function(){
				proxy.add();
			}

			getById('edit_user').onclick = function(){
				proxy.edit();
			}

			getById('delete_user').onclick = function(){
				proxy.delete();
			}

	  }

	}
})

const proxy = app.mount('#user-account')
proxy.load();




