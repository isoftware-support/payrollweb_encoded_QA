

let divIndex = 1;

const boxId = 'new_events_box';

let NewsEventItem = new NewsEvents();
NewsEventItem.bindItems();


let excludedFiles = [];

function NewsEvents(){

	let editNewsEventNo = 0;

	this.bindItems = () => {

		// add
		getById('btn_add_news').onclick = ()=> show(1);
  	// edit
		getById('btn_edit_news').onclick = ()=> show(0);
		// delete
		getById('btn_delete_news').onclick = _delete;
		// save
		getById('btn_save').onclick = save;
		// cancel
		getById('btn_cancel').onclick = hide;		

	}

	function save(){  // add and edit
		
		const files = getByName('news_files');		

		const 
			dt = getById('f_date').value,
			title = getById('f_title').value,
			intro = getById('f_intro').value,
			content = getById('f_content').value;
			link = getById('f_link').value;

		if (! dt){
			alert('Please input date.');
			return;
		}

		let p = {func: 'NewsEvents', t: 7, sep: "||", d: 1};
		p.f = "f3,startdate,title,intro,content,location".replaceAll(",", p.sep);
		p.v = `${cmType},'${dt}','${title}','${intro}','${content}','${link}'`.replaceAll(",", p.sep);
		p.cm = cmType;

		// include files
		for( let i=0; i < files.length; i++){
			p['file'+ i] = files[i].files[0];
		}

		if ( editNewsEventNo ){  // edit		
			p.d = 0;			
			p.xp = `f3=${cmType} and f2=${editNewsEventNo}`;
			p.n = editNewsEventNo;

			// delete excluded files
			if ( excludedFiles ){
				let p = {func:'x', t:8, xp:`nos in (${excludedFiles.join()})`, d:-1};
				xxhrPost(rootURI + "/ajax_calls.php", p);		
			}
		}

		xxhrPost(rootURI + "/ajax_calls.php", p, ( res ) => {						
			location.reload();
		});		

		editNewsEventNo = 0;						
	}

	function _delete()
	{
		const radio = get("input[type='radio']:checked");
		if (! radio ){
			alert("Plese select an item to delete.");
			return;
		}

		if (! confirm("Are you sure you want to delete this item?"))
			return;

		const no = radio.value;

		// delete rec
		let p = {func:'NewsEvents', t:7, xp: `f3=${cmType} and f2=${no}`, d:-1, cm: cmType};
		p.x = 1;
		xxhrPost(rootURI + "/ajax_calls.php", p, ( res ) => {			

			console.log( res);

			removeGrandParent(radio.id); //remove row

			const es = getAll("input[type='radio']");
			if (es)
				es[0].checked = true;
			
		});					

		// delete files
		p = {func:'x', t:8, xp: `f2=${no}`, d:-1};
		xxhrPost(rootURI + "/ajax_calls.php", p);				

	}

	function show( mode ){

		const cmName = cmType == 1 ? "News and Events" : "HR Updates";

		if (mode){ // add
			
			divIndex = 1;

			loadDetails( {caption: `Add ${cmName}`} );

		}else{ //edit

			const e = get("input[type='radio']:checked");
			if (!e){
				alert("Please select an item to delete.")
				return;
			}

			editNewsEventNo = e.value;						
			let p = {func:'GetRec', t:7, xp: `f3=${cmType} and f2=${editNewsEventNo}`, d:0};
			p.f = 'startdate|title|intro|location|content';

			xxhrPost(rootURI + "/ajax_calls.php", p, ( res ) => {			

				const ret = JSON.parse(res);
				ret.caption = `Update ${cmName}`;
				loadDetails(ret);

			})

			// get files
			p = {func:'GetMultiRecs', t:8, f:'nos|filename', xp:`f2=${editNewsEventNo}`}
			xxhrPost(rootURI + "/ajax_calls.php", p, ( res ) => {			
				
				const ret = JSON.parse(res);
				const div = getById('edit_file_list');

				let es = '';
				for( key in ret){
					const rec = ret[key];					
					const id = `edit_file${key}`;

					es += 
						`<div id='${id}' class='aligner wp-90'>
							<label class='fw-100'>${rec.filename}</label>
							<p class='flex-1 ta-r '>
							<a class='simplelink' href="javascript:excludeFile('${id}', ${rec.nos})">Remove</a>
							</p>
						</div>`;
				}
				div.innerHTML = es;
				
			})

		}
	}	

	function hide(){

		editNewsEventNo = 0;
		excludedFiles = [];
		removeChildren('file_list');
		removeChildren('edit_file_list');

		dimBack(false);
		hideItem(boxId);

	}

	function loadDetails( data ){

		getById('caption').innerHTML = data.caption;
		getById('f_date').value = data.startdate ? data.startdate : '';
		getById('f_title').value = data.title ? data.title : '';
		getById('f_intro').value = data.intro ? data.intro : '';
		getById('f_content').value = data.content ? data.content : '';
		getById('f_link').value = data.location ? data.location : '';

		dimBack();
		CenterItem(boxId);

	}

}

function excludeFile(eId, cmNo){	
	
	excludedFiles.push(cmNo);
	removeChild(eId);	
}

function newFile() {

	const div = getById('file_list');
	divIndex++;

	let newdiv = document.createElement('div');
	const name = 'my'+ divIndex +'Div';

	newdiv.setAttribute('id', name);
	newdiv.setAttribute('class', 'py-2');
	newdiv.innerHTML = 
		`<div class='aligner wp-90'>
			<input class='ContentTextNormal' type='file' required id='" + divIndex + "' name='news_files' >
			<p class='flex-1 ta-r'>
			<a href=\"javascript:removeChild('${name}')\">Remove</a>
			</p>
		</div>`;	
	
	div.appendChild(newdiv);

}

