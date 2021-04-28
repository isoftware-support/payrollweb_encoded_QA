


const busy = new BusyGif();


function parseScript(strcode) {

    // www.webdeveloper.com 
    var scripts = new Array();         // Array which will store the script's code

    // Strip out tags
    while(strcode.indexOf("<script") > -1 || strcode.indexOf("</script") > -1) {
        var s = strcode.indexOf("<script");
        var s_e = strcode.indexOf(">", s);
        var e = strcode.indexOf('</script', s);
        var e_e = strcode.indexOf(">", e);

        // Add to scripts array
        scripts.push(strcode.substring(s_e+1, e));
        // Strip from strcode
        strcode = strcode.substring(0, s) + strcode.substring(e_e+1);
    }

    // Loop through every script collected and eval it
    for(var i=0; i<scripts.length; i++) {
        try {
            eval(scripts[i]);
        }catch(ex) {
        // do what you want here when a script fails
        }
    }
}
 
function collectChecked(){
    
    var year = $('#week_year').val();
    // var aNames = new Array;    
    // var aEmpNos = new Array;    
    var aIDs = new Array;
    var chks = $('input:checkbox');

    $(chks).each(function(){
        var name = this.name;
        if (this.checked && !this.disabled && name.indexOf(year) > 0){            
            aIDs.push(this.name);
        }
    });    
    document.f1.coll_sched.value = aIDs.join(",");
    
}    


function show_team_name(tm,en,m,w,y){
    
    busy.show2() ;

    
    xxhrGet( "_schedule/team_schedules_ajax.php?q="+tm+"&e="+en+"&m="+m+"&w="+w+"&y="+y, 
    (res)=> {
      
        getById("weekly_sched_tab").innerHTML= res;
        busy.hide();
    });


    /*

    var xmlhttp;

    if (window.XMLHttpRequest)
      {// code for IE7+, Firefox, Chrome, Opera, Safari
      xmlhttp=new XMLHttpRequest();
      }
    else
      {// code for IE6, IE5
      xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
      }
    xmlhttp.onreadystatechange=function()
      {
      if (xmlhttp.readyState==4 && xmlhttp.status==200)
        {

        var res = xmlhttp.responseText.split("NEW_LINE");
        
        document.getElementById("weekly_sched_tab").innerHTML=xmlhttp.responseText;    
        }else{ 
        document.getElementById("weekly_sched_tab").innerHTML= "<center><img src='images/loader.gif' width=50 border=0></center>";
        }
      }

    let url = "_schedule/team_schedules_ajax.php?q="+tm+"&e="+en+"&m="+m+"&w="+w+"&y="+y;
    console.log( url);

    xmlhttp.open("GET", url,true);
    xmlhttp.send();
    */

}



function show_team_name_dd(tm,e){


    var xmlhttp;

    if (window.XMLHttpRequest)
      {// code for IE7+, Firefox, Chrome, Opera, Safari
      xmlhttp=new XMLHttpRequest();
      }
    else
      {// code for IE6, IE5
      xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
      }
    xmlhttp.onreadystatechange=function()
      {
      if (xmlhttp.readyState==4 && xmlhttp.status==200)
        {
        document.getElementById("list1").innerHTML=xmlhttp.responseText;


         parseScript(xmlhttp.responseText);


        }
      }

    xmlhttp.open("GET","includes/teamsched_monthly_dd.php?q="+tm+"&e="+e,true);
    xmlhttp.send();

}



function show_sched_month(tm,en,mb,d,mn,y){

    //alert(mn);

    var xmlhttp;

    if (window.XMLHttpRequest)
      {// code for IE7+, Firefox, Chrome, Opera, Safari
      xmlhttp=new XMLHttpRequest();
      }
    else
      {// code for IE6, IE5
      xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
      }
    xmlhttp.onreadystatechange=function()
      {
      if (xmlhttp.readyState==4 && xmlhttp.status==200)
        {

        //var res = xmlhttp.responseText.split("NEW_LINE");
        document.getElementById("tbl_monthsched").innerHTML=xmlhttp.responseText;    
        }else{ 
        document.getElementById("tbl_monthsched").innerHTML= "<center><img src='images/loader.gif' width=50 border=0></center>";
        }
      }

    xmlhttp.open("GET","_schedule/team_schedules_monthly.php?q="+tm+"&e="+en+"&mb="+mb+"&d="+d+"&mn="+mn+"&y="+y,true);
    xmlhttp.send();

}


