	
	if ( busy == undefined)
		var busy = new BusyGif();


		function linkItem(){

			let editLinkNo = 0;
			
			this.bindItems = ()=>{
				
				// add 
				getById('link_add').onclick = show;

				// cancel
				getById('link_cancel').onclick = hide;

				// save 
				getById('link_save').onclick = () => {

					busy.show2();
					
					const title = getById('link_title').value,
						intro = getById('link_intro').value,
						link = getById('link_url').value;

					let p = {
						func: 'x', t: 7, d: 1, sep: '|:|',
						f: 'cmtype, title, intro, location'.replaceAll(", ", "|:|"),
						v: `3|:|${title}|:|${intro}|:|${link}`,
						el: "AllowAddLinks",
					};

					// edit  mode
					if ( editLinkNo !== 0){
						p.d = 0;
						p.xp = `f3 = 3 and f2 = ${editLinkNo}`;
						p.el = "AllowEditLinks";						
					}
					
					xxhrPost(rootURI + "/ajax_calls.php", p, ( res ) => {						
						editLinkNo = 0;
						hide();
						location.reload();
					});		

				}

				// edit
				getById('link_edit').onclick = () => {
					
					const no = linkNo();

					if (no){

						busy.show2();

						const p = { func: 'GetRec', t: 7, xp:`f3 = 3 and f2 =${no}`, 
							f: 'title|intro|location'
						};

						editLinkNo = no;

						xxhrPost(rootURI + "/ajax_calls.php", p, ( res ) => {							

							// console.log( res);
							
							const ret = JSON.parse(res);

							getById('link_caption').innerHTML = "Update Link Item";
							getById('link_title').value = ret.title;
							getById('link_intro').value = ret.intro;
							getById('link_url').value = ret.location;
							show();

							busy.hide();
						});		
					}
				}

				// delete
				getById('link_delete').onclick = () => {
					
					const no = linkNo();
					
					if (no){

						if ( ! confirm("Delete Link item?") ) return;

						busy.show2();

						let p = { func: 'x', t: 7, d:-1, xp:`f3 = 3 and f2 =${no}`, el: 'AllowDeleteLinks'};
						xxhrPost(rootURI + "/ajax_calls.php", p, ( res ) => {				

							let e = get("input[type='radio']:checked");			
							removeGrandParent(e.id);

							//check any
							e = get("input[type='radio']");			
							if (e)
								e.checked = true;

							busy.hide();
						});								
					}
				}
			}

			function linkNo(){
				const e = get("input[type='radio']:checked");
				let ret = 0;
				if ( e ){
					ret = e.value;
				}else{
					alert("No Link item selected.");
				}
				return ret;
			}

			function show(){

					let caption = "Update Link Item";
					if ( !editLinkNo ){ // add
						getById('link_title').value = "";
						getById('link_intro').value = "";
						getById('link_url').value = "";
						caption = "Add Link Item"
					}
					getById('link_caption').innerHTML = caption;

					dimBack(true, '', hide );
					CenterItem(boxId);		

			}

			function hide(){
					dimBack(false);
					hideItem(boxId);
					editLinkNo = 0;
			}
		}

		const boxId = 'link_box';			
		const link = new linkItem();
		link.bindItems();
		
