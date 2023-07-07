	

		
	//UPDATE Ticket Rule	
	$(document).ready(function(){
		
		// after ui load element status
			alerts_items_status()
		// -----------------------------
	

		// remove input text auto suggest
		const txts = getAll("input[type='text']");
		txts.forEach((e) => {
			e.autocomplete = 'off';
		})		

		/* 8749 upgraded to self save components
		//save req max hours settings
		$("#UpdateReqRules").click( function(){						

			let f=[], v=[], xp=[];
			let chks, v2, v3;

			//coa
			let c = $("input#coa_max").prop('checked') ? 1 : 0;
			let v1 = $("input#coa_max_hours").val();
			if (isEmpty(v1)) v1 = 0;			
			
			let t = "'RQST_RULES'";

				f.push('t|c|v1|v2');
				v.push(t+"|"+c+"|"+v1+"|1.5");
				xp.push("t="+t+" and v2 = 1.5");

				//ot
				c = $("input#ot_max").prop('checked') ? 1 : 0;
				v1 = $("input#ot_max_hours").val();			
				if (isEmpty(v1)) v1 = 0;
				f.push('t|c|v1|v2')
				v.push(t+"|"+c+"|"+v1+"|2.5");
				xp.push("t="+t+" and v2 = 2.5");

				//leaves Max
				c = $("input#leave_max").prop('checked') ? 1 : 0;
				v1 = $("input#leave_max_hours").val();			
				if (isEmpty(v1)) v1 = 0;
				f.push('t|c|v1|v2');
				v.push(t+"|"+c+"|"+v1+"|3.5");
				xp.push("t="+t+" and v2 = 3.5");
					
				//leaves Min
				c = $("input#leave_min").prop('checked') ? 1 : 0;
				v1 = $("input#leave_min_hours").val();			
				if (isEmpty(v1)) v1 = 0;
				f.push('t|c|v1|v2');
				v.push(t+"|"+c+"|"+v1+"|3.6");
				xp.push("t="+t+" and v2 = 3.6");

				//leaves - disable via shift
				c = $("input#leave_disable_shift").prop('checked') ? 1 : 0;
				f.push('t|c|v2');
				v.push(t+"|"+c+"|3.7");
				xp.push("t="+t+" and v2 = 3.7");

				//leaves - disable via shift
				c = $("input#leave_disable_hours").prop('checked') ? 1 : 0;
				f.push('t|c|v2');
				v.push(t+"|"+c+"|3.8");
				xp.push("t="+t+" and v2 = 3.8");

				//leaves - disable duration
				c = $("input#leave_disable_duration").prop('checked') ? 1 : 0;
				f.push('t|c|v2');
				v.push(t+"|"+c+"|3.9");
				xp.push("t="+t+" and v2 = 3.9");

				//leaves - enable selective hours mode + list hours
				c = $("input#leave_selective_hours").prop('checked') ? 1 : 0;
				v3 = $("input#leave_hours_list").val();
				f.push('t|c|v2|v3');
				v.push(t+"|"+c+"|3.11"+"|"+v3);
				xp.push("t="+t+" and v2 = 3.11");

				// leaves - enable batch filing			
				c = getById("leave_batch_filing").checked ? 1 : 0;
				f.push( 't|c|v2');
				v.push( [t,c,3.12].join("|") );
				xp.push( "t="+ t +" and v2 = 3.12");

			// leave specific rule - AFTER				
				chks = getByName("lv_specific_rule");
				chks.forEach((e) => {

					let t = "'RQST_RULES_LV_BEFORE'";
					if ( e.dataset.t == 'after')
						t = "'RQST_RULES_LV_AFTER'";

					v1 = getById( e.dataset.tx ).value;  
					if ( !v1 || isNaN(v1) ) v1 = 0;

					v2 = e.dataset.c;													
					c = e.checked ? 1 : 0;

					f.push( 't|c|v1|v2')
					v.push( [t, c, v1, v2 ].join("|") );
					xp.push( 't='+ t +" and v2 ="+ v2 );
				})

			$.post('../ajax_calls.php', 
				{func:'UpdateSettings', f:f.join("|:|"), v:v.join("|:|"), xp:xp.join("|:|") },
				function(data){
					 // console.log(data);
				}
			);		
		});
		*/

		// put leaves specific rules
		if ( currentSection == "RequestSchedule" || currentSection == "RequestRules" ){
		
			xxhrPost('../ajax_calls.php', {func:'GetMultiRecs', t:1, f:"fc|fv1|fv2|f1", 
			xp:"f1 in ('RQST_RULES_LV_BEFORE','RQST_RULES_LV_AFTER')"},  
			( res ) => {

				const ret = JSON.parse(res);			
				Object.values(ret).forEach( item => {

					const type = item['typename'] == 'RQST_RULES_LV_BEFORE' ? 'before' : 'after';

					let id = `lv_${type}_chk_` + item.value2;
					let el = getById(id)
					if ( el ) el.checked = item.code == 1 ? true : false;

					id = `lv_${type}_` + item.value2;
					el = getById(id)
					if ( el ) el.value = item.value1;

				});
				
			});
		}

		//put setting value
		const e = $("input#coa_max");
		if (e.length){
			
			$.post('../ajax_calls.php', {func:'GetMultiRecs', t:1, f:"code|value1|value2|value3", k:"value2",
				xp:"typename='RQST_RULES' and value2 in (1.5, 2.5, 3.5, 3.6, 3.7, 3.8, 3.9, 3.11, 3.12)" }, 
			function(data){


				const aRet = JSON.parse(data);							

				if (!isEmpty(aRet)){

					console.log( 'data', aRet)

					let row = aRet['1.5'];
					if ( row ){
						$("input#coa_max").prop('checked', ( (row.code == "1") ? true : false) );
						$("input#coa_max_hours").prop('value', row.value1);
					}

					row = aRet['2.5'];
					if ( row ){
						$("input#ot_max").prop('checked', ( (row.code == "1") ? true : false) );
						$("input#ot_max_hours").prop('value', row.value1);
					}

					row = aRet['3.5'];					
					if ( row ){
						$("input#leave_max").prop('checked', ( (row.code == "1") ? true : false) );
						$("input#leave_max_hours").prop('value', row.value1);
					}

					row = aRet['3.6'];
					if ( row ){
						$("input#leave_min").prop('checked', ( (row.code == "1") ? true : false) );
						$("input#leave_min_hours").prop('value', row.value1);
					}

					row = aRet['3.7'];
					if ( row ){
						$("input#leave_disable_shift").prop('checked', ( (row.code == "1") ? true : false) );
					}

					row = aRet['3.8'];
					if ( row ){
						$("input#leave_disable_hours").prop('checked', ( (row.code == "1") ? true : false) );
					}

					row = aRet['3.9'];
					if ( row ){
						$("input#leave_disable_duration").prop('checked', ( (row.code == "1") ? true : false) );
					}

					row = aRet['3.11'];
					if ( row ){
						$("input#leave_selective_hours").prop('checked', ( (row.code == "1") ? true : false) );
						$("input#leave_hours_list").val(row.value3);
					}

					row = aRet['3.12'];
					if ( row ){
						getById('leave_batch_filing').checked = ( (row.code == "1") ? true : false);
					}

				}
			});
		}


		//Ticket Request rule
		/* #8749 - upgraded to self update components

		$("#btnTicketRule").click(function(){
			
			// var busy = new BusyGif("#btnTicketRule");
			busy.show2();

			var chk, val, xp, tn, cd, d;
			
			//date rules
				//before cutoff				
				val = $("input#chk_tkt_before").prop('checked') ? 1 :0;
				xp = "t='RQST_RULES' and v2=8.1";
				tn = "'RQST_RULES'";	
				d = $("input#txt_tkt_before").val();
				if (!d) d = 0;
				$.post('../ajax_calls.php', {func:'UpdateSettings', f:'t|c|v2|v1', v:tn+'|'+val+'|8.1|'+ d, xp:xp});

				//after cutoff
				val = $("input#chk_tkt_after").prop('checked') ? 1 :0;
				xp = "t='RQST_RULES' and v2=8.2";
				tn = "'RQST_RULES'";	
				d = $("input#txt_tkt_after").val();
				if (!d) d = 0;
				$.post('../ajax_calls.php', {func:'UpdateSettings', f:'t|c|v2|v1', v:tn+'|'+val+'|8.2|'+ d, xp:xp});

				//before target date
				val = $("input#chk_tkt_target_before").prop('checked') ? 1 :0;
				xp = "t='RQST_RULES' and v2=8.3";
				tn = "'RQST_RULES'";	
				d = $("input#txt_tkt_target_before").val();
				if (!d) d = 0;
				$.post('../ajax_calls.php', {func:'UpdateSettings', f:'t|c|v2|v1', v:tn+'|'+val+'|8.3|'+ d, xp:xp});

				//before target date
				val = $("input#chk_tkt_target_after").prop('checked') ? 1 :0;
				xp = "t='RQST_RULES' and v2=8.4";
				tn = "'RQST_RULES'";	
				d = $("input#txt_tkt_target_after").val();
				if (!d) d = 0;
				$.post('../ajax_calls.php', {func:'UpdateSettings', f:'t|c|v2|v1', v:tn+'|'+val+'|8.4|'+ d, xp:xp});

			//reimbursement ticket rule
				
				val = $("input[name='chkTicketRule_reim']").prop('checked') ? 1 :0;
				$.post('../ajax_calls.php', {func:'UpdateSettings', f:'t|c|v1', v:"'TKT_REQ'|4|"+val , xp:"t='TKT_REQ' and c=4"});

			//attendance ticket rules
				chk = $("input[name='chkTicketRule']");
				val = $(chk).prop('checked') ? 1 : 0;
				xp = $(chk).data('exp');				
				tn = $(chk).data('t');
				cd = $(chk).data('c');				
				// alert(xp + ' - ' + tn + ' - ' + cd);
				$.post('../ajax_calls.php', {func:'UpdateSettings', f:'t|c|v1', v:tn+'|'+cd+'|'+val, xp:xp});

			//attendance types
				cd = [];
				val = [];
				$("input:checkbox[name='attdtypes']").each(function(){
					chk = $(this);
					if ($(chk).prop("checked")){
						var aTxt = $(this).data('c').split(",");
						cd.push(aTxt[0]);
						val.push(aTxt[1]);
					}
				});

				$.post('../ajax_calls.php', {func:'UpdateSettings', f:'t|c|v3', v:"'TKT_REQ'|2|'" + cd.join(",") + "'", xp:"t='TKT_REQ' and c=2"});

				$.post('../ajax_calls.php', {func:'UpdateSettings', f:'t|c|v3', v:"'TKT_REQ'|3|'" + val.join(",") + "'", xp:"t='TKT_REQ' and c=3"},			
					function(data){
						busy.hide();		
					});	

		});
		*/

		//ticket approval - #8749  upgraded to selfsave components
		/* 
		$("#btnTicketRule_apr").click(function(){
			// var busy = new BusyGif("#btnTicketRule_apr");
			busy.show2();

			var chk, val, xp, tn, cd, d;

			//date approval rules
				//before cutoff				
				val = $("input#chk_tkt_before_apr").prop('checked') ? 1 :0;
				xp = "t='APRV_RULES' and v2=8.1";
				tn = "'APRV_RULES'";	
				d = $("input#txt_tkt_before_apr").val();
				if (!d) d = 0;
				$.post('../ajax_calls.php', {func:'UpdateSettings', f:'t|c|v2|v1', v:tn+'|'+val+'|8.1|'+ d, xp:xp});

				//after cutoff
				val = $("input#chk_tkt_after_apr").prop('checked') ? 1 :0;
				xp = "t='APRV_RULES' and v2=8.2";
				tn = "'APRV_RULES'";	
				d = $("input#txt_tkt_after_apr").val();
				if (!d) d = 0;
				$.post('../ajax_calls.php', {func:'UpdateSettings', f:'t|c|v2|v1', v:tn+'|'+val+'|8.2|'+ d, xp:xp});

				//before target date
				val = $("input#chk_tkt_target_before_apr").prop('checked') ? 1 :0;
				xp = "t='APRV_RULES' and v2=8.3";
				tn = "'APRV_RULES'";	
				d = $("input#txt_tkt_target_before_apr").val();
				if (!d) d = 0;
				$.post('../ajax_calls.php', {func:'UpdateSettings', f:'t|c|v2|v1', v:tn+'|'+val+'|8.3|'+ d, xp:xp});

				//before target date
				val = $("input#chk_tkt_target_after_apr").prop('checked') ? 1 :0;
				xp = "t='APRV_RULES' and v2=8.4";
				tn = "'APRV_RULES'";	
				d = $("input#txt_tkt_target_after_apr").val();
				if (!d) d = 0;
				$.post('../ajax_calls.php', {func:'UpdateSettings', f:'t|c|v2|v1', v:tn+'|'+val+'|8.4|'+ d, xp:xp});

				// $ticket_expiry_rule = GetSetting_SetReturn( "typename='REQ_APR_GENERAL_RULES' and description='ticket_expiry_rule'", "code", "1", "checked", "", $con);	
				// $ticket_expiry_days = GetSetting( "typename='REQ_APR_GENERAL_RULES' and description='ticket_expiry_rule'", "value1", "", $con); 
				// expiry
				val = $("input#ticket_expiry_rule").prop('checked') ? 1 :0;
				xp = "t='REQ_APR_GENERAL_RULES' and d='TicketExpiryRule'";
				tn = "'REQ_APR_GENERAL_RULES'";	
				d = "'TicketExpiryRule'";
				days = $("input#ticket_expiry_days").val();
				if (!d) days = 0;
				$.post('../ajax_calls.php', {func:'UpdateSettings', f:'t|d|c|v1', v:tn+'|'+d+'|'+val+'|'+ days, xp:xp} );

			// ticket approval rules
			var chk = $("input[name='chkTRA']");
			$(chk).each(function(){

				var val = $(this).prop('checked') ? 1 : 0;
				var xp = $(this).data('exp');				
				var tn = $(this).data('t');
				var cd = $(this).data('c');

				$.post('../ajax_calls.php', {func:'UpdateSettings', f:'t|c|v1', v:tn+'|'+cd+'|'+val, xp:xp}, function(data){
						//alert(data);
				});
            });

			//posting of approved ticket
			var cbx = $("select[name='TRA1_action']");
			var xp = $(cbx).data("exp");
      var txt = $(cbx).val();

      var posting = $.post('../ajax_calls.php', {func:'UpdateSettings', f:'t|c|v3', v:"'TKT_APR'|1|'"+txt+"'", xp:xp});
      posting.done(function(data){
      	// alert(data + ' - ' + xp + ' - ' + txt);
      	busy.hide();
      });

		});
		*/

		// 	#3263  - upgraded to self update elements
		/*	
		$("#UpdateAttendanceRules").click(function(){
			busy.show2();

			let v = $("#upload_timelogs").prop('checked') ? "1" : "0";
			let t = "'UPLOAD_TIMELOGS'";
			let xp = "t="+ t;

            let post = $.post('../ajax_calls.php', {func:'UpdateSettings', f:'t|c', v:t +"|"+v, xp:xp});
            post.done(function(data){
            	//alert(data);
            	busy.hide();
            });
		});
		*/
		

	});