function show_weekdate_dd(w,y){ // for dropdown
  
    var xmlhttp;

    if (window.XMLHttpRequest)
      {// code for IE7+, Firefox, Chrome, Opera, Safari
      xmlhttp=new XMLHttpRequest();
      }
    else
      {// code for IE6, IE5
      xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
      }
    xmlhttp.onreadystatechange=function()
      {
      if (xmlhttp.readyState==4 && xmlhttp.status==200)
        {
        document.getElementById("weeks").innerHTML=xmlhttp.responseText;
        //document.getElementById('weekly_sched_tab').innerHTML = responseText;
        }
      }
    //alert(tm);
    xmlhttp.open("GET","includes/teamsched_weekly_dd.php?w="+w+"&y="+y,true);
    xmlhttp.send();

}


function chkAll(source,nm,dt,chkgrp) {

    

    // 0 - date
    // 1 - employeee

    for(var j=0;j<nm.length;j++){
            
        if(chkgrp==0){  
            var chkbox_name = nm[j] + "_" + dt;
        }else{
            var chkbox_name = dt + "_" + nm[j];
        }
        //alert(chkbox_name);

        var checkboxes = document.getElementsByName(chkbox_name);

        for(var i=0, n=checkboxes.length;i<n;i++) {
            checkboxes[i].checked = source.checked;
        }

    }
       
}  

function UsePreviousSched(){
   
    var busy = new BusyGif("#replicate_sched");

    var year = $('#week_year').val();
    var chks = $('input:checkbox');
    var aNames = new Array;    
    var aEmpNos = new Array;    

    $(chks).each(function(){

        var name = this.name;
        if (this.checked && !this.disabled && name.indexOf(year) > 0){            

            aNames.push(name);            
            var empno = name.substr(0, name.indexOf('_'));
            if (aEmpNos.indexOf(empno) == -1) aEmpNos.push(empno);

        }
    });    

    if (aNames.length > 0){

        if (confirm('Values from Previous week Schedules will overwrite current selection.\rAre you sure?')){

            busy.show();

            $.post("ajax_calls.php",{func:'GetPrevSched', yr:year, nos:aEmpNos, names:aNames}, function(data){     

                for(x in data){                        
                    var id = "'input:text#SHFT" + x + "'";
                    $(id).val(data[x]);                                
                }

            }, 'json');
        }

    }else{
        alert("Please select date Schedule.");
    }

}


 function getcheckedx1(nm,dt) {
    
    
    var newtxt = '';
    var newtxtval = '';
    var newtxtid = '';
    var chkbx = document.getElementsByTagName('input');


    for(var i = 0; i < chkbx.length; i++) {

        if(chkbx[i].type == 'checkbox' && chkbx[i].name != 'date_chkall' && chkbx[i].name != 'emp_chkall' && chkbx[i].checked === true && chkbx[i].disabled==false) {
            if(newtxtval.length !== 0) {
                newtxtval += '; ';
            }
            newtxtval += chkbx[i].value;

            if(newtxtid.length !==0){
                newtxtid  += ','; 
            }
            newtxtid  += chkbx[i].id

        }

    }
    document.f1.p_name3b.value = newtxtval;
    document.f1.p_name3.value = newtxtid;
}   


function getchecked() {    

    
    var newtxt = '';
    var chkbx = document.getElementsByTagName('input');

    for(var i = 0; i < chkbx.length; i ++) {
        if(chkbx[i].type == 'checkbox' && chkbx[i].name != 'date_chkall' && chkbx[i].name != 'emp_chkall' && chkbx[i].checked === true && chkbx[i].disabled==false) {
            if(newtxt.length !== 0) {
                newtxt += '; ';
            }
            newtxt += chkbx[i].value;
        }
    }
    document.f1.p_name3b.value = newtxt;
}
  
function getchecked2() {
    

    var newtxt = '';
    var chkbx = document.getElementsByTagName('input');

    for(var i = 0; i < chkbx.length; i ++) {
        if(chkbx[i].type == 'checkbox'  && chkbx[i].name != 'date_chkall' && chkbx[i].name != 'emp_chkall' && chkbx[i].checked === true && chkbx[i].disabled==false) {
            if(newtxt.length !== 0) {
                newtxt += ',';
            }
            newtxt += chkbx[i].id;
        }
    }

    document.f1.p_name3.value = newtxt;
}

function select_all(source){


    var checkboxes = document.getElementsByName('emp_chkall');
    for(var i=0, n=checkboxes.length;i<n;i++) {
        checkboxes[i].click();
        checkboxes[i].checked = source.checked;
    }
}



function uncheck(){ // unchecking all the checkbox
  
    var w = document.getElementsByTagName('input'); 
    for(var i = 0; i < w.length; i++){ 
        if(w[i].type=='checkbox'){ 
            w[i].checked = false; 
        }
    }
//document.getElementById('clear').disabled=true;
//document.getElementById('ddbuttonb').disabled=true; 

} 

