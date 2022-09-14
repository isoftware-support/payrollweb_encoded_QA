

const busy = new BusyGif();

// load current week on 1st load only
loadTeamSchedule();

function loadTeamSchedule( cbf = undefined ){
    
    const week =  getById('weeks').value;
    const teamNo = getById('dd_teamname').value;        
    const year = getById("week_year").value;
    
    busy.show2() ;
   
    xxhrGet( "_schedule/team_schedules_ajax.php?q="+teamNo+"&e="+aprNo+"&m=-1&w="+week+"&y="+year, 
    (res)=> {        

        getById("weekly_sched_tab").innerHTML= res;

        // check valid start date
        const e = getById("valid-start-date");
        if (e){

          const validStartDate = e.value;          

          // create upload sched button
          if ( is_upload_sched_allowed == 1 ){

            const parent = getById('btn-section');

            // delete  first
            let btn = getById('upload_sched');
            if ( btn )
              parent.removeChild(btn);

            if ( validStartDate ){
              btn = document.createElement("input");
              btn.type = 'button';
              btn.classList.add("Button", "w-150", "ml-5");
              btn.value = "Upload Team Schedules";
              btn.id = "upload_sched";
              btn.onclick = () => getById('import_team_sched').click();
              
              // append button             
              parent.appendChild( btn);              
            }          
          }
        }

        // change cursor status for all readonly input box
        let txts = getByName('sched_date_txt');        
        txts.forEach( (e) => {
           e.style.cursor = "pointer";
        });

        // uncheck select all
        getById('select-all').checked = false;        

        if ( cbf !== undefined ){
          cbf();  // call back function
        }

        // set sched date click event
        proxy_shiftcode_picker._schedDatesClick();

        busy.hide();
    });   

}

function reloadTeamSchedule( weekORyear, upORdown ){

	const e = getById( weekORyear );
	let index = e.selectedIndex;
	const cnt = e.length -1;

	index += upORdown;
	if ( index < 0 || index > cnt) 
		return;
	
	e.selectedIndex = index;
	loadTeamSchedule();

  if ( weekORyear == "week_year"){
    const year = getById("week_year").value;
    loadYearWeeks(year);
  }

}

function uploadTeamSchedules(){

    const file = getById("import_team_sched").files[0];  // file from input
    if (! file) return;

    if (! confirm('Uploaded schedules template file will overwrite the currently selected team members schedules.\r\n\r\nContinue?' ) ){

        // reset file selected
        getById("import_team_sched").value = "";            
        return;  
    } 

    busy.show2();      
    const xhr = new XMLHttpRequest();
    
    let post = {};
    post['tn'] = getById('dd_teamname').value;
    post["team_sched"] = file; 

    xxhrPost('xhtml_response.php?q=UploadTeamSched&'+ _session_vars, post, 
    ( res ) => {             
      
      // reset file value
      getById("import_team_sched").value = "";            

      loadTeamSchedule();
      
      busy.hide();

      const ret = JSON.parse(res);
      // console.log(ret);
      
      // prompt invalid ids and dates

      if ( ret.invalids.dates || ret.invalids.ids || ret.invalids.shiftcodes ){
        
        let msg = "Invalid entries found in importation template.";

        if ( ret.invalids.dates )
          msg += "\r\n\r\nInvalid Date Columns:\r\n" + ret.invalids.dates.join(", ");

        if ( ret.invalids.ids )
          msg += "\r\n\r\nInvalid Employee Ids:\r\n" + ret.invalids.ids.join(", ");

        if ( ret.invalids.shiftcodes)
          msg += "\r\n\r\nInvalid Shift Codes:\r\n" + ret.invalids.shiftcodes.join(", ");

        alert(msg);
      }

      
    });
    
}


function checkColumn( e )
{
    const day = e.dataset.day;
    const chks = getAll(`[data-day='${day}']` );
    chks.forEach( (chk) => {
        chk.checked = e.checked;
    });   
}

function checNameDays(e)
{
    const eno = e.dataset.en;
    const chks = getAll(`[data-eno='${eno}']` );
    chks.forEach( (chk) => {
        chk.checked = e.checked;
    })
    
}

function select_all(e){

    // by names
    let chks = getByName('emp_name');
    chks.forEach( (chk) =>{
        chk.click();
        chk.checked = e.checked;
    });

    // by columns
    chks = getByName('date_column');
    chks.forEach( (chk) =>{
        chk.checked = e.checked;
    });
}


function clearSelected(){

    const selected = collectSelected( "Please select date schedules to clear." );

    if ( selected.no_dt_sc == undefined )
      return;

    if ( ! selected.sc_count )
      return;

    const selected_ids = selected.no_dt_sc.join(",");

    if ( confirm("Clear schedules for selected items?") ){

      busy.show2();

      xxhrGet( "_schedule/team_schedules_ajax.php?fn=clr&ids="+ selected_ids, 
      ( data )=> {

        busy.hide();
        const ret = JSON.parse( data );
        // console.log(ret);
        if ( ret.result == 'Error'){
          alert('An error occurred.\r\n\r\n' + ret.msg);
          return;
        }
        loadTeamSchedule();
        
      });
    }
}    

function UsePreviousSched(){
   
  
  const selected = collectSelected( "Please select date schedules to set." );

  if ( selected.no_dt == undefined )
    return;


  if (confirm('Values from Previous week Schedules will overwrite current selection.\r\nAre you sure?')){

    busy.show2();

    const year = getById("week_year").value;
    const selected_ids = selected.no_dt.join(",")

    xxhrGet( "_schedule/team_schedules_ajax.php?fn=prevw&ids="+ selected_ids, 
    (res) => {
      
      
      const ret = JSON.parse(res);
      // console.log(ret);     

      loadTeamSchedule( () => {              

        // put check on selected scheds
        selected.ids.forEach( (id) => getById(id).checked = true ) 

      });     

    });

  }
}


