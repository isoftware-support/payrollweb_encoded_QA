
if ( busy == undefined)
	var busy = new BusyGif();


const app = Vue.createApp({

	template: `

    <div class="px-50 ss-px-20">    
   
    	<h1 class="py-10 title">My Team Documents</h1> 

    	<br>

    	<button class="w-120" @click="pick_docs">Upload Documents</button>
    	
      <input type="file" multiple id="pick-docs" style="display:none;" 
          accept="application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint, text/plain, application/pdf, image/*" 
          @change='selected_docs'
      >

      <div id="table-files" ></div>

      <div class="mt-20">
      <paginate :rows="rows" :pages="pages" :page="page" @next_page="next_page" @prior_page="prior_page"
      	@set_page="set_page" @set_rows="set_rows"
      />
      </div>

      <center class="mt-20">
      	<button class="button w-200" @click="delete_docs">Delete Selected Documents</button>
      </center>
    </div>
	`,

	data(){

		return this.init();


	},

	methods:{

		init(){
			return {
				rows: 50,
				offset: 0,
				page: 1,
				pages: 5,
			}
		},

		// select funcs

			pick_docs(){
				getById('pick-docs').click()			
			},

			selected_docs(){			
				
				const input = getById('pick-docs');
	      const files = input.files; // This is a FileList object

	      const post_it = (file, i) => {

	      	xxhrPost("ajax_calls.php", {func: 'up_doc', tp: 1, att_file: file, i: i}, (res) => {

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

	    select_me(e){
	    	console.log(e)

	    },

    // load funcs
	    load_documents(){
	    	
	    	busy.show2();

	    	const p = {func: 'docs', r: this.rows, p:this.page, os: this.offset }
	    	xxhrPost("ajax_calls.php", p, (res) => {

	    		const ret = JSON.parse(res)
	    		// console.log( ret)

	    		this.pages = ret.pages

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
			            <td class="pl-30">Document Filename</td>		            
			            <td class="">Description</td>		            
			            <td class="">Owner</td>
			            <td class="">Upload Date</a></td>
			        	</tr>
			    		</tbody>`
					)

	    		if ( ret.status == "success"){

	    			for(const file of Object.values(ret.data) ){

	    				const row = `
	    					<tr class="DataFieldValue DataRow DataRowHover Clickable" data-no="${file.no}" >
	    						<td> 
	    							<div class='aligner'>
	    								<input type='checkbox' class="mx-5" data-no="${file.no}" id="doc_${file.no}" />
	    								<p class='PageOption Clickable'>${file.file_name}</p>
	    							</div>
	    						</td>
	    						<td>${file.description}</td>
	    						<td>${file.owner_name}</td>
	    						<td>${ DateFormat( file.upload_date, "d-M-Y") }</td>
	    					</tr>
	    					`
	    				rows.push(row);
	    			}
	    			
	    		}

	    		rows.push('</table>')
					getById('table-files').innerHTML = rows.join('');			

					// row click event
					const trs = getAll('tr.DataRow')
					if( trs ){
						for( const tr of trs){
							tr.onclick = (e) => {

								let tr = e.target

								// exit if clicked is checkbox
								if ( 'type' in tr){
									if ( tr.type == "checkbox" ) return
	    					}

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
	  	if ( chks ){

	  		for(const chk of chks)
	  			console.log(chk)

	  	}

	  },

	},
	
	mounted(){

	},
	
	beforeMount(){

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

app.mount('#my_team_documents')

