


const shiftcode_picker = Vue.createApp({

	template :`
		<div id='shiftcode_picker_box'>
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
		}
	},

	beforeMount(){


    let p = { func: 'GetMultiRecs', t: 13, f: "shiftCode|shiftName|timeStart|timeEnd", xp:1 }
    xxhrPost(`${rootURI}/ajax_calls.php`, p, res => {

        const ret = JSON.parse(res);
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

  			busy.show2();

  			let p = {fn : 'sa'};
  			let items = [];

        // remove empty in array
        if ( Array.isArray(shifts) ){
          shifts = shifts.filter((sc)=> sc );
        }

        p.shifts = Array(shifts).join(",");
        // console.log( 'shift', shifts, '2', p.shifts);
        // return;

  			if ( Object.keys(this.edit).length ){   // set 1

  				p.fn = "esc";
  				p.sc = p.shifts;
  				p.eno = this.edit.eno;
  				p.dt = this.edit.dt;

  			}else{																	// set as many

	  			// selected dates
	  			const chks = getAll("input[name='sched_date']:checked");
	  			chks.forEach((chk) =>{
	  				
	  				const div = chk.parentElement;
	  				let item = div.dataset.eno + "_" + div.dataset.dt;
	  				items.push(item);
	  			})
	  			p.items = items.join(",");
	  		}

        // console.log( p);

  			xxhrPost(`${rootURI}/_schedule/team_schedules_ajax.php`, p, (res)=>{
  				// console.log(res);

  				loadTeamSchedule();
  				busy.hide();
  			});

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
  			alert("Please select schedule dates to set.");

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