function myfunction(){


    var url = document.getElementById('myTextField3b').value; 

    var emp_nos = url.match(/EmployeeNo=([^;]*)/gi);
    var emp_nos_new =  emp_nos.join(",").replace(/EmployeeNo=/gi,"");
    var finalx_emp_nos =  emp_nos_new.split(',');

    // YEAR
    var year = url.match(/schedule_([^ SET]*)/gi);
    var year_new = year.join(",").replace(/schedule_/gi,"");
    var finalx_year =  year_new.split(',');

    // DATE AND MONTH
    var dformat = url.match(/SET `([^`]*)/gi);
    var dformat_new = dformat.join(",").replace(/SET `/gi,"");
    var finalx_dformat =  dformat_new.split(',');

    var finalx = finalx_dformat.length;

    // Date Only
    var getonlyday = url.match(/SET `([^-]*)/gi);
    var getonlyday_new = getonlyday.join(",").replace(/SET `/gi,"");
    var finalx_dday =  getonlyday_new.split(',');

    // Month Only

    var getonlymonth = url.match(/-([^`=]*)/gi);
    var getonlymonth_new = getonlymonth.join(",").replace(/-/gi,"");
    var finalx_dmonth_tmp =  getonlymonth_new.split(',');

    var finalx_dmonth_array = new Array();

    //Convert Month to (00-12) Format
    for(xy=0;xy<finalx;xy++){
            
        var finalx_dmonth_format = changeMonthFormat(finalx_dmonth_tmp[xy]);

        finalx_dmonth_array[xy] = finalx_dmonth_format; // Converted Month to (00-12);

    }


    var xmlhttpxxx;

    if (window.XMLHttpRequest){
      xmlhttpxxx=new XMLHttpRequest();
    }else{
        xmlhttpxxx=new ActiveXObject('Microsoft.XMLHTTP');
    }

    xmlhttpxxx.onreadystatechange=function(){
    
        if (xmlhttpxxx.readyState==4 && xmlhttpxxx.status==200){
        //alert('a');
            for(i=0; i<finalx; i++){
                var final_date_format = finalx_dmonth_array[i] + "/" + finalx_dday[i] + "/" + finalx_year[i];   
                var d = new Date(final_date_format);
                var curr_date = d.getDate();
                var curr_month = d.getMonth() + 1; //Months are zero based
                var curr_year = d.getFullYear();
                
                if(curr_date<10) curr_date = "0" + curr_date;
                if(curr_month<10) curr_month ="0" + curr_month;
        
                thisdate =  curr_year + "-" + curr_month + "-" + curr_date;
                var element_name = "SHFT" + finalx_emp_nos[i] + "_" + thisdate;

                document.getElementById(element_name).value= xmlhttpxxx.responseText;
                document.getElementById(element_name).title= xmlhttpxxx.responseText;
        
                busy.hide();
            }

            uncheck(); // call the uncheck all checkbox function   
        }
    }
    
    var busy = new BusyGif("#replicate_sched");

    var ans = confirm('Are you sure you want to clear the selected schedules?');
 
    if(ans){
 //alert(url);  
        busy.show2();

        var ids = document.f1.coll_sched.value;

        xmlhttpxxx.open('GET','team_clear_ajax.php?que='+url + "&ids=" + ids,true);
        xmlhttpxxx.send();
    }else{
        return;
    }      
    
}


function multiplesched(selidx,h,w,buttonval, el = null){

    
    var emptytext = document.getElementById('myTextField3b').value
    
    var sel = document.getElementById(selidx);
    var left = (screen.width/2)-(w/2);
    var top = (screen.height/2)-(h/2);    

    // get selected item
    let shiftCodes = "";    
    if ( el ) shiftCodes = el.previousSibling.value;   //input         

    let url = 'multipleshift.php?tl='+tl_empno +"&sc="+shiftCodes;
    popWindow(url, w, h, 'toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=0,resizable=0');

    //window.open('multipleshift.php?tl='+tl_empno,'Windowname','toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=0,resizable=0,width='+w+', height='+h+', top='+top+', left='+left);       

    document.f1.p_name8a.value = document.getElementById('weeksdate').value
    document.f1.p_name8b.value = document.getElementById('weekedate').value

    //document.f1.p_name4b.value = document.getElementById('sandeweeks').value
    document.getElementById('ddbutton').value = buttonval
    //alert(buttonval);
    if(buttonval=='ddbuttonb'){
        document.f1.p_name4.value = document.getElementById('week_year').value
        document.getElementById('chkshift').value='';

    }
    
}


function repSelected(l){

    // alert(1);

    if(l=="m"){
        document.getElementById("dd_teamname").selectedIndex = document.getElementById("ddm_teamname").selectedIndex;
        document.getElementById("week_year").selectedIndex = document.getElementById("weekm_year").selectedIndex;
    }else{
        document.getElementById("ddm_teamname").selectedIndex = document.getElementById("dd_teamname").selectedIndex;
        document.getElementById("weekm_year").selectedIndex = document.getElementById("week_year").selectedIndex;

    }    
}