function collect_attd_types_tktreq(){

	const chks = getAll("[name='attdtypes']:checked");
	const codes = []
	const rates = []
	chks.forEach( (chk) => {
		codes.push( chk.dataset.c )
		rates.push( chk.dataset.r )
	})


	// update attd types
	
		// codes
		const e = get("#tktrq_attd_types")
		e.value = codes.join(',')
		e.dataset.c = '2'
		e.onchange(e)

		// rates
		e.value = rates.join(',')
		e.dataset.c = '3'
		e.onchange(e)

	// ------------------
}


function passwordRuleLabel( e ){
	
	const id = `lbl_${e.id}`
	let num = e.value;
	if ( isEmpty(num) ) num = 0
	
	const label = getById(id)	
	const orig = label.dataset.v
	const txt = label.innerHTML;
	
	// keep new value
	label.dataset.v = num

	// console.log( 'id', id, 'orig', orig, 'num', num, 'txt',txt)

	label.innerHTML = txt.replace(orig, num);
}

function alerts_items_status(){

	// send alerts immediately
	let el = get("#send_imd")
	if ( el ){
		const div = get(".alerts_immidiately")
		disableChildren( div, ! el.checked)
	}
	
	// send alerts by batch
	el = get("#send_batch")
	if ( el ){
		const div = get(".alerts_by_batch")
		console.log('div', div)
		disableChildren( div, ! el.checked)	
	}

	// send summary alerts
	el = get( "#send_sum");
	if ( el ){
		const div = get( ".summary_alerts");
		disableChildren( div, ! el.checked)
	}

}

 
function getchecked() {

      var newtxt = '';
      var chkbx = document.getElementsByTagName('input');

        for(var i = 0; i < chkbx.length; i ++) 
    {
      if(chkbx[i].type == 'checkbox' && chkbx[i].checked === true) {
      if(newtxt.length !== 0) {
        newtxt += ',';
        }
        newtxt += chkbx[i].id;
    }

    }

     document.EmployeeProfile.show_chex.value = newtxt;

}
  
