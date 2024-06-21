

// <div id="" class="modal-box" style="left:-9999"></div>
{
  const body = getById("wrapper");
  if (body){

    // sched request 
    let div = document.createElement('div')
    div.id = "shiftcode_picker";
    div.classList.add("modal-box")
    div.style.left = -999
    body.appendChild(div)

  }
}



const shiftcode_picker = Vue.createApp({

	template :`
		<div id='shiftcode_picker_box' >
			<div class="aligner ContentTextNormal" v-for="sc in shift_codes" key="sc.id">
				<input v-bind:type="input_type" class='mr-5' name="shifts" v-model="shifts"
					v-bind:id="sc.id" v-bind:value="sc.shiftcode"/> 
				<label v-bind:for="sc.id" class="aligner">{{ sc.title }}</label>
			</div>
		</div>

		<div class="pt-5 ta-c">
			<button type='button' class="button mr-5" @click="ok">Ok</button>
			<button type='button' class="button" @click="cancel">Cancel</button>
		</div>
	`,

	data(){
		return{
			shift_codes: [],
			input_type : 'checkbox',
			shifts: [],
			selected_shiftcode: "",
			edit: {},
      edit_box_element: null,
      batch_count: 0,
      batch: [],
      items: {},
		}
	},

	beforeMount(){


    let p = { func: 'GetMultiRecs', t: 13, f: "shiftCode|shiftName|timeStart|timeEnd", xp:1 }
    xxhrPost(`${rootURI}/ajax_calls.php`, p, res => {

        const ret = JSON.parse(res);

        // console.log('ret', ret)
        
        Object.values(ret).forEach( (item, i) => {

					const start = TimeFormat( item.timeStart);
					const end = TimeFormat( item.timeEnd);
        	this.shift_codes.push( 
        		{shiftcode: item.shiftCode, title: `${item.shiftCode} ( ${start} - ${end} )`, 
        		id:'shift_'+ i } );

        });
    })

    this.input_type =  isMultiShift ? "checkbox" : "radio";

  },

  methods:{

  	setPerDate( edit ){      

  		const div = edit.parentElement;
  		const sc = div.dataset.sc;

  		this._showShifts( false );

  		this.shifts = sc.split(",");
  		this.edit = { eno: div.dataset.eno, sc: sc, dt: div.dataset.dt };
      
      this.edit_box_element = edit

  		// single edit
  		if ( ! isMultiShift)
  			this.shifts = sc;

  	},

  	setAs(){
  		if ( ! this._hasPicked() ) return;
  		this._showShifts();
  	},

  	ok(){

  		// selected shiftcodes
  		let shifts = this.shifts;
  		if ( shifts.length ){

        const db_push = (p, callback = "" ) => {
          xxhrPost(`${rootURI}/_schedule/team_schedules_ajax.php`, p, (res)=>{

            const ret = JSON.parse(res)

            const items = this.items[ ret.batch ];
            for(const key in items){
              
              const item = items[key]
              const div = get(`div[data-eno='${item.no}'][data-dt='${item.date}'`)
              if ( div ){                
                div.children[1].value = p.shifts; // edit component
              }
            }

            this.batch.push('done');
            if ( this.batch.length == this.batch_count ) busy.hide()
            
          });
        }            
       
        busy.show2();

  			let p = {fn : 'sa'};

        // remove empty in array
        if ( Array.isArray(shifts) ){
          shifts = shifts.filter((sc)=> sc );
        }

        p.shifts = Array(shifts).join(",");
        
        this.items = []
        this.batch = []
        this.batch_count = 0

  			if ( Object.keys(this.edit).length ){   // set 1

  				p.fn = "esc";
  				p.sc = p.shifts;
  				p.eno = this.edit.eno;
  				p.dt = this.edit.dt;
          p.b = 1

          this.batch_count = 1
          this.items[1] = [{no: p.eno, date: p.dt, sc: p.sc}]
          
          db_push(p)

  			}else{																	// set as many

	  			// selected dates
	  			const chks = getAll("input[name='sched_date']:checked");
          
          let year1 = "", year2 = "", year = "";
          let yr1_data = [], yr2_data = [];

          let cnt = 0
          let items = []

	  			chks.forEach((chk) =>{
	  				
            cnt++;

	  				const div = chk.parentElement;
            const dt = div.dataset.dt,
              no = div.dataset.eno;

            items.push( {no: no, date: dt, sc: p.shifts} )

            year = DateFormat(dt, "Y");
            if ( year1 == "") year1 = year        

            // year 1
            if ( year1 == year){
              yr1_data.push( no + "|" + dt);
            
            }else{ // year 2      
              year2 = year
              yr2_data.push( no + "|" + dt);
            }

            if ( cnt > 40 ){

              this.batch_count ++

              p.y1 = year1
              p.y2 = year2
              p.y1_data = yr1_data
              p.y2_data = yr2_data
              p.b = this.batch_count;

              this.items[ p.b ] = items
              db_push(p)

              cnt = 0
              year1 = ""
              year2 = ""              
              yr1_data = []
              yr2_data = [];
              items = []
            }

	  			})

          if ( cnt ){

            this.batch_count ++

            p.y1 = year1
            p.y2 = year2
            p.y1_data = yr1_data
            p.y2_data = yr2_data
            p.b = this.batch_count
            
            this.items[ p.b ] = items
            db_push(p)          

          }

	  		}

  		}
  		this._hide();
  	},

  	cancel(){
  		this._hide();
  	},

  	_showShifts(){

  		// none checked
  		this.shifts = [];
  		this.edit = {};

  		dimBack(true, 'dim_back', ()=> this._hide() );
  		CenterItem("shiftcode_picker");
  	},

  	_hide(){
  		dimBack(false, 'dim_back');
  		hideItem("shiftcode_picker");
  	},

  	_hasPicked(){
  		const chks = getAll("input[name='sched_date']:checked");
  		const bln = chks.length > 0 ? true : false;
  		if ( ! bln )
  			msgBox("Please select schedule dates to set.");

  		return bln;
  	},

	  _load(){

	  	// set as

	  	let btn = getById("sched_set_as");
	  	btn.addEventListener("click", () => this.setAs() );
	  },

	  _schedDatesClick(){

	  	// schedule dates
	  	const edits = getAll("input[name='sched_date_txt']");
	  	edits.forEach((edit)=>{
	  		edit.addEventListener('click', () => this.setPerDate(edit) ) ;
	  	})

	  },
  },
});


var proxy_shiftcode_picker = shiftcode_picker.mount("#shiftcode_picker");
proxy_shiftcode_picker._load();
