

var busy = new BusyGif();        
var selected = null;

// getById('filter-ok').onclick = function(){ getAllRec(); };
// getById('filter-clear').onclick = function(){ getAllRec( true ); };       

// getById('filter-text').onkeypress = function(e){ 
    
//     if (e.keyCode == 13) getAllRec(); 
// };       
getAllRec();


function showDetails(e){
    busy.show2();
    xxhr("GET", 'xhtml_response.php?q=myRecEntry&id='+ e.dataset.id + _session_vars, show);                    

    // prev selected
    if ( selected ) selected.classList.remove("DataRowSelected");

    // current selected
    selected = e;
    e.classList.add("DataRowSelected");

    /*
    if ( selected ) selected.style = "background-color: white";
    selected = e;
    e.style=" background-color: #D6D6D6";
    */

};

function show(res){
    busy.hide();
    let e = getById('div_info');

    e.innerHTML = res;                
    detailsVisible();


};

function detailsVisible( isShow = true ){

    const details = getById('div_info');
    const title   = getById("details_title");

    if ( isShow ){

        details.classList.remove("d-none");
        title.classList.remove("d-none");

    }else{
        details.classList.add("d-none");
        title.classList.add("d-none");

    }
}

function getAllRec( clear = false ){

    // console.log( clear);
    // if ( clear ) getById("filter-text").value = ""   ;
    
    // var txt = getById("filter-text").value;
    getById('div_info').innerHTML = ""; 
    
    // console.log(txt);
    busy.show2();
    xxhr("GET", 'xhtml_response.php?q=recAll&f='+ _session_vars, showAll);                    
}            
function showAll(res){                

    busy.hide();
    getById('rec-all').innerHTML = res;                                

    //attach event
    var rows = getAll(".rec-row");
    for( var i = 0; i < rows.length; i++){
        rows[i].onclick = function(){ showDetails(this); };
    }

    detailsVisible(false);
}

