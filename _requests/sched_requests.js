    
    function team_action( mode ){
        
        if (mode == 1){ //add            
            //  popWindow("popup_request.php?qid=04&rt=0", 850,300);

        }else if(mode == -1){ //delete

            //RequestNo() 
            //popWindow("popup_request.php?qid=02&uen=" + uen + "&udc=" + udc + "&r="+RequestNo(), 850,450);

        }else if(mode == 0){ //edit                 

            //if (enabled == 'true') verifyDeleteRequest("07", RequestNo(), uen, "<?php echo $_SERVER['REQUEST_URI']; ?>","rq");
        }
    }

    function js_getcheck() {
    	    

        var newtxt = '';
        var chkbx = document.getElementsByTagName('input');

        for(var i = 0; i < chkbx.length; i ++){
        	if(chkbx[i].type == 'checkbox' && chkbx[i].disabled === false && chkbx[i].checked === true ) {
        		if(newtxt.length !== 0) {
        	   newtxt += ',';
            }
            newtxt += chkbx[i].id;
        	}
        }
        document.team_rqst.arno_collect.value = newtxt;

    }
    

    function btn_approve(){ // APPROVE

        // GET REQUEST NO.
        // var userno = <?php echo json_encode($tl_approver); ?>;
        // var teamnox =<?php echo json_encode($gt_team_nox); ?>; 

        var approves = document.team_rqst.arno_collect.value;	
        var replace_apr = Array("apr1_","apr2_","apr4_");
        var regexp = new RegExp(replace_apr.join('|'),'g');  
        var aprv_btn = approves.replace(regexp,''); 

        // GET APPROVE LEVEL
        var apr_lvl = approves.match(/apr([^_]*)/gi);

        console.log( 'approves : ', approves, ' apr_lvl : ', apr_lvl, 'userno: ', userno);

        var apr_lvl_new = apr_lvl.join(",").replace(/apr/gi,"");

        // SPLIT VALUES INTO ARRAY

        var final_aprv_btn =  aprv_btn.split(',');
        var final_aprv_lvl =  apr_lvl_new.split(',');

        // GET THE SIZE OF THE ARRAY

        var aprv_btn_count =  final_aprv_btn.length;

        ajaxCall(approves,aprv_btn_count,final_aprv_btn,final_aprv_lvl,userno,teamnox,1);

            
    }
       
    function btn_disapprove(){ // DISAPPROVE
       

        // var userno = <?php echo json_encode($tl_approver); ?>;
        // var teamnox =<?php echo json_encode($gt_team_nox); ?>; 
        
        var approves = document.team_rqst.arno_collect.value;	
        var replace_apr = Array("apr1_","apr2_","apr4_");
        var regexp = new RegExp(replace_apr.join('|'),'g');  
        var aprv_btn = approves.replace(regexp,''); 

        // GET APPROVE LEVEL

        var apr_lvl = approves.match(/apr([^_]*)/gi);
        var apr_lvl_new = apr_lvl.join(",").replace(/apr/gi,"");

        // SPLIT VALUES INTO ARRAY

        var final_aprv_btn =  aprv_btn.split(',');
        var final_aprv_lvl =  apr_lvl_new.split(',');

        // GET THE SIZE OF THE ARRAY

        var aprv_btn_count =  final_aprv_btn.length;

        document.getElementById('web_id').value = final_aprv_btn;
        document.getElementById('aprv_id').value = userno;

        ajaxCall(approves, aprv_btn_count, final_aprv_btn, final_aprv_lvl, userno, teamnox, -1);	

           	
    }


    function openDisPopup(){
    	
        if (document.team_rqst.arno_collect.value){
            
            dimBack(true, 'dimback', chkCancel)
            CenterItem('popDiv')       

            const el = getById('dis_remark');
            if ( el ) el.focus();
        } 
    	
    }

    function btn_clear(){ // CLEAR
       	
        // var userno = <?php echo json_encode($tl_approver); ?>;
        // var teamnox =<?php echo json_encode($gt_team_nox); ?>; 
        var approves = document.team_rqst.arno_collect.value;	
        var replace_apr = Array("apr1_","apr2_","apr4_");
        var regexp = new RegExp(replace_apr.join('|'),'g');  
        var aprv_btn = approves.replace(regexp,''); 


        // GET APPROVE LEVEL

        var apr_lvl = approves.match(/apr([^_]*)/gi);
        var apr_lvl_new = apr_lvl.join(",").replace(/apr/gi,"");

        // SPLIT VALUES INTO ARRAY

        var final_aprv_btn =  aprv_btn.split(',');
        var final_aprv_lvl =  apr_lvl_new.split(',');

        // GET THE SIZE OF THE ARRAY

        var aprv_btn_count =  final_aprv_btn.length;

        ajaxCall(approves,aprv_btn_count,final_aprv_btn,final_aprv_lvl,userno,teamnox,0);
    	
    }


    function getFlagImage(stat_nox,webreqno){

    	var divname = "'userpopDiv'";
    	var dis_reason = "";
    	
      
    	if(stat_nox ==-1){
    		
            // dis_reason = "(<b><a class='req_disapproved' id='"+webreqno+"' href=# onclick=popuser("+divname+","+webreqno+",-1)>?</a></b>)";
    		dis_reason = "(<b><a class='req_disapproved' id='"+webreqno+"' href=# >?</a></b>)";
    		
    	}

    	
    	if(stat_nox == 0){
    	stat_nox ="<img src='img/pending.gif' />";
    	}else if(stat_nox == 1){
    	stat_nox ="<img src='img/approved.gif' />";
    	}else if(stat_nox == -1){
    	stat_nox ="<img src='img/disapproved.gif' />" + dis_reason;
    	}
    	
    	return stat_nox;
    	
    }

    function popusers(div,auno) {
  	
        var ret_this = "popuser("+div+","+auno+",-1)";
        return ret_this;

    }


    function uncheck(){ // unchecking all the checkbox
    	
    var w = document.getElementsByTagName('input'); 
        for(var i = 0; i < w.length; i++){ 
            if(w[i].type=='checkbox'){ 
              w[i].checked = false; 
    		
            }
        }
    	
    } 

    function findCheckBox() {
    	
        var inputElements = document.getElementsByTagName('input');
        var chekSelect = false;
        for (var i = 0; i < inputElements.length; i++) {
            var myElement = inputElements[i];

            if (myElement.type === "checkbox") {
                if (myElement.checked) {
                    chekSelect = true;
                    document.getElementById('clear_x').disabled=false;
    				document.getElementById('approve_x').disabled=false;
                    document.getElementById('disapprove_x').disabled=false;
                    break;
                }
            }
        }

        if(!chekSelect) {
           document.getElementById('clear_x').disabled=true;
    	   document.getElementById('approve_x').disabled=true;
           document.getElementById('disapprove_x').disabled=true;
        }
    }


    function ajaxCall(approves,array_countx,approve_rqno,approve_lvlno,userno,teamnos,stats){
    	
        // called from Scheduled request

        var xmlhttpxxx;

        if(window.XMLHttpRequest){
            xmlhttpxxx=new XMLHttpRequest();
        }else{
            xmlhttpxxx=new ActiveXObject('Microsoft.XMLHTTP');
        }

        xmlhttpxxx.onreadystatechange=function(){
            if (xmlhttpxxx.readyState==4 && xmlhttpxxx.status==200){
                
                
                const result = xmlhttpxxx.responseText;                
                // console.log(result)

                const ret = JSON.parse(result);
                // console.log('ret',ret)
                var ajaxDisplay = ret.result;

           	
            	// SEPARATE FINAL STATUS to Approver Info Display Starts
                var replace_st = Array("<br>_0_","<br>_1_","<br>_-1_");
                var regexp_st = new RegExp(replace_st.join('|'),'g');  
                var sep_st = ajaxDisplay.replace(regexp_st,''); 
                  
                 
                var flag_x = ajaxDisplay.match(/<br>_([^_]*)/gi);
                var flag_st_x = flag_x.join(",").replace(/<br>_/gi,""); 

            	var res = sep_st.split(','); // Supervisor Approvers
            	var flag_res = flag_st_x.split(","); // Final Status Display
            	
                for(i=0; i<array_countx; i++){
            	   var element_name = "apr" + approve_lvlno[i] + "_" + approve_rqno[i] + " ";
        	       var flagx_name = "flagx_" + approve_rqno[i];
            	
                   document.getElementById(element_name).innerHTML = res[i] ; // approve
            	   document.getElementById(flagx_name).innerHTML =   getFlagImage(flag_res[i],approve_rqno);
    	
                }                                                

                uncheck();
                document.team_rqst.arno_collect.value = "";

                //hide busy gif
                $("div#busygif").remove();
                $('img#floating_busygif').css('display','none');

            }            
        }

        // if disapproval - get remarks text
        let remarks = ""
        if ( stats == -1){
            remarks = uriString( getById('dis_remark').value);  
        } 

        let url = '_approvals/request_approval.php?tdcontent='+ approves +'&userno='+userno+'&tn='+teamnos+'&stats='+stats+'&tbl=WA'+
                    '&rem='+ remarks;
        xmlhttpxxx.open('GET', url,true);
        xmlhttpxxx.send();

        document.getElementById('clear_x').disabled=true;
        document.getElementById('approve_x').disabled=true;
        document.getElementById('disapprove_x').disabled=true;

    }

    function Filter_Aprlvl(teamnum,tl_no,arno){

        var rq_box = 'req_box_' + arno;

        var xmlhttp;

        if (window.XMLHttpRequest){
          xmlhttp=new XMLHttpRequest();
        }else{
          xmlhttp=new ActiveXObject('Microsoft.XMLHTTP');
        }

        xmlhttp.onreadystatechange=function(){
          
            if (xmlhttp.readyState==4 && xmlhttp.status==200){
            //document.getElementById('txtShift').innerHTML=xmlhttp.responseText;
                document.getElementById(rq_box).innerHTML = xmlhttp.responseText;
            }
        }
        
        //var dateid = document.getElementById('f_dateSchedStart').value;
        xmlhttp.open('GET','multiple_sprvr.php?tn='+teamnum+'&tl='+tl_no+'&ar='+arno,true);
        xmlhttp.send();

    }



