

console.log( getById("13th-pay-section") );

busy = new BusyGif()	

const ui13thmonth = Vue.createApp({
	template: `
		<div class="py-5 aligner">
        <label class="">Year:</label>
        <input class="EditBox w-50 mx-5" type="number" v-model="yearFrom" :min=yearMin :max="yearMax" step="1"  />
        <label class="">to</label>
        <input class="EditBox w-50 mx-5" type="number" v-model="yearTo" :min=yearMin :max=yearMax step="1"  />            
        <input type="button" class="button w-30" @click="load" name="" value="Ok">
    </div>
    <div class="h-200 bg-white scroll-y ">            

    	<div v-if="recs_13thpay.length == 0" class="py-20">
    		<center>
    		<label>No processed 13th month pay record found.</label>
    		</center>
    	</div>

      <div  v-for="e in recs_13thpay" :key="e.id" class="py-5 px-5 DataRowHover aligner Clickable "
      	@click="select(e)"
      	>                
        <input type="radio" name="batchid" :value=e.id >
        <p class="DataFieldValue">{{e.title}} <i>( {{e.range}} )</i> </p>
      </div>                  
        
    </div>
    <center class="pt-10">
    	<input type="button" class="button" value="Preview Payslip" @click="preview">
    </center>
	`	,
	data(){
		return{			
			yearFrom: 0,
			yearTo: 0,
			yearMin: 0,
			yearMax: 0,
			recs_13thpay: [],
			selected: [],
		}
	},

	methods:{

		load(){

			if(this.yearFrom > this.yearTo ){
				return msgBox("Invalid year range.")				
			}

			const p = {func:'GetMy13thPays', yrF: this.yearFrom, yrT: this.yearTo }
			p.x = 1

			busy.show2()
			xxhrPost("ajax_calls.php", p, (res)=>{

				// console.log(res)
				const ret = JSON.parse(res);
				console.log('ret: ', ret);

				this.recs_13thpay = [];
				ret.data.forEach((e) =>{

					this.recs_13thpay.push( {
						id: e.batchid,
						title: e.title,
						range: DateFormat(e.dateStart, 'd M Y') + " - " + DateFormat(e.dateEnd, 'd M Y'),
						year: e.year
					})
				})

				console.log( this.recs_13thpay)

				busy.hide()

			})
			

		},
		select(e){

			console.log( e);

			const radio = get(`input[type="radio"][value="${e.id}"]`)
			radio.checked = true
			this.selected = e

		},

		preview(){						
			
			const p = { b: this.selected.id, t: PAYSLIP_13THPAY, yr: this.selected.year }
			
			if ( ! p.b ) return msgBox('Please select item.')

			console.log( urlParams(p) );
			window.open( PAYROLLWEB_URI + "/_payroll/pdf_print.php?"+ urlParams(p), "_blank" ); 
		}
	},

	beforeMount(){
		this.yearFrom = years.yearFrom
		this.yearTo = years.yearTo
		this.yearMin = years.yearMin
		this.yearMax = years.yearTo
	}

}).mount("#section-13th-pay")