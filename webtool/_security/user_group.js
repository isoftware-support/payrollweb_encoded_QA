
if ( timer == 'undefined'){
	var timer = 0;
}

const appUG = Vue.createApp({

		// data(){
		// 	return this.init();
		// },
	data(){
		return {
			id: 0,
			name: "",
			description: "",
			error_msg: "",
			title: 'Edit User Group',
			isEdit: false,		
		}
	},

	methods: {
		init(){
			Object.assign(this.$data, this.$options.data());
		},

		save(){

			if ( !this.check() ) return;

			let p = {func:'UG', t:10, d:1, f:'wugname||wugdescription', sep:'||', ses:'select-user-group'}
			p.v = `'${this.name}'||'${this.description}'`
			p.el = 'AllowAddUserGroups'

			if ( this.isEdit ){
				p.d = 0;
				p.xp = `id3=${this.id}`
				p.el = 'AllowEditUserGroups'
				p.id = this.id
			}

			xxhrPost( rootURI + "/ajax_calls.php", p, (res) => {

				const ret = JSON.parse(res)
				if ( ret.error ){
					this.error_message( ret.error )
				}else{
					location.reload()
				}
			})
		},
		

		delete(){

			let e = get("input[type='radio']:checked")
	  	if ( !e ) return

	  	if ( e.value == 1 || e.value == 2 || e.value == 4){

		  	return msgBox( `Unable to delete default user group <strong>${e.dataset.name}</strong>.`)

	  	}else{

		  	msgBox(
					[ {message:"Are you sure you wang to delete '' usergroup?", class:'pb-10'},
		  			{message:"All user for this user group will be delete in Web Users List and this step cannot be undone."}
		  		], 
		  		{ cancelButton: true, okCallBack: this.delete_confirmed}
		  	)
		  }
	  },

		delete_confirmed(){
	
			let e = get("input[type='radio']:checked")

	  	const no = e.value
			let p = { func:'UG', id:no, d:-1}

			xxhrPost( rootURI + "/ajax_calls.php", p, (res) => {
				removeGrandParent(e, true)

				// select 1st radio
				e = get("input[type='radio']");
				if ( e )
					e.checked = true;
			})
		},
		
		check(){

			let msg = ""
			if ( !this.description ) msg="Please input description."
			if ( !this.name ) msg = "Please input user group name."

			this.error_message( msg)
			return !msg
		},

		show( m ){

			if ( m == 0){ // edit
				
				const e = get("input[type='radio']:checked")
				if ( ! e){
					return msgBox( "Please select item to edit.")
				}

				this.id = e.value
				this.isEdit = true
				this.title = 'Edit User Group'									

				// show record
				const p = {func:'GetRec', t:10, f:'wugname||wugdescription', 
					xp:`id3=${this.id}`, rc:1, sep:'||' }

				xxhrPost( rootURI + '/ajax_calls.php', p, (res) => {

					const ret = JSON.parse(res)
					this.name = ret.wugname
					this.description = ret.wugdescription
					this.$refs.f_name.focus()
				})

			}
			
			this.$refs.f_name.focus()
			dimBack(true, 'dim_back', this.hide);
			CenterItem('ug-box')
		},

		hide(){
			this.init()
			dimBack(false, 'dim_back')
			hideItem('ug-box')
		},
		
		error_message( msg ){

			if ( ! msg ) return

			this.error_msg = msg;
			if (timer) window.clearTimeout(timer);
			timer = setTimeout( () => this.error_msg = "", 5000);	  	
	  },

	  load(){
	  	getById('add').onclick = function(){
				proxyUG.show(1)
			}
			getById('edit').onclick = function(){
				proxyUG.show(0)
			}
			getById('delete').onclick = function(){
				proxyUG.delete()
			}

	  }

	}

})

const proxyUG = appUG.mount('#ug-box')
proxyUG.load();

