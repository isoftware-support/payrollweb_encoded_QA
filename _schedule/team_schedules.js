

const busy = new BusyGif();

const batch_run = []
let batch_run_count = 0


// load current week on 1st load only
loadTeamSchedule();

function loadTeamSchedule( cbf = undefined ){

    
    const week =  getById('weeks').value;
    const teamNo = getById('dd_teamname').value;        
    const year = getById("week_year").value;
    
    busy.show2() ;

    let index = 0;
    let batch_names = [];
    let session_html = "";

    const get_session_html = () => {

      if ( index < batch_names.length ){

        const s_name = batch_names[ index ]        
        xxhrPost("_schedule/team_schedules_ajax.php", {fn: 'shtml', sn: s_name }, (html) => {
          
          index ++
          session_html += html
          get_session_html();

        })

      }else{

        getById("weekly_sched_tab").innerHTML = session_html;

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
              btn.classList.add("button", "wm-150", "ml-5");
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

      }
      
    }
    
    const p = `q=${teamNo}&e=${aprNo}&m=-1&w=${week}&y=${year}`    
    xxhrGet( "_schedule/team_schedules_ajax.php?" + p, (res)=> {        

      const ret = JSON.parse(res)

      batch_names = ret.batch_names
      get_session_html();

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

    var funcOk = () => {

      busy.show2();      
      
      let post = {};
      post['tn'] = getById('dd_teamname').value;
      post["team_sched"] = file; 

      xxhrPost('xhtml_response.php?q=UploadTeamSched&'+ _session_vars, post, 
      ( res ) => {             
        
        // console.log('res', res);

        // reset file value
        getById("import_team_sched").value = "";            

        let msg;
        if ( res.trim() ){

          loadTeamSchedule();                  

          const ret = JSON.parse(res);
          
          // console.log('ret', ret)
          
          msg = ret.invalids.error;        
          if ( ret.invalids.dates || ret.invalids.ids || ret.invalids.shiftcodes ){
            
            msg = "Invalid entries found in Schedules import template.";

            if ( ret.invalids.dates )
              msg += "\r\n\r\nInvalid Date Columns:\r\n" + ret.invalids.dates.join(", ");

            if ( ret.invalids.ids )
              msg += "\r\n\r\nInvalid Employee Ids:\r\n" + ret.invalids.ids.join(", ");

            if ( ret.invalids.shiftcodes)
              msg += "\r\n\r\nInvalid Shift Codes:\r\n" + ret.invalids.shiftcodes.join(", ");          
          }            

        }else{
          msg = "Invalid Schedules template."
        }


        busy.hide();
        msgBox(msg);

      });
    }

    const funcCancel = () => {   
        // reset file selected
        getById("import_team_sched").value = "";            
        return;  
    } 

    msgBox('Uploaded schedules template file will overwrite the currently selected team members schedules.<br><br>Continue?' ,
      {okCallBack: funcOk, cancelButton: true, cancelCallBack: funcCancel} ) 
    
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

    console.log( 'selected', selected)    

    if ( ! selected.sc_count )
      return msgBox("Nothing to clear.");

    const db_push = (p, callback = "") => {
      
      const qs = urlParams( p);      

      xxhrGet( `_schedule/team_schedules_ajax.php?fn=clr&${qs}`, ( res )=> {  
          
        const ret = JSON.parse( res );

        console.log( ret )

        batch_run.push(true);

        if ( ret.result == 'Error'){
          busy.hide();
          msgBox('An error occurred.\r\n\r\n' + ret.msg);
          return;
        }  
        
        console.log('batch', batch_run.length, batch_run_count )
        if ( batch_run.length == batch_run_count ) loadTeamSchedule();

      });      
    }

    const func = () => {

      busy.show2();

      let cnt = 0
      let data = []
      batch = 0     

      // year 2
      for( key in selected.yr2_data ){

        cnt ++
        data.push( selected.yr2_data[key] )

        if ( cnt > 40){
          
          batch_run_count ++;          
          db_push( { y2: selected.yr2, y2_data: data.join(",") } )

          cnt = 0
          data = []
        }
      }
      if ( cnt ){

        batch_run_count ++;          
        db_push( { y2: selected.yr2, y2_data: data.join(",") })        
      }

      // year 1
      cnt = 0
      data = []
      for( key in selected.yr1_data ){

        cnt ++
        data.push( selected.yr1_data[key] )

        if ( cnt > 40){
          
          batch_run_count ++;          
          db_push( { y1: selected.yr1, y1_data: data.join(",") } )

          cnt = 0
          data = []
        }
      }
      if ( cnt ){        
        batch_run_count ++;          
        db_push( { y1: selected.yr1, y1_data: data.join(",") } )        
      }
    }
    msgBox( "Clear schedules for selected items?", {
      okCallBack: func, cancelButton: true})    
}    

function UsePreviousSched(){
   
  const selected = collectSelected( "Please select date schedules to set." );

  if ( selected.no_dt == undefined )
    return;

  const func = () => {
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

  msgBox('Values from Previous week Schedules will overwrite current selection.\r\nAre you sure?',
    {okCallBack: func, cancelButton: true})

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
      msgBox(errorMsg);
      return {};
  }

  const ids = [], no_dt_sc = [], no_dt = []
  let sc_count = 0;  
  let year1 = "", year2 = "";

  const yr1_data = [], yr2_data = [];

  chks.forEach( (e)=>{

    const p = e.parentElement;
    const 
      sc = p.dataset.sc, 
      dt = p.dataset.dt,
      no = p.dataset.eno;

    no_dt.push( no + "_" + dt);

    // with shiftcode only
    if ( sc.length ){

      no_dt_sc.push( no + "_" + dt + "_" + sc.replace(",","@") );
      sc_count += 1;

    }

    year = DateFormat(dt, "Y");
    if ( year1 == "") year1 = year        

    // year 1
    if ( year1 == year){
      yr1_data.push( no + "|" + dt);

    }else{ // year 2      
      year2 = year
      yr2_data.push( no + "|" + dt);
    }

    ids.push( e.id);
  });

  ret.no_dt_sc = no_dt_sc;
  ret.no_dt = no_dt;  
  ret.sc_count = sc_count;
  ret.ids = ids;

  // uniq dates and nos with shiftcodes only
  ret.yr1 = year1;
  ret.yr2 = year2;
  ret.yr1_data = yr1_data
  ret.yr2_data = yr2_data

  return ret;

}

