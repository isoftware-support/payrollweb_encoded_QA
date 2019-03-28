
		$(function(){
			// Accordion
			$("#accordion").accordion({ header: "h6" });
		    // Tabs
            $('#tabs').tabs();
		});
  
        var busy = new BusyGif();        
        var selected;


        $(document).ready( function(){    

            function showDetails(e){
                busy.show2();
                xxhr("GET", 'xhtml_response.php?q=myRecEntry&id='+ e.dataset.id, show);                    

                if ( selected ) selected.style = "background-color: white";
                selected = e;
                e.style=" background-color: #D6D6D6";
            };

            function show(res){
                busy.hide();
                getById('div_info').innerHTML = res;                
            };


            function getAllRec( clear = false ){

                console.log( clear);
                if ( clear ) getById("filter-text").value = ""   ;
                
                var txt = getById("filter-text").value;
                getById('div_info').innerHTML = ""; 
                
                console.log(txt);
                busy.show2();
                xxhr("GET", 'xhtml_response.php?q=recAll&f='+ txt, showAll);                    
            }            
            function showAll(res){

                busy.hide();
                getById('rec-all').innerHTML = res;                                

                //attach event
                var rows = getAll(".rec-row");
                for( var i = 0; i < rows.length; i++){
                    rows[i].onclick = function(){ showDetails(this); };
                }
            }

            getById('filter-ok').onclick = function(){ getAllRec(); };
            getById('filter-clear').onclick = function(){ getAllRec( true ); };       
            getById('filter-text').onkeypress = function(e){ 
                
                if (e.keyCode == 13) getAllRec(); 
            };       
            getAllRec();

        });