function getchecked2() {

      var newtxt = '';
      var chkbx = document.getElementsByTagName('input');

        for(var i = 0; i < chkbx.length; i ++) 
    {
      if(chkbx[i].type == 'checkbox' && chkbx[i].checked === true) {
      if(newtxt.length !== 0) {
        newtxt += ',';
        }
        newtxt += chkbx[i].id;
    }

    }

	document.EmployeeProfile.update_chex.value = newtxt;

}



function onSubmitForm(FormName){		

	f = document.forms[FormName];
	
	switch(FormName){
		case 'ActivityLogConfig':
				x = findControl(f, 'Actions[]');
				for (i = 0; i < x.options.length; i++) {
				    x.options[i].selected = true;
				}				
				y = findControl(f, 'LogActions[]');
				for (i = 0; i < y.options.length; i++) {
				    y.options[i].selected = true;
				}	
			break;
		case 'HomePage':				
				if(!IsInteger(f.LatestNews.value)){
					alert('Input is not a valid integer!');
					f.LatestNews.focus();
					f.LatestNews.select();
					return false;
				}
				if(!IsInteger(f.LatestLinks.value)){
					alert('Input is not a valid integer!');
					f.LatestLinks.focus();
					f.LatestLinks.select();
					return false;
				}
				if(!IsInteger(f.PrevBirthday.value)){
					alert('Input is not a valid integer!');
					f.PrevBirthday.focus();
					f.PrevBirthday.select();
					return false;
				}
				if(!IsInteger(f.UpComingBirthdays.value)){
					alert('Input is not a valid integer!');
					f.UpComingBirthdays.focus();
					f.UpComingBirthdays.select();
					return false;
				}
				
				
				//alert(f.cusBdayCaption.value);
				
				if(f.defNewsCaption.checked==false && trim(f.cusNewsCaption.value) ===""){
					alert('Please input a caption.');
					f.cusNewsCaption.focus();
					f.cusNewsCaption.select();
					return false;
				}				
				
				
				if(f.defBdayCaption.checked==false && trim(f.cusBdayCaption.value) ===""){
					alert('Please input a caption.');
					f.cusBdayCaption.focus();
					f.cusBdayCaption.select();
					return false;
				}
				
				if(f.defLinkCaption.checked==false && trim(f.cusLinkCaption.value) ===""){
					alert('Please input a caption.');
					f.cusLinkCaption.focus();
					f.cusLinkCaption.select();
					return false;
				}
				
				if(f.defNewHireCaption.checked==false && trim(f.cusNewHireCaption.value) ===""){
					alert('Please input a caption.');
					f.cusNewHireCaption.focus();
					f.cusNewHireCaption.select();
					return false;
				}
				
				if(f.defHRUpdateCaption.checked==false && trim(f.curHRUpdateCaption.value) ===""){
					alert('Please input a caption.');
					f.curHRUpdateCaption.focus();
					f.curHRUpdateCaption.select();
					return false;
				}								
					
			break;
		case 'Request':

				if(!IsInteger(f.CutOffThreshold1.value)){
					alert('Input is not a valid integer!');
					f.CutOffThreshold1.focus();
					f.CutOffThreshold1.select();
					return false;
				}
				if(!IsInteger(f.CutOffThreshold2.value)){
					alert('Input is not a valid integer!');
					f.CutOffThreshold2.focus();
					f.CutOffThreshold2.select();
					return false;
				}

				if(f.defNewsCaption.checked==true && trim(f.cusNewsCaption.value) ===""){
					alert('Please input a caption.');
					f.cusNewsCaption.focus();
					f.cusNewsCaption.select();
					return false;
				}					

				//if()

			break;
		case 'EmailConfig':
				if(trim(f.MailNotificationDisplayName.value)=="" || trim(f.MailNotificationDisplayName.value)==null){
					alert('Please enter a valid Display Name!');
					f.MailNotificationDisplayName.focus();
					f.MailNotificationDisplayName.select();
					return false;
				}
				if(trim(f.MailNotificationEmailAccount.value)=="" || trim(f.MailNotificationEmailAccount.value)==null){
					alert('Please enter a valid Email Account!');
					f.MailNotificationEmailAccount.focus();
					f.MailNotificationEmailAccount.select();
					return false;
				}
				if(!onValidEmail(f.MailNotificationEmailAccount.value)){
					alert('Please enter a valid Email Account!');
					f.MailNotificationEmailAccount.focus();
					f.MailNotificationEmailAccount.select();
					return false;
				}
				if(trim(f.POP3Server.value)=="" || trim(f.POP3Server.value)==null){
					alert('Please enter a valid Server Name!');
					f.POP3Server.focus();
					f.POP3Server.select();
					return false;
				}
				if(trim(f.POP3UserName.value)=="" || trim(f.POP3UserName.value)==null){
					alert('Please enter a valid User Name!');
					f.POP3UserName.focus();
					f.POP3UserName.select();
					return false;
				}
			break;

		case "Approval":

			break;

	}
	return true;
}

