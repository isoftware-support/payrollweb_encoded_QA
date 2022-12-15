
var timer_filter  

function filterBox( param = {parentId:'', row_name:"", select_name:"", minRows: 0} ){

	// remove form entry key submit
	const frms = getAll('form')
	if (frms){
		frms.forEach((frm) =>{
			frm.onkeypress = (event) =>{
				if ( event.keyCode == 13 ){
					event.preventDefault()
				}
			}
		})
	}

	if ( typeof root_uri == 'undefined'){
		root_uri = rootURI
	}

	let {parentId, row_name, select_name, minRows} = param

	if (typeof parentId == 'undefined') parentId = "filter_box"
	if (typeof row_name == 'undefined') row_name = ""
	if (typeof select_name == 'undefined') select_name = ""
	if (typeof minRows == 'undefined') minRows = 0

	// hideFilterBox()

	// vue component
	Vue.createApp({

		template: `
			<div class="flex w-140 ml-a ">
				<input type="text" class='w-110 mr-2 ' autocomplete="off" v-model="text" @keyup="onEnter" > 

				<a href="#/"  class="filter-button px-2" @click="filter">
					<img class="mt-3" src="${root_uri}/images/filter.png" style="width: 11px">
				</a>
				<a href="#/" class="filter-button " @click="clear" >
					<img class="mt-2 " src="${root_uri}/img/close.png" style="width:15px">
				</a>
			</div>		

		`,
		data(){
			return {
				text: ''
			}
		},

		beforeMount(){
			this._hideFilterBox()
		},

		mounted(){
			this._showHideTimer()
		},

		methods:{

			onEnter( event ){

				window.clearTimeout( timer_filter );

				let delay = 1500			
				if (event.keyCode == 13){
					delay = 1
				}

				timer_filter = window.setTimeout(() =>{
					this._filterRows( this.text);
				}, delay)

			},

			filter(){

				if (String(this.text).length == 0) return
				this._filterRows( this.text);
				return false
			},

			clear(){

				if (String(this.text).length == 0) return
				this.text = ''
				this._filterRows();
				return false
				
			},

			_filterRows( text=""  ){
					
				let all = []
				if ( row_name ){
					all = getAll(`tr[name='${row_name}']`)

				}else if( select_name){

					const e = getByName(select_name)					
					all = Object.values(e[0].options)

				}
				
				all.forEach( (item)=> {
				
					let isFound = true
					if ( row_name ){														

						const tds = item.children;   // all td of tr

						if ( String(text).length > 0 ){

							isFound = false
							for (let i = 0; i < tds.length; i++) {
								const td = tds[i]		
								const txt = td.innerText.toLowerCase();
								if ( txt.indexOf( text.toLowerCase() ) > -1 ){
									isFound = true
									break
								}
							}
						}				
					
					}else if( select_name ){

						const txt = item.innerText.toLowerCase()
						isFound = txt.indexOf( text.toLowerCase()) > -1 ? true : false
					}

					item.hidden = ! isFound;

				})

			},

			_hideFilterBox(){

				const rows = this._countRows() 
				if ( ! rows ) return

				if ( rows <= minRows )	
					getById( parentId ).classList.add('anim-hide-item')
			},

			_showHideTimer(){

				if ( ! minRows) return

				const rows = this._countRows()
				const c = rows <= minRows ? 'anim-hide-item' : 'anim-show-item'

				const e = getById( parentId )				
				const classes = Object.values(e.classList)

				if ( ! classes.includes(c) ) {

					e.classList.add(c)

					if ( c == 'anim-show-item') 
					 	e.classList.remove('anim-hide-item')

					if ( c == 'anim-hide-item'){
					 	e.classList.remove('anim-show-item')
					 	this.clear()
					}
				}
				
				setTimeout( ()=>this._showHideTimer(), 1000)
			},
			_countRows(){

				if (! minRows) return 0

				let all = []
				if ( row_name ){
					all = getAll(`tr[name='${row_name}']`)

				}else if( select_name ){
					const e = getByName(select_name)
					all = e[0].options
				}

				if ( all ) return all.length
				return 0	
			},
	
		},  // methods end

	}).mount("#" + parentId );

}


