

function PicViewer( params ){
	
	/* keys
		prefix, rootFolder, src, withClose, parent,
		width, height
	*/

	if ( params.withClose == undefined ) params.withClose = true;
	if ( params.parent == undefined ) params.parent = "body";

	let xViewer = {}

	xViewer.params = params;
	xViewer.dimId = 'dimBack';

	// delete div
	const div = getById( xViewer.params.prefix + "pic_viewer");
	if ( div ){
		const parent = getById(div).parentElement;
	  parent.parentElement.removeChild(div);
	}

	// create elements
	const body = get(xViewer.params.parent);
	if ( body ){

		xViewer.divId = xViewer.params.prefix + 'pic_viewer'
		let div = document.createElement('div');
		div.id = xViewer.divId
		div.classList.add( 'pic_viewer' );
		body.appendChild(div);
		xViewer.div = div;		

		// if with width
			if ( params.width){
				div.style.width = `${params.width}%`
			}
			if ( params.height){
				div.style.height = `${params.height}%`
			}

		// buttons div
		xViewer.divButtonsId = xViewer.params.prefix + '-pic-buttons';
		let div_wrapper = document.createElement('div')
		div_wrapper.id = xViewer.params.prefix + "-pic-button-wrapper"
		div_wrapper.classList.add('pic_buttons_wrapper')
		div_wrapper.innerHTML = `<div id='${ xViewer.divButtonsId }' class='pic_buttons'></div>`;
		div.appendChild( div_wrapper )

		// inner div
		xViewer.imgDivId = xViewer.params.prefix + "pic_image"
		let div_image = document.createElement('div')
		div_image.id = xViewer.imgDivId
		div_image.classList.add( 'pic_image' );
		div.appendChild( div_image )
		xViewer.divImg = div_image;

		// image
		xViewer.imgId = xViewer.params.prefix + "pic_viewer_img"
		let img = document.createElement('img')
		img.id = xViewer.imgId

		if ( xViewer.params.src )
			img.src = xViewer.params.src;
		
		div_image.appendChild( img)
		xViewer.img = img

		// create buttons
		const div_buttons = getById( xViewer.divButtonsId ) 
		let buttons = 
		`<img id='${xViewer.params.prefix}-zoom-in' src="${params.rootFolder}/img/zoom-in.png">
		<img id='${xViewer.params.prefix}-zoom-out' src="${params.rootFolder}/img/zoom-out.png">
		<img id='${xViewer.params.prefix}-zoom-fit' src="${params.rootFolder}/img/zoom-fit.png">
		`;			
		if ( xViewer.params.withClose ){ 
				buttons += `<img id='${xViewer.params.prefix}-viewer-exit' src="${params.rootFolder}/img/close.png">`;
		}
		div_buttons.innerHTML = buttons;

		// button events
		e = getById(xViewer.params.prefix + '-zoom-in')
		e.onclick = ()=> viewerZoom('in', xViewer);

		e = getById(xViewer.params.prefix + '-zoom-out')
		e.onclick = ()=> viewerZoom('out', xViewer);

		e = getById(xViewer.params.prefix + '-zoom-fit')
		e.onclick = ()=> viewerZoom('fit', xViewer);

		e = getById(xViewer.params.prefix + '-viewer-exit')
		if ( e )
			e.onclick = ()=> viewerExit( xViewer);

		// no close means visible always
		if ( ! xViewer.params.withClose ){
			xViewer.div.classList.remove('pic_viewer');
			xViewer.div.classList.add('pic_viewer_child');
			div_buttons.style.width = "100px";
			viewerZoom('fit', xViewer);
		}

		// butons
		if ( xViewer.params.nav == "left"){
			div_buttons.classList.add('pic_buttons_left')
		}
	}
	// -----------------------------


	this.showOnClickOf = function( elementId ){
		
		// add image click
		let el = getById( elementId )
		if ( el ){
			el.style.cursor = "pointer";
			el.onclick = ()=> show();
		}
	}

	this.changeImageSource = function(src){
		xViewer.img.src = src;
	}

	this.showNow = () => show();

	function show(){

		const div = getById( xViewer.divId);
		div.style.display = "block";
		
		dimBack(true, xViewer.dimId );
		CenterItem(xViewer.divId );

		//add dim event
		let e = getById( xViewer.dimId );
		if ( e )
			e.onclick = () => viewerExit( xViewer );

	}

	// ------------------------------
	// drag action
	// ------------------------------
	let isDown = false;
	let start = {x: 0, y:0};
	let scroll = {left: 0, top: 0};
	let slider = xViewer.divImg;

	slider.addEventListener('mousedown', (e) => {

  	isDown = true;
  	start.x = e.pageX - slider.offsetLeft;
  	start.y = e.pageY - slider.offsetTop;
  	scroll.left = slider.scrollLeft;
  	scroll.top = slider.scrollTop;
  	xViewer.img.style.cursor = "grabbing"

	});

	slider.addEventListener('mouseleave', () => {
	  isDown = false;
  	xViewer.img.style.cursor = "grab"
	});
	
	slider.addEventListener('mouseup', () => {
	  isDown = false;
  	xViewer.img.style.cursor = "grab"
	});

	slider.addEventListener('mousemove', (e) => {

	  if(!isDown) return;
	  e.preventDefault();
	  const x = e.pageX - slider.offsetLeft;
	  let walk = (x - start.x) * 3; //scroll-fast
	  slider.scrollLeft = scroll.left - walk;

	  const y = e.pageY - slider.offsetTop;
	  walk = (y - start.y) * 3;
	  slider.scrollTop = scroll.top - walk;
	  console.log(walk);
	});


}

function viewerExit( xViewer ){

	log(xViewer)
	dimBack(false, xViewer.dimId );

	xViewer.div.style.display = "none";

}

function viewerZoom(key, xViewer){

	let h = xViewer.img.height,
		w = xViewer.img.width,
		cH = xViewer.divImg.offsetHeight,
		cW = xViewer.divImg.offsetWidth;

	if ( key == 'out'){ 
		
		if ( h < cH && w < cW ) return

		w = w * .7;
		xViewer.img.width = w;
		
	}else if (key == 'in'){

		w = w * 1.3;
		xViewer.img.width = w;

	}else if( key == 'fit'){
		xViewer.img.width = cW - 5;
	}

}	