// others
function approvalEmailTxt(el = null)
{
	
	const checked = getById("other_approval_email_line_chk").checked;	
	getById("other_approval_email_line_txt").disabled = !checked;

	// // capture texts to temp element event chkbox is unchecked
	// getById("other_approval_email_line_txt_tmp").value =
	// getById("other_approval_email_line_txt").value;
}



function trim(s){   
	return s.replace(/^\s+|\s+$/g, '');
} 

function IsInteger(sText){
	var ValidChars = "0123456789"; 			
	var IsNumber=true;
	var Char;	
	IsNumber = !(sText == '' || sText == null);
	for (i = 0; i < sText.length && IsNumber == true; i++) { 
		Char = sText.charAt(i); 
		if (ValidChars.indexOf(Char) == -1) {
			IsNumber = false;
		}	
	}	
	return IsNumber;
}

function onValidEmail(emailStr) {
    var emailPat=/^(.+)@(.+)$/
    var specialChars="\\(\\)<>@,;:\\\\\\\"\\.\\[\\]"
    var validChars="\[^\\s" + specialChars + "\]"
    var quotedUser="(\"[^\"]*\")"
    var ipDomainPat=/^\[(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\]$/
    var atom=validChars + '+'
    var word="(" + atom + "|" + quotedUser + ")"
    var userPat=new RegExp("^" + word + "(\\." + word + ")*$")
    var domainPat=new RegExp("^" + atom + "(\\." + atom +")*$")
    var matchArray=emailStr.match(emailPat)
    if (matchArray==null) {
          return false;
    }
    var user=matchArray[1]
    var domain=matchArray[2]
    if (user.match(userPat)==null) {
      return false;
    }
    var IPArray=domain.match(ipDomainPat)
    if (IPArray!=null) {
        for (var i=1;i<=4;i++) {
            if (IPArray[i]>255) {
              return false;
            }
		}
      return true;
    }
    var domainArray=domain.match(domainPat);
    if (domainArray==null) {
      return false;
    }
    var atomPat=new RegExp(atom,"g");
    var domArr=domain.match(atomPat);
    var len=domArr.length;
    if (domArr[domArr.length-1].length<2 || domArr[domArr.length-1].length>3) {
      return false;
    }
    if (len<2) {
      return false;
    }
    return true;
}

function transferFrom(btn, source, dest){

  var f, s, d, i, xx;
  f = document.forms["ActivityLogConfig"];
  
  s = get("[name='"+ source +"']")
  d = get("[name='"+ dest +"']")

  // s = findControl(f, source);
  // d = findControl(f, dest);	

  let ids = []
	for (i = s.options.length-1; i >= 0; i--) {
	    if (s.options[i].selected) {

	    		ids.push( parseInt(s.options[i].value) )

	        xx = new Option();
	        xx.value = s.options[i].value;
	        xx.text = s.options[i].text;
	        d.options[d.options.length] = xx;
	        s.options[i] = null;
	        
	    }
	}	
	// btn.dataset.ids = ids.join(",")

  sortList(d);
	sortList(s);	

	// update component data
	const e = getById('action_code')
	ids.forEach( (i) => {
		e.dataset.n = i;
		e.value = btn.dataset.action
		e.onchange(e);
	})
	
}

function findControl(f, s){
    var i;
    for (i = 0; i < f.length; i++) {
        if (f[i].name == s) {
            return f[i];
        }
    }
    return null;
}

function sortList(d){
    var i, j;
    for (i = 0; i < d.options.length - 1; i++) {
        for (j = i+1; j < d.options.length; j++) {
            if (d.options[i].text > d.options[j].text) {
                t1 = d.options[i].text;
                t2 = d.options[i].value;
                d.options[i].text = d.options[j].text;
                d.options[i].value = d.options[j].value;
                d.options[j].text = t1;
                d.options[j].value = t2;
            }
        }
    }
}

// Brian 090908
function popitup(url) {
    newwindow=window.open(url, 'name', 'toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=0,resizable=0,width=455,height=330');
    if (window.focus) {
        newwindow.focus()
    }
	newwindow.moveTo(screen.availWidth/2-(500/2),screen.availHeight/2-(300/2));
}
