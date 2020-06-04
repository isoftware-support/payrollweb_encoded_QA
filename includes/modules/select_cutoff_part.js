    // alert( 'select cutoff js')    ;
    
    $(document).ready(function(){	       
        

        $("#btn_cutoff_prev").click(function(){				
            var date = $("#cutoff_nav_start").val();
            set_cutoff_date( date, -1);
            disableUploadAttdButton();
        });			

        $("#btn_cutoff_next").click(function(){				
            var date = $("#cutoff_nav_end").val();
            set_cutoff_date( date, +1);

            disableUploadAttdButton();
        });				

        $("#cutoff_nav_start, #cutoff_nav_end").change(function(){
            disableUploadAttdButton();
        });

        function disableUploadAttdButton(){
            let btn = get('#btn-upload-logs');
            if ( btn ) btn.disabled = true;
            // if ( btn ) btn.parentNode.removeChild(btn);   // remove button
        }
        
        //filter collapsed
        //var chk_filter_val = "<?php echo $chk_filter_val; ?>";
        var chk = document.getElementById("chk_filter");
        if ( chk ){
            showCutoffFilter(chk);
        }

        //set generate button name and value
        // $("#cutoff_nav_generate").attr('name',"<?php echo $cutoff_nav_generatebutton_name; ?>");
        // $("#cutoff_nav_generate").attr('value',"<?php echo $cutoff_nav_generatebutton_value; ?>");    
        $("#cutoff_nav_generate").attr('name', cutoff_nav_generatebutton_name);
        $("#cutoff_nav_generate").attr('value', cutoff_nav_generatebutton_value);    

    });


    function set_cutoff_date( date, type){

        busy.show2();

        //$.post('ajax_calls.php', {func:'getCutoff_start_end_date', t:type, d:date, p:<?php echo $cutoff_nav_payperiod; ?>}, 
        var param = {'func':'getCutoff_start_end_date', 't':type, 'd':date, 'p': cutoff_nav_payperiod};
        // console.log(param);
        
        $.post('ajax_calls.php', param, 
        function(data){   
                        
            // alert(data);
            
            var a = JSON.parse(data);
            
            $("#cutoff_nav_start").val(a.start);
            $("#cutoff_nav_end").val(a.end);               

            busy.hide();
        });				
    }	

    function showCutoffFilter(elem){

        var div = $("div.cutoff_filter_attd");
        var chk = $("#chk_filter");
        if (elem.checked){
            $(div).fadeIn('fast');
            $(chk).val("+");
        }else{
            $(div).fadeOut('fast');
            $(chk).val("-");
        }
    }

    function showMembersFilter(e){

        let div_members = get(".cutoff_emp_picker");
        let btn = get("#cutoff_nav_generate");

        let div = $("#multi_emps");
        if ( e.checked ){
            $(div).fadeIn('fast');
            div_members.style.display = "none";
            
            // btn.type="button";            
        }else{
            $(div).fadeOut('fast');
            div_members.style.display = "";

            // btn.type="submit";            
        }        

    }

    function showAttdLogsFilter(e){

        let div = get('#cutoff_filter_attd_upload');        
        if (e.checked){
            $(div).fadeIn('fast');
            div.stype.display = "none";
        }else{
            $(div).fadeOut('fast');
            div.stype.display = "";
        }

    }

    function showMultiAttendances()
    {
        
        // collect selected emps
        let emps = getAll( "input[name='team_emps']:checked" );
        if ( ! emps.length ){
            alert("Please select team members.");
            return;
        }

        // alert(1);
        busy.show2();

        let empNos=[];
        emps.forEach(function(emp, index){
            empNos.push( emp.dataset.no );
        });

        // collect attd types
        let attds=[];

        if ( getById( 'chk_filter').checked  ){

            let els = getAll( "input[name='cutoff_attdTypes']:checked" );
            els.forEach( function(el){
                attds.push( el.dataset.c );
            });
        }

        //cutoff
        let s = getById( 'cutoff_nav_start' ).value,
            e = getById( 'cutoff_nav_end' ).value,
            i = getById( 'cutoff_nav_show_raw' ).checked ? 1 : 0;        

        let l = "xhtml_response.php?q=MixedAttds&n="+ empNos.join(",") +"&s="+ s +"&e="+ e +"&p="+ cutoff_nav_payperiod +
            "&i="+ i +"&a="+ attds.join(",") + _session_vars;
        // console.log(l);
        
        xxhr("GET", l, function( ret ){

            let el = getById("uploaded-attds");
            el.innerHTML = ret;

            busy.hide();
        });

    }

    /*
    function priorSubmit(e){
        
        // multi member view
        var chk = get("#chk_multi_emps:checked");
        if ( chk ){
            showMultiAttendances();
            return false;
        }
        


        //var isAttendance = "<?php echo $cutoff_nav_is_attendance; ?>";
        var isAttendance = cutoff_nav_is_attendance;
        
        if ( isAttendance ){
            var codes = "-1", values = "-1";
            var chk_val = $("#chk_filter").val();            
            var filtered = 0;

            if ( chk_val == "+" ){
                
                var cd=[-1], vl=[-1];
                $(":checkbox[name='cutoff_attdTypes']:checked").each(function(){					
                    cd.push($(this).data("c"));
                    vl.push($(this).data("v"));                                    
                });
                codes = cd.join(',');
                values = vl.join(',');

                filtered = 1;
            }            
            
            $("input#cutoff_nav_attd_filtered").val( filtered );
            $("input#cutoff_nav_filter_codes").val( codes );
            $("input#cutoff_nav_filter_values").val( values );
        }
      
    };
    */

