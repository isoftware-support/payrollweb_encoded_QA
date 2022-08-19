    
    // global vars
    var deletedNos;

    // events

    //alert("xxx");


    function uploadAttdLogs(){

        let file = getById("import-log-file").files[0];  // file from input
        if (! file) return;

        let start = get("input[name='cutoff_nav_start']").value;
        let end = get("input[name='cutoff_nav_end']").value;

        if (! confirm('Uploaded attendances will be saved in cut-off  ' +  
            DateFormat(start, 'd-M-Y') + " - " + DateFormat(end, 'd-M-Y') ) ){

            // rest file selected
            let file =  getById("import-log-file");
            if (file) file.value = "";  

            return;  
        } 

        busy.show2();      

        let xhr = new XMLHttpRequest();
        let formData = new FormData();

        // team mode upload
        if ( isTeamMode ){
            
            let memberNo = getById("attd_team_members").value;

            formData.append('tm',1);
            formData.append('tmm', memberNo);            
        }

        // debug
        // formData.append('debug', 1);

        formData.append("import-log-file", file); 
        formData.append("dt", start);
        xhr.open("POST", 'xhtml_response.php?q=UploadAttdLogs' + _session_vars, true);
        xhr.onload = function( res ){
            
            // alert(this.responseText);
            //console.log( this.responseText);

            if (this.status == 200) showUploadedAttdLogs(this.responseText);                     
        };
        xhr.send(formData);

    }

    function loadUploadedAttendances(){
        
        busy.show2(); 

        var posts = [];
        var e;

        posts['dts'] = get("input[name='cutoff_nav_start']").value;
        posts['dte'] = get("input[name='cutoff_nav_end']").value;


        var tmm ="";
        if (isTeamMode){
            let member = get("select[name='team_emp']").value;
            posts['tmm'] = member;
        }
        

        // filters
        // get show invalid        
        e = get("#cutoff_nav_show_raw:checked");
        posts['fi'] = 1;
        if (e) posts['fi'] = "0";

        // attendance filter
        var attds = [];        
        e = get("#chk_filter:checked");
        if ( e ){
            let es = getAll("input[name='cutoff_attdTypes']:checked");
            for(var i = 0; i < es.length; i++){
                e = es[i];
                attds.push(e.dataset.c + "," + e.dataset.v);
            }
            posts['fa'] = attds.join("|");
        }        

        // auploaded attds filter
        e = get('#filter_attd_upload:checked');
        if ( e ){
            var fu = [];
            let es = getAll(".attd_upload_filter_items:checked");
            for(var i = 0; i < es.length; i++){
                fu.push( es[i].dataset.f );
            }
            posts['fu'] = fu.join("|");
        }

        // posts['debug'] = 1;
        // console.log( posts);

        let url = 'xhtml_response.php?q=LoadUploadedAttdLogs' + _session_vars;
        xxhrPost(url, posts, showUploadedAttdLogs);

    }

    function showUploadedAttdLogs(res){        
        
        console.log(res);

        busy.hide();        
        let file =  getById("import-log-file");
        if (file) file.value = "";  // rest file selected

        var data = JSON.parse(res);
        getById('uploaded-attds').innerHTML = data.html;

        if ( data.error ) alert(data.error);

        // hide or show upload button
        let e = get("#attd_upload_button");
        if ( e ){
            if ( parseInt(data.locked) ){                        
                e.innerHTML = "";           
            }else{
                e.innerHTML = data.btn;
            }
        }

        // show jobs if any
        showAttendanceJobs();        

        $('tr.row-stripe:odd').addClass('DataRowStripe');    
        
        // for floating buttons
            if ( isTeamMode ) xy();
            // remove floating delete button if no bottom delete button 
            if (! get('#delete-uploaded-attd') ){

                // remove image
                let es = getAll('#floating_back3, #floating_img3');
                for(var i= 0; i < es.length; i++ ){
                    let e = es[i];
                    e.parentNode.removeChild(e);
                }                
            }

        //console.log(data);
            
    }

    function deleteUploadedAttendances(){        

        let chks = getAll("input.uploaded-attd-row:checked");

        if ( ! chks.length ){
            alert("Please select uploaded attendance to delete!");
            return;
        }
        
        if (! confirm("Delete selected entries?") ) return;

        var a =[];
        for(var i = 0; i < chks.length; i++){

            let id = chks[i].dataset.id;
            a.push( chks[i].dataset.id);            
        }
        
        var tmm = '';
        if (isTeamMode){
            tmm = "&tmm="+ getById("attd_team_members").value;
        }

        busy.show2(); 

        deletedNos = a.join(",");

        // alert( deletedNos);

        xxhr('GET', 'xhtml_response.php?q=delUploadAttd&no='+ deletedNos + tmm + _session_vars,             
        function(){
               
            const ids = deletedNos.split(",");        

            for(var i = ids.length -1; i >= 0; i--){            
                const chk = get("#chk-attd-"+ ids[i]);
                const row = chk.parentElement.parentElement.rowIndex;
                get('#table-upload-attd').deleteRow(row);
            }

            deletedNos = "";

            $('tr.row-stripe').removeClass("DataRowStripe");
            $('tr.row-stripe:odd').addClass('DataRowStripe');    

            // delete total row display
            const tr = get("#attd-total-row");
            if (tr) {
                get('#table-upload-attd').deleteRow(tr.rowIndex);
            }

            busy.hide(); 

        });
    }

    function selectAll_UploadedAttds(e){

        let chks = getAll("input.uploaded-attd-row");    
        for(var i = 0; i < chks.length; i++){
            let chk = chks[i];
            chk.checked = e.checked;
        }
    }

    function selectAllapr_UploadedAttds(e){
        
        let chks = getAll("input.uploaded-attd-apr");
        for(var i = 0; i < chks.length; i++){
            chks[i].checked =  e.checked;
        }

    }

    function approveAttd( approval ){

        var chks = getApprovalChecked();
        if ( ! chks ) return;

        busy.show2(); 

        // get hours
        let edits = getAll('input.uploaded-attd[type="text"]');

        var nos = [];
        var hours = [];
        for(var i= 0; i < chks.length; i++){

            // no
            let tr = chks[i].parentNode.parentNode;
            let no = tr.dataset.no;
            nos.push( no );            

            // approved hours
            for( var j=0; j < edits.length; j++){
                let edit = edits[j];
                if ( edit.dataset.no == no ){
                    let hour = parseFloat(edit.value);
                    hours.push( hour);
                }
            }
        }

        var data = {};
        data.nos = nos.join('|');
        data.hours = hours.join('|');     
        data.approval = approval;   
        data.role = chks[0].dataset.role;
        // data.debug = 1;

        data.dts = get("input[name='cutoff_nav_start']").value;
        data.tmm = get("select[name='team_emp']").value;

        // console.log(data);

        xxhrPost("xhtml_response.php?q=apprAttd"+ _session_vars, data, 
        function(res){
                       
            let ret = JSON.parse(res);
            
            let data = ret.data;
            let approved_hours = ret.approved_hours;

            //console.log( data);
            console.log( approved_hours);

            for(var i = 0; i < data.length; i++){

                let item = data[i];

                // show approval
                let td = getById('uploaded-attd-apr'+ item.role + "-" + item.no);
                if (td) td.innerHTML = item.approvalHTML;

                // show overall status
                let img = getById('uploaded-attd-img-stat-'+ item.no);
                if ( img ){

                    var _class = 'stat-pending';
                    if (item.status == "1"){
                        _class = 'stat-approved';
                    }else if( item.status == "-1"){
                        _class = 'stat-disapproved';
                    }
                    img.className = _class;
                }            

                // show actual approved hours
                let edit = getById("uploaded-attd-apr_edit-"+ item.no);
                if (edit) edit.value = item.appliedHours;

                // console.log(item);            
            }

            // clear selected checboxes
            let chks = getApprovalChecked();
            for(var i = 0; i < chks.length; i++){
                chks[i].checked = false;
            }

            let chk = get('#select_all_apr');
            if ( chk ) chk.checked= false;
            busy.hide(); 

            // approved hours
            let td = getById("totalApproved");
            if ( td)
                td.innerHTML = "Approved: " + approved_hours;
            

        });        
    }

    function getApprovalChecked(){

        let chks = getAll("input.uploaded-attd-apr:checked");

        if ( ! chks.length ){
            alert("No selected entry for approval.")
            return 0;
        }
        return chks;
    }


