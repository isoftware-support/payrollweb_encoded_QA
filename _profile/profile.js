
    
    var elems;
    var e;

    // rows and columns            
    elems = getAll("tr");
    for (var i = 0; i < elems.length; i++) {

        e = elems[i];
        let table_parent = e.parentElement.parentElement;  // table parent

        if (table_parent.id == "profile_table"){
            
            let sClass = "DataRowHeight";
            if ( e.id == "head"){
                sClass = "DataHeading";
            }else if( e.id == "section"){
                sClass = "DataSection";
            }
            e.className = sClass;

            // collect td of row
            let cols = e.children;
            if ( e.className == "DataRowHeight"){
                cols[0].className = "DataFieldTitle";
                cols[1].className = "DataFieldValue";
            }
        }                
    }                  

    //edit boxes    
    elems = getAll("input[type='text']");
    for( var i = 0; i< elems.length; i++ ){
        e = elems[i];
        // console.log( e);
        e.className = "EditBox wp-70";
        e.setAttribute("autocomplete", "off");
    }

    // text areas or memoboxes
    elems = getAll("textarea");
    for( var i = 0; i< elems.length; i++ ){
        e = elems[i];
        e.className = "MemoBox wp-70";
        e.setAttribute("autocomplete", "off");
    }

    // buttons
    elems = getAll("input[type='button'], input[type='submit']");
    for( var i = 0; i< elems.length; i++ ){
        e = elems[i];
        e.className = "Button";
    }

