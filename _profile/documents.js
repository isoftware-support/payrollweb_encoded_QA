
if ( busy == undefined)
	var busy = new BusyGif();


const app = Vue.createApp({

	template: `

    <div class="px-50 ss-px-20">    
   
    	<h1 class="py-10 title">{{title}}</h1> 

    	<div class="aligner flex-space-between">
	    	<!-- <button class="w-130" @click="pick_docs">Upload Documents</button> -->
	    	<label>&nbsp;</label>
	    	<div id="doc-filterbox"></div>
    	</div>
      <input type="file" multiple id="pick-docs" style="display:none;" 
          accept="application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint, text/plain, application/pdf, image/*" 
          @change='upload_docs'
      >

      <div id="table-files" ></div>

      <div class="mt-20">
      <paginate :rows="rows" :pages="pages" :page="page" @next_page="next_page" @prior_page="prior_page"
      	@set_page="set_page" @set_rows="set_rows"
      />
      </div>

      <center v-if="is_team_mode" class="mt-20">
      	<button class="button w-130 mr-5" @click="pick_docs">Upload Documents</button>
      	<button class="button w-170" @click="delete_docs">Delete Selected Documents</button>
      </center>
    </div>

    <!-- edit/update document details -->
    <div v-if="is_team_mode" id='doc_box' class='modal-box bg-white p-10 w-350' style="left:-999">

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
					CenterDiv('#doc_box', -150 )						
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
	  	hideItem('doc_box');			
		},

		reset(){

			let initData = this.init();

	  	const keys = Object.keys(initData)
	  	keys.forEach( (name)=>{
	  		this[name] = initData[name];
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

    // load funcs
	    load_documents(){
	    	
	    	busy.show2();

	    	const p = {func: 'docs', r: this.rows, p:this.page, os: this.offset, md: this.is_team_mode ? 1 : 0, json:1 }
	    	xxhrPost("ajax_calls.php", p, (ret) => {

	    		console.log( 'load docs', ret);

	    		this.pages = ret.pages

	    		const chk_select_all = this.is_team_mode ? `<input class="mx-5" id="select-all" type="checkbox" >` : ""

	    		const rows = [];
	    		rows.push(
	    			`<table class='my-5' width='100%'>
			    		<colgroup>
			        	<col width="30%">
			        	<col width="35%">
			        	<col width="25%">		        	
			        	<col width="10%">
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
			            <td class="">Upload Date</a></td>
			        	</tr>
			    		</tbody>`
					)

	    		if ( ret.status == "success"){

	    			for(const file of Object.values(ret.data) ){

	    				const img = file.file_type.includes('image') ? "1" : "0"

	    				const chk = this.is_team_mode ? `<input type='checkbox' class="ml-5" data-no="${file.no}" id="doc_${file.no}" />` : ""

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
	    					</tr>
	    					`
	    				rows.push(row);
	    			}
	    			
	    		}

	    		rows.push('</table>')
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
	  	if ( chks.length ){

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
	  	}

	  },

	},
	
	mounted(){

		if ( this.is_team_mode ){
			
			// employee list
			this.$refs._employees.innerHTML = emps_select_items
		}

	},
	
	beforeMount(){

		this.rows = page_rows		
		this.is_team_mode = is_team_mode

		this.title = is_team_mode ? "My Team Documents" : "My Documents"
		this.load_documents();
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
