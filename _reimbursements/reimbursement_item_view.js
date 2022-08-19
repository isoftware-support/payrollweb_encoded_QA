
	
	// pic viwer
	let src = getById('att_img').src;
	const picViewer = new PicViewer( { prefix: 'rec_', rootFolder: rootURI, src: src} );
	picViewer.showOnClickOf( 'att_img');

	// top image
	src = rootURI + `/reimbursephoto.php?rn='${rn}'&rd=${rd}`;
	let params = { prefix: 'top-img', rootFolder: 
		rootURI, src: src, withClose: false, parent: '#img-top',
		nav: 'left'};
	const topPicViewer = new PicViewer( params );

	// bottom image
	params.prefix = "bottom-img"
	params.parent = '#img-bottom'
	const bottomPicViewer = new PicViewer( params);
	getDetail(1)


	let recDetailNo = rd; 

	// -------------------
	// prior click
	// ------------------
	let btn = getById('img-prior');
	if ( btn ){
		btn.onclick = () => {
			getDetail(-1);
		}
	}

	// -----------------
	// next click
	//------------------
	btn = getById('img-next')
	if (btn){
		btn.onclick = () => {
			getDetail(1);
		}
	}

	//------------------
	// close compare
	//------------------
	btn = getById('compare-close')
	if ( btn ){
		btn.onclick = () => compareImage( false)
	}


	function getDetail(num){

		imgIndex += num;
		const max = recDetailNos.length -1;

		if (imgIndex < 1) imgIndex = 0;
		if (imgIndex > max) imgIndex = max;
		const id = recDetailNos[imgIndex];

		let p = {func:'GetRec', t:2, xp:'f0='+ id, rc:1}
		p.f = "f7|f8";

		xxhrPost('ajax_calls.php', p, (res)=>{

			const ret = JSON.parse(res)

			// change image
			const src = rootURI + `/reimbursephoto.php?rn='${ret.f7}'&rd=${id}`;
			bottomPicViewer.changeImageSource(src)

			// change details
			let txt = "Request No: " + ret.f7.padStart(5, '0')
			setProp( getById('rec-no'), "innerText", txt)

			txt = "Detail No:" + id.padStart(5, '0');
			setProp( getById('rec-detail-no'), 'innerText', txt)

			txt = "- " + ret.f8
			setProp( getById('rec-desc'), "innerHTML", txt)
		});


	}

	function compareImage( isShow = true){

		if ( isShow ){
			dimBack(true, 'dimBack');
			CenterItem('div_compare')

			const div = getById('dimBack');
			if ( div )
				div.onclick = () => compareImage(false)

		}else{
			dimBack(false);
			const div = getById('div_compare')
			div.style.left = -9999;
		}
	}