function loadYearWeeks(year){ 
    
    xxhrGet("includes/teamsched_weekly_dd.php?w=weeks&y="+year, ( res )=>{
      document.getElementById("weeks").innerHTML = res;
    });

}

function collectSelected( errorMsg ){
  
  let ret = {};

  const chks = getAll("input[name='sched_date']:checked");
  if ( ! chks.length ){
      alert(errorMsg);
      return {};
  }

  let ids = [], no_dt_sc = [], no_dt = [], sc_count = 0;

  chks.forEach( (e)=>{
    const p = e.parentElement;
    const 
      sc = p.dataset.sc, 
      dt = p.dataset.dt,
      no = p.dataset.eno;

    no_dt.push( no + "_" + dt);

    if ( sc.length ){
      no_dt_sc.push( no + "_" + dt + "_" + sc.replace(",","@") );
      sc_count += 1;
    }

    ids.push( e.id);
  });

  ret.no_dt_sc = no_dt_sc;
  ret.no_dt = no_dt;  
  ret.sc_count = sc_count;
  ret.ids = ids;

  // console.log(ret);
  return ret;

}

/*

// function changeSched(e){
 
//   // collect ids
//   const parent = e.parentElement;
//   const id = parent.dataset.eno + "_" + parent.dataset.dt;
//   const sc = e.value;

//   const h = 420, w = 300;
//   var left = (screen.width/2)-(w/2);
//   var top = (screen.height/2)-(h/2);    

//   let url = 'multipleshift.php?ids=' + id +'&sc='+ sc;
//   popWindow(url, w, h, 'toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=0,resizable=0');

// }


// function setAs()
// {

//     const selected = collectSelected( "Please select date schedules to set." );

//     if ( selected.no_dt_sc == undefined )
//       return;

//     const selected_ids = selected.no_dt.join(",");

//     const h = 420, w = 300;
//     var left = (screen.width/2)-(w/2);
//     var top = (screen.height/2)-(h/2);    

//     // let url = 'multipleshift.php?tl='+tl_empno +"&sc="+shiftCodes;
//     let url = 'multipleshift.php?ids='+selected_ids;
//     popWindow(url, w, h, 'toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=0,resizable=0');

// }
    // $(document).ready(function(){

    //     $('#titled_arrow').hide();
    //     $('#schedpic').hide();
     
    //     $('#leg_arrow').click(function(){
    //         $('#titled_arrow').show();
    //         $('#schedpic').fadeToggle();
    //         $('#leg_arrow').hide();
    //         $('#schedline').hide();    
    //     });
 
    //     $('#titled_arrow').click(function(){
    //         $('#leg_arrow').show();
    //         $('#schedline').show();
    //         $('#titled_arrow').hide();
    //         $('#schedpic').hide();
 
    //     });



    // });

 
    const checkList = document.getElementById('list1');
    const items = document.getElementById('items');
    
    checkList.getElementsByClassName('anchor')[0].onclick = function (evt) {
        
        if (items.classList.contains('visible')){
            items.classList.remove('visible');
            items.style.display = "none";
        }else{
            items.classList.add('visible');
            items.style.display = "block";
        }                       
    }
    
    items.onblur = function(evt) {
        items.classList.remove('visible');
    }             

//     function getchecked_dd(en,d) {


//       var tm = document.getElementById('dd_teamname').value;
//       var mn = document.getElementById('months').value;
//       var y = document.getElementById('weekm_year').value;
//       var mb = -1;

//       var newtxt = '';
//       var chkbx = document.getElementsByTagName('input');

//         for(var i = 0; i < chkbx.length; i ++) 
//         {
//             if(chkbx[i].type == 'checkbox' && chkbx[i].name == 'chk_for_dd' && chkbx[i].checked === true) {
//                 if(newtxt.length !== 0) {
//                     newtxt += ',';
//                 }
//                 newtxt += chkbx[i].value;
//             }

//         }

//        document.getElementById('collect_id').value = newtxt;
//        var mb = document.getElementById('collect_id').value;

//        if(mb==''){

//             mb = -1;
//        }

//         //alert(mb);


//         var xmlhttp;

//         if (window.XMLHttpRequest)
//           {// code for IE7+, Firefox, Chrome, Opera, Safari
//           xmlhttp=new XMLHttpRequest();
//           }
//         else
//           {// code for IE6, IE5
//           xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
//           }
//         xmlhttp.onreadystatechange=function()
//           {
//           if (xmlhttp.readyState==4 && xmlhttp.status==200)
//             {

//             //var res = xmlhttp.responseText.split("NEW_LINE");
//             document.getElementById("tbl_monthsched").innerHTML=xmlhttp.responseText;    
//             }else{ 
//             document.getElementById("tbl_monthsched").innerHTML= "<center><img src='images/loader.gif' width=50 border=0></center>";
//             }
//           }

//         xmlhttp.open("GET","_schedule/team_schedules_monthly.php?q="+tm+"&e="+en+"&mb="+mb+"&d="+d+"&mn="+mn+"&y="+y,true);
//         xmlhttp.send();

//     }

// function getcollect_caldate(id) {


//   let newtxt = '';
//   let chkbx = document.getElementsByTagName('input');

//     for(var i = 0; i < chkbx.length; i ++) 
//     {
//         if(chkbx[i].type == 'checkbox' && chkbx[i].name == 'getselmon' && chkbx[i].checked === true) {
//             if(newtxt.length !== 0) {
//                 newtxt += ',';
//             }
//             newtxt += chkbx[i].id;
//         }

//     }
//    document.getElementById('coll_sched').value = newtxt;
// }

*/
