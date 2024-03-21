
    // #8323
    // hover event for approver name

    function hover_over(parentTagName, elClassName, elDataSetKey, data = [], dataTextField = ""){

        const div_id = "apr_hover_name";

        // delete first
        removeChild(div_id);

        const body = get(parentTagName);
        if ( body ){
    
            if ( Array.isArray( body ) ) body = body[1];

            // add div
            let e = document.createElement('div');
            e.id = div_id;
            e.innerHTML = "<p id='aprname_hint'>xxxxxxxxxx</p>";
            body.appendChild(e);

            const els = getByClass(elClassName);
            
            // console.log( 'data', data, dataTextField, data.lenth )

            for( index in els ){

                const el = els[index];                
                if ( el.tagName == undefined ) continue;  // its an element

                const prop_val = el.dataset[ elDataSetKey ];
                if ( ! prop_val ) continue;                            

                let text = "";                
                if ( Object.keys(data).length ){
                    
                    if ( data[prop_val] === undefined ) continue;                
                    text = data[ prop_val ][ dataTextField ];
                    
                }else{
                    text = prop_val
                }                
                
                el.onmouseover = (event)=>{
                    
                    // console.log( 'mouse')                    
                    const hover_div = getById( div_id );
                    // if ( hover_div.style.display == "block") return;

                    const _el = event.target;
                    const td_w = _el.clientWidth / 2;
                    
                    if ( _el.tagName == "TD" ){                   

                        hover_div.style.display = "block";
                        hover_div.innerHTML = text;

                        const xy = _el.getBoundingClientRect();
                        xy.y += window.scrollY;

                        const less = hover_div.offsetWidth / 2;
                        // const x = event.pageX, y = event.pageY;

                        hover_div.style.left = xy.x - less + td_w;
                        hover_div.style.top = xy.y - 20;        
                        hover_div.style.display = "";    
                    }
                };

                el.onmouseleave = () => {
                    //console.log('left');
                    const div = getById("apr_hover_name");
                    div.style.display = "none";
                }
            }
        }
    }



