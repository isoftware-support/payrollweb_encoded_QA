


var selected_id = -1;
var selected_no = -1;

function dismiss_member_alert(e){
	
	

	const id = e.dataset.id

	xxhrPost(PAYROLLWEB_URI + "/ajax_calls.php", {func: 'dms_mem_alrt', id: id}, (res) => {

		const ret = JSON.parse(res);

		// fade parent
		e.parentElement.classList.add("anim-hide-item");

		removeParent("member_alert_" + id)

		// remove group if none left
		setTimeout( () => {
			const es = getAll("div.member_alert_entries")
			if ( ! es.length ) removeMe("member_alerts")
		}, 400)

	})

}

function acknowledgeAttdWarning(e){	

	selected_id = e.dataset.id;
	selected_no = e.dataset.no;

	_showAckBox();
	return false;
}


function submitAttdWarningAcknowledgement(t){	

	if (t == 0){   // close box
		_showAckBox(false);
	}else if(t == 1){
		
		let remarks = get("#attd_warning_txt").value;
		if ( !remarks) return;

		let no = "&no=" + selected_id;
		let r = "&r=" + remarks;

		let url = PAYROLLWEB_URI + "/xhtml_response.php?q=acknowledgeAttdWarningItem"+ no + r + _session_vars;
		xxhrGet(url, function(res){
			
			let e = get("#attd_warning_entry_"+ selected_no);
			e.parentNode.removeChild(e);
			
			_showAckBox(false);

			msgBox("Acknowledgement remarks submitted.");

			// remove section if empty
			let entries = getAll(".class_attd_warning_entries");
			if ( ! entries.length ){
				let e = get("#alert_tardies_absents_section");
				e.parentNode.removeChild(e);
			}
		});
	}

}

function _showAckBox(show = true){

	let label = get("#attd_warning_title_id");
	label.innerHTML = "Acknowledgement Remark (No." + selected_no + ")";

	let id = "#attd_warning_note";
	let box = get(id );	

	if ( show ){

    box.classList.remove("d-none");
    dimBack(true, 'dimback', ()=> submitAttdWarningAcknowledgement(0) )
    CenterItem(id);

		let txt = get("#attd_warning_txt");
		txt.value = "";
		txt.focus();

	}else{
		dimBack(false, 'dimback');
		box.classList.add("d-none");
	}

}