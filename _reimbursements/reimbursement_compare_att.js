	
	

	{
		const body = get("body")
		if (body){
			const div = document.createElement('div')
			div.id = "reimb-compare"
			body.appendChild(div)
		}
	}


	let topPicViewer, bottomPicViewer

	const appReimbComparePic = Vue.createApp({

		template: `
		<div id='div_compare' >

			<div class='_modal-header px-10'>
				<span id='compare-close' class='_close' @click="hide">&times;</span>
				<p class="h3 pt-5" >Reimbursement Attachments Coparison</p>
			</div>
			
			<div class="compare-body">

				<div id="top-wrapper">
					<div class="top-text">
						<label>
							Request No: {{reim_no }}
						</label>
						<label>
						 Detail No: {{detail_no}}						
						</label>
						<label>
							<?= $description; ?>
						</label>
					</div>
					<div id="img-top"></div>
				</div>

				<div id="bottom-wrapper">

						<div class="top-text">
						<label id="rec-no">
							Request No: 
						</label>
						<label id="rec-detail-no">
						 Detail No: 
						</label>
						<label id="rec-desc">
							Description: 
						</label>
					</div>

					<div id='img-prior' class="nav-img prior" @click="getDetail( -1)">&#8249;</div>
					<div id='img-next' class="nav-img next" @click="getDetail( 1)">&#8250;</div>

					<div id="img-bottom"></div>

				</div>
			</div>

		</div>
	 `,
	 data(){
	 	return{
	 			imgIndex: -1,
	 			detail_no: -1,
	 			reim_no: -1,
	 	}
	 },

	 methods:{

		getDetail(num){

	 	 	this.reim_no = reim_no.padStart(5, '0')
	 	 	this.detail_no = detail_no.padStart(5,'0')
	 	 	// console.log( 'detail no', detail_no, recDetailNos)
			
			const max = recDetailNos.length -1;
			let id = -1
			while (true){

				this.imgIndex += num;

				if (this.imgIndex < 1) this.imgIndex = 0;
				if (this.imgIndex > max) this.imgIndex = max;
				
				id = recDetailNos[this.imgIndex];

				// console.log('id:', id, 'detail no:', this.detail_no, 'index:', this.imgIndex );

				if ( parseInt(id) !== parseInt(this.detail_no) ) break
				if ( this.imgIndex == 0 && max == 0) break
				if ( this.imgIndex == max) break;
			}

			let p = {func:'GetRec', t:2, xp:'f0='+ id, rc:1 }
			p.f = "f7|f8";
			// console.log(p, id, this.imgIndex)

			busy.show2();

			xxhrPost(rootURI + '/ajax_calls.php', p, (res)=>{

				const ret = JSON.parse(res)
				// console.log( 'ret', ret)
				// change image
				const src = rootURI + `/reimbursephoto.php?&rd=${id}`;
				bottomPicViewer.changeImageSource(src)

				// change details
				let txt = "Request No: " + ret.f7.padStart(5, '0')
				setProp( getById('rec-no'), "innerText", txt)

				txt = "Detail No:" + id.padStart(5, '0');
				setProp( getById('rec-detail-no'), 'innerText', txt)

				txt = "- " + ret.f8
				setProp( getById('rec-desc'), "innerHTML", txt)

				busy.hide();
			});

		},

		compareImage(){

			dimBack(true, 'dimBack', this.hide);
			CenterItem('div_compare')
		},

		hide(){
			dimBack(false);
			const div = getById('div_compare')
			div.style.left = -9999;
		}

	 },

	 mounted(){
	 	 
	 	 console.log('detailNos', recDetailNos)
	 	 	// console.log(encoded_detail_no, ' - ', encoded_reim_no)

	 	 	console.log("starts here")
			let params = { prefix: 'top-img', rootFolder: 
				rootURI, withClose: false, parent: '#img-top',
				nav: 'left'};
			topPicViewer = new PicViewer( params );

			// bottom image
			params.prefix = "bottom-img"
			params.parent = '#img-bottom'
			bottomPicViewer = new PicViewer( params);

			// compare button
			let e = getById('btn-compare')
			if ( e ){
				e.onclick = ()=>{

					this.imgIndex = -1
					let src = rootURI + `/reimbursephoto.php?h=1&rn=${encoded_reim_no}&rd=${encoded_detail_no}`;
					topPicViewer.changeImageSource( src )

					this.getDetail(1)
					this.compareImage()
				}
			}
	 }

}).mount("#reimb-compare");

