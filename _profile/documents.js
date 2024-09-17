
if ( busy == undefined)
	var busy = new BusyGif();


const app = Vue.createApp({

	template: `

    <div class="px-50 ss-px-20">    
   
    	<h1 class="py-10 title">{{title}}</h1> 

      <input type="file" multiple id="pick-docs" style="display:none;" 
          accept="application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint, text/plain, application/pdf, image/*" 
          @change='upload_docs'
      >

      <div id="table-files" ></div>

    	<div id="doc-filterbox"></div>

      <div v-if="is_allowed" class="mt-20">

	      <paginate :rows="rows" :pages="pages" :page="page" @next_page="next_page" @prior_page="prior_page"
	      	@set_page="set_page" @set_rows="set_rows"
	      />
      </div>

      <center v-if="is_team_mode" class="mt-20">
      	<button class="button w-130" @click="pick_docs">Upload Documents</button>
      	<button class="button w-130 mx-5" @click="delete_docs">Delete Documents</button>
      	<button class="button w-130" @click="notify_owner_ui">Notify Owner</button>
      </center>
    </div>

    <!-- prompt password -->
    <div v-if="is_team_mode == false" id='pass_box' class='modal-box bg-grey3 p-10 w-200 d-999'>

    	<fieldset class="p-20"> 

    		<center >
	    		<label class="" >Please input password to access your Documents:</label>

	    		<br><br>
					<input class="my-2 py-10 wp-100 editbox ta-c fs-16" type="password" ref="_pass" v-model="pass"
						@keydown.enter="confirm_pass" @keyup.escape="cancel"
					>    		
					<br><br><br>
	 
	    		<button class="button w-70" @click="confirm_pass">Ok</button>
	    		<button class="button w-70 ml-5" @click="cancel">Cancel</button>

	    	</center>
    	</fieldset>   	

    </div>


    <!-- edit/update document details -->
    <div v-if="is_team_mode" id='doc_box' class='modal-box bg-white p-10 w-350 d-999' >

    	<fieldset class="p-20">
    	<legend>Update Document Details</legend>

	    	<div class="aligner mt-5">
	    		<label class="fw-90" >Description:</label>
	    		<textarea v-model="doc.description" class="" rows="3"></textarea>
	    	</div>

	    	<div class="aligner mt-5">
	    		<label class="fw-90">Owner:</label>
	    		<select v-model='doc.employeeno' @change='name_change' ref='_employees' >
	    	</div>

	    	<center class="mt-20">
	    		<button class="button mr-5" @click="update">Update</button>
	    		<button class="button" @click="cancel">Close</button>
	    	</center>
    	</fieldset>

    </div>

    <!-- email notification -->
    <div v-if="is_team_mode" id='notify_box' class='modal-box bg-white p-10 w-500 d-999' >

    	<fieldset class="p-20">
    	<legend>Document Email Notification</legend>
	    	
	    	<label class="" >Message:</label>
	    	<textarea class="mt-5" v-model.trim="mail_msg" rows="12"></textarea>	    	

	    	<div class="aligner mt-10">
	    		<label class="mr-3">Custom Fields:</label>
	    		<p>&lt;owner&gt; &lt;description&gt; &lt;filename&gt; &lt;upload_date&gt;</p>
	    	</div>

	    	<center class="mt-30">
	    		<button class="button mr-5 w-130" @click="save_mail_message(); notify();">Send Notification</button>
	    		<button class="button" @click="cancel(); save_mail_message()">Close</button>
	    	</center>
    	</fieldset>

    </div>

	`,

	data(){
		return this.init();


	},

	methods:{

		init(){
			return {
				is_team_mode: false,
				title: 'My Team Documents',
				rows: 50,
				offset: 0,
				page: 1,
				pages: 5,
				doc: {
					no: -1,
					employeeno: -1,					
					description: '',
				},
				is_allowed: false,
				pass: '',
				mail_msg: '',
				sending: false,
			}
		},

		edit( no ){
			
			this.doc.no = no

			busy.show2()
			xxhrPost("ajax_calls.php", {func: 'doc', axn: 'get', no: no, json:1 }, (ret) => {

				// console.log('edit',ret)

				if ( ret.status == "success"){

					let emp_no = ret.data.owner_id
					if ( ! emp_no ) emp_no = -1
					this.doc.employeeno = emp_no
					this.doc.description = ret.data.description

					dimBack(true, 'dim_back', () => this.cancel() )
					CenterItem('doc_box')						
				}

				busy.hide()
			})
		},

		update(){

			busy.show2()

			const doc_no = this.doc.no
			const emp_no = this.doc.employeeno

			const p = { func: 'doc', axn: 'update', no: doc_no, 
				eno: emp_no, d: this.doc.description, json: 1
			}

			xxhrPost("ajax_calls.php", p, (ret) => {

				console.log( 'update doc', ret);

				if ( ret.status = "success"){

					let owner = emps_list[ this.doc.employeeno ]
					if ( ! owner ) owner = ""

					getById("desc_" + doc_no).innerHTML = this.doc.description					
					getById("owner_"+ doc_no).innerHTML = owner					
				}

				busy.hide()
				this.cancel()
			})

		},

		cancel(){			

	  	dimBack(false, 'dim_back');
	  	hideItem('pass_box')
  		hideItem('doc_box');			
  		hideItem('notify_box')
		},

		reset(){

			let initData = this.init();

	  	const keys = Object.keys(initData)
	  	keys.forEach( (name)=>{
	  		this[name] = initData[name];
	  	})
	  },

	  confirm_pass(){
			
			this.$refs._pass.blur()

		  xxhrPost( "ajax_calls.php", {func: 'ConfirmOldPass', v: this.pass, json:1} , (ret) => {

		  	console.log('ret', ret);
		  	if ( ret.result == "success"){

		  		this.load_documents()
		  		
		  		this.is_allowed = true
		  		this.cancel()

		  	}else{
		  		msgBox("Invalid Password!", {
		  			okCallBack: () => this.$refs._pass.focus()
	  		});
		  	}
		  })

	  },

	  // select funcs

			pick_docs(){
				getById('pick-docs').click()			
			},

			upload_docs(){			
				
				busy.show2()				

				const input = getById('pick-docs');
	      const files = input.files; // This is a FileList object

	      const post_it = (file, i) => {

	      	xxhrPost("ajax_calls.php", {func: '+doc', tp: 1, att_file: file, i: i}, (res) => {

	      		const ret = JSON.parse(res)
	      		// console.log( ret )
	      		if ( ret.upload_index == files.length -1 )
	      			this.load_documents()
	      	})

	      }

	      for (let i = 0; i < files.length; i++) {
	      
	        const file = files[i];
	        const size_kb = file.size / 1024
	        const size_mb = size_kb / 1024;

	        if ( file.type == "image/jpeg"){

	        	resizeImageQuality(file, max_kb_img, (blob) =>{

	        		let img = file;
	      			if (blob != null ){
								img = new File([blob], file.name, { type: file.type });						
							}						
							post_it(img, i);
	        	}) 

	        }else{  // doc, pdf, excel, txt

	        	if ( size_mb > max_mb_doc ){
	        		msgBox(`Document file ${file.name} is too big. Acceptable file size is ${max_mb_doc}mb max.`,
	        			{ buttons_bg: 'bg-red-08', 
	        				okCallBack: () => { 
	        					if ( i == files.length -1 && i > 0 ) this.load_documents()
	        				}
	        			}
	        		)
	        		continue
	        	}
	        	post_it(file, i)        	
	        }              
	      }

	    },

	    select_all(){
	    	
	    	const checked = getById('select-all').checked

	    	const chks = getAll("input[type='checkbox']");
	    	for( const chk of Object.values(chks) ){
	    		chk.checked = checked
	    	}

	    },


	  // count docs
	  	check_documets(){

	    	busy.show2();

	    	const p = {func: 'docs', r: 10, p: 1, md: 0, json: 1}
	    	xxhrPost("ajax_calls.php", p, (ret) => {

	    		console.log( ret);
	    		if (ret.status == "success"){
	    			
	    			busy.hide()

						dimBack(true, 'dim_back', () => this.cancel() )
						CenterDiv('#pass_box', -100)		

	    			this.$refs._pass.focus()

	    		}else{

	    			this.is_allowed = true
	    			this.load_documents()
	    		}
	    	});

	  	},

    // load funcs
	    load_documents(){
	    	    	
	    	busy.show2();

	    	const p = {func: 'docs', r: this.rows, p:this.page, os: this.offset, md: this.is_team_mode ? 1 : 0, json:1 }
	    	xxhrPost("ajax_calls.php", p, (ret) => {

	    		console.log( 'load docs', ret);

	    		this.pages = ret.pages

	    		const chk_select_all = this.is_team_mode ? `<input class="mx-5" id="select-all" type="checkbox" >` : ""

	    		const seen = { col: '<col width="5%" >', title: '<td class="ta-c">Status</td>', statu: ''}

	    		if ( ! this.is_team_mode ){
	    			seen.col = ''
	    			seen.title = ''
	    			seen.status = '' 
	    		}
	    		console.log( seen)

	    		const rows = [];
	    		rows.push(
	    			`<table class='my-5' width='100%'>
			    		<colgroup>
			        	<col width="30%">
			        	<col width="30%">
			        	<col width="25%">		        	
			        	<col width="10%">
			        	${ seen.col }			        	
			    		</colgroup>
			    		<tbody>
			        	<tr class="DataHeading">
			            <td >
			            	<div class="aligner">
				            	${chk_select_all}
				            	<p class="ml-5">Document Filename</p>
			            	</div>
			            </td>		            
			            <td class="">Description</td>		            
			            <td class="">${ this.is_team_mode ? 'Owner' : 'Uploader' }</td>
			            <td class="">Upload Date</td>
			            ${seen.title}
			        	</tr>
			    		</tbody>`
					)

	    		// load document rows
	    		if ( ret.status == "success"){    			

	    			for(const file of Object.values(ret.data) ){

	    				const img = file.file_type.includes('image') ? "1" : "0"

	    				const with_owner = file.name ? 1 : 0;
	    				const chk = this.is_team_mode ? `<input type='checkbox' class="ml-5" data-no="${file.no}" id="doc_${file.no}" data-owner='${with_owner}' />` : ""

	    				if ( is_team_mode ){

	    					let title = ''
	    					const statuses = {"0": '', '1': 'seen', '2': 'sent', '3':'seen, sent'}	    					
	    					const stat_no = file.status;
	    					const status = statuses[ stat_no ];	    					
	    					
	    					if ( file.status_date){
	    						title = 'Date Seen: ' + DateFormat( file.status_date, "d-M-Y")	    							    						
	    					}
	    					if ( stat_no == 2 || stat_no == 3 ) title += "\rNotification Sent"

	    					seen.status = `<td class="" title='${title}'></a>${status}</td>` 	    					
	    				}

	    				const row = `
	    					<tr name="doc-entry" class="DataFieldValue DataRow DataRowHover Clickable" 
	    						data-no="${file.no}" >

	    						<td> 
	    							<div class='aligner'>
	    								${chk}
	    								<a onclick='viewBlobData(event, this)' class='PageOption ml-5' target='_blank' 
	    									href='includes/download_attachment.php?id=${file.no}&type=2' data-img='${img}'>${file.file_name}</a>
	    							</div>
	    						</td>
	    						<td id="desc_${file.no}" >${file.description}</td>
	    						<td id="owner_${file.no}" >${file.name}</td>
	    						<td>${ DateFormat( file.upload_date, "d-M-Y") }</td>	    						
			            ${ seen.status}
	    					</tr>
	    					`
	    				rows.push(row);
	    			}	    			
	    		}

	    		rows.push('</table>')

	    		// no documents found
	    		if ( ret.status != "success"){
	    			rows.push(`
	    				<center class='py-5 bg-grey3 c-red italic'>
	    					<label>No documents record found.</label>
	    				</center>
	    				`
	    			)
	    		}
					getById('table-files').innerHTML = rows.join('');			

					if ( this.is_team_mode ){

						// row click event					
						const trs = getAll('tr.DataRow')
						if( trs ){
							for( const tr of trs){

								tr.ondblclick = () => this.edit( tr.dataset.no )

								tr.onclick = (e) => {

									let tr = e.target

									// skip for checkbox or link
									if ( 'type' in tr){
										if ( tr.type == "checkbox" ) return
		    					}
		    					if ( tr.tagName == "A") return

									while(true){
										tr = tr.parentElement									
										if( tr.tagName == "TR"){
											const id = 'doc_' + tr.dataset.no
											const el = getById(id)
											if ( el ) el.checked = ! el.checked
											break;
										}

									}
								}
							}
						}

						// select all
						getById('select-all').onclick = () => this.select_all()						
					}

					busy.hide()

	    	})
	    },

	    next_page(){

	    	let page = this.page + 1
	    	if ( page > this.pages) page = this.pages

	    	this.new_page(page)
	    },

	    prior_page(){
	    	
	    	let page = this.page - 1
	    	if ( page < 1 ) page = 1
	    	this.new_page( page )

	    },

	    new_page( page ){

	    	if ( page != this.page ){
	    		this.page = page
	    		this.load_documents()
	    	}
	    },

	    set_rows(rows){
	    	if ( rows > 0 ){
	    		this.rows = rows
	    		this.page = 1
	    	}
	    	this.load_documents();
	    },

	    set_page(page, e){
	    	e.blur()    	
	    	if (page <= this.pages){
	    		this.new_page(page)
	    	}
	    },

	  delete_docs(){

	  	// collect selected items
	  	const chks = getAll("input[type='checkbox']:checked")
	  	if ( ! chks.length )
	  		return msgBox("Please select documents to delete.")
	  	

  		const nos = []
  		for(const chk of chks){
  			const no = chk.dataset.no
  			if ( no ) nos.push( chk.dataset.no )
  		}

  		msgBox( "Delete selected " + pluralize('item', chks.length) + "?", {
  			buttons_bg: 'bg-red-08',
  			cancelButton: true,
  			okCallBack: () => {
					
  				xxhrPost('ajax_calls.php', {func: '-doc', nos: nos.join(',') }, (res) => {
  					this.load_documents()
  				})

  			},
  		})
	  	
	  },

	  notify_owner_ui(){

	  	// collect selected items
	  	const chks = getAll("input[type='checkbox']:checked")
	  	if ( ! chks.length )
	  		return msgBox("Please select documents for email notification.")

	  	let with_owner = false
	  	for(const chk of chks){
	  		if ( chk.dataset.owner == 1){
	  			with_owner = true
	  			break
	  		}
	  	}
	  	if ( ! with_owner )
				return msgBox("Please select document with owner to notify.")


	  	const p = {func:'getvalue_inc', inc: doc_msg_inc, d:' ', json:1}
	  	xxhrPost("ajax_calls.php", p, (ret) => {
	
	  		// console.log('ret', ret)
	  		let template = ret.data

	  		// default
	  		if ( ! template ){
	  			template = 
`Dear <owner>,

Your Payslip for the month May 2024 (<description>) is available for viewing uploaded on <upload_date> with filename <filename> in Phoenix Payroll Web. This is for your ready reference and personal copy.

Just go to My Account > My Documents.
The document is password protected, please use your login password to open.

Thank you,
PAYROLL MASTER`

				}

	  		this.mail_msg = template

				dimBack(true, 'dim_back', () => this.cancel() )
				CenterItem('notify_box')		
	  		
	  	})
	  },

	  save_mail_message(){

	  	const p = {func: 'UpdateSettings', t: 1, f:'t|v3', 
	  		v:`DOC_MAIL_TEMPLATE|${this.mail_msg}`, 
	  		xp:"t='DOC_MAIL_TEMPLATE'",
	  		json:1 }
	  	
	  	xxhrPost("ajax_calls.php", p, (ret) => {
	  		// console.log(ret)
	  	})
	  },

	  notify(){

	  	if ( this.sending ) return;

	  	if ( ! this.mail_msg ) return msgBox("Notification message is empty.")

			const chks = getAll("input[type='checkbox']:checked")

			const ids = []			
			for(const chk of chks){
				if ( chk.dataset.owner == 0 ) continue
				ids.push(chk.dataset.no)
			}

			this.sending = true;

			busy.show2()

	  	const p = { func: 'doc-notify', id: ids.join(), json:1}
	  	xxhrPost("mailer.php", p, (ret) => {

	  		console.log(ret)

	  		busy.hide()
	  		this.sending = false
	  		this.cancel()

	  		this.load_documents()
	  	})

	  },

	},
	
	mounted(){

		if ( this.is_team_mode ){
			
			// employee list
			this.$refs._employees.innerHTML = emps_select_items

		}

		replaceParent( "doc_box", "edit_doc_parent")
		replaceParent( "pass_box", "edit_doc_parent")
		replaceParent( "notify_box", "edit_doc_parent")

	},
	
	beforeMount(){

		this.rows = page_rows		
		this.is_team_mode = is_team_mode

		this.title = is_team_mode ? "My Team Documents" : "My Documents"

		this.check_documets();
		
	},

})


app.component('paginate', {
	template:`
		<div class="aligner flex-justify-center flex-gap-5">
			<label >Rows:</label>
			<input type="number" class="w-30 editbox ta-c" :value="rows" @keyup.enter="$emit('set_rows', $event.target.value)"/>
			<button class="button w-30 ml-5" @click="$emit('prior_page')"><</button>
			<input type="number" class="w-30 editbox ta-c" v-model="page" @keyup.enter="$emit('set_page', $event.target.value, $event.target)"/>
			<label>of {{pages}}</label>
			<button class="button w-30" @click="$emit('next_page')">></button>

		</div>
	`,

	props: ['rows', 'pages', 'page'],
	data(){
		return {			
		}
	},
	methods:{
	},

})

app.mount('#documents')

filterBox( {parentId:"doc-filterbox", row_name:"doc-entry", minRows: 10})

function edit(){
	console.log( 'edit')
}
