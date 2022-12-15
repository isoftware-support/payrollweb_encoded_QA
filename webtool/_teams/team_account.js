

if ( busy == undefined)
	var busy = new BusyGif();

const team_account = Vue.createApp({

	template : `

		<!-- <div class="bg-white p-10 w-400" > -->
		<div id="team-info" class='modal-box bg-white p-10 w-400'  style="left:-999">
			<fieldset class="py-20">
			<legend>{{title}}</legend>

				<div class="aligner">
				<label for="name" class="fw-70" >Name:</label>
				<input id="name" type="text" v-model="name" class="ContentTextNormal wp-80" autocomplete="off">
				</div>

				<div class="aligner">
				<label for="desc" class="fw-70">Description:</label>
				<textarea id="desc" v-model="description" rows=3 class="ContentTextNormal wp-80">
				</textarea> 
				</div>			
			</fieldset>

			<div class="flex flex-justify-center pt-10 pb-5">
				<button type="button" class="mr-5" @click="save">Submit</button>
				<button type="button" @click="cancel" >Cancel</button>
			</div>
		</div>
	`,

	data(){
			return {
				title : "Update Team Details",
				name : "",
				description : "",
				mode : 0,			// 0 = edit, 1 = add, -1 = delete
				teamNo : 0,
			}
	},

	methods : {

		save(){

			busy.show2();

			const p = {func: 'x', t:14, sep: "||" }
			p.f = "f9, f8".replaceAll(", ", p.sep)
			p.v = `${this.name}, ${this.description}`.replaceAll(", ", p.sep)

			if ( this.mode == 0){	// edit

				const e = get("input[type='radio']:checked");
				if ( ! e){
					return msgBox("Please select a team to edit.")
				}

				p.d = '0';
				p.el = 'AllowEditTeams'
				p.xp = "id4=" + e.value

			}else if( this.mode == 1){ // add
				p.d = 1;
				p.el = 'AllowAddTeams'

			}

			xxhrPost( rootURI + "/ajax_calls.php", p, (res)=>{

				// console.log( res);
				location.reload()
			});
		},
		
		delete(){

			busy.show2();

			const p = {func:'x', d:-1, t:14, tx:'15||16', xp:'id4=' + this.teamNo,
				sep:'||', el:'AllowDeleteTeams'}

			xxhrPost( rootURI + "/ajax_calls.php", p, (res)=>{

				 // console.log( res);
				location.reload()

			});
		},

		show( mode = 0){
			
			this.mode = mode;			

			const titles = { '0': 'Update Team Details','1' : 'Add Team' };
			this.title = titles[mode];

			// clear values
			this.name = ""
			this.description = ""

			if ( mode == 0){	//edit

				this.getTeamNo()
				if ( ! this.teamNo ) return

				this.name = getById(`name${this.teamNo}`).innerText;
				this.description = getById(`desc${this.teamNo}`).innerText

			}

			CenterItem("team-info");
			dimBack(true, 'dim-back', () => this.cancel() );

			getById("name").focus()
		},

		cancel(){
			dimBack(false, 'dim-back')
			hideItem("team-info")
		},

		getTeamNo(){

			const e = get("input[type='radio']:checked")

			let no = 0;
			if ( e ){
				no = e.value;			
			}else{
				alert("Please select team to delete.")
			}

			this.teamNo = no;

		},

		load(){

			let e = getById('team-add')
			if ( e) e.onclick = () => proxy.show(1);

			e = getById('team-edit')
			if (e) e.onclick = () => proxy.show();
			
			e = getById('team-delete')
			if ( e){
				e.onclick = () =>{

					this.getTeamNo();
					if ( ! this.teamNo ) return;

					msgBox("Are you sure you want to delete this team?", 
						{cancelButton: true, okCallBack: this.delete })

				}
			}
	  }		
	}

})

const proxy = team_account.mount("#team_account_ui");
proxy.load();

