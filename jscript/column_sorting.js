    

        //colum sort order

        //create hidden fields for sort
        window.onload = function(){
            
            //sort order field
            var field = document.createElement("input");
            field.type = "hidden";
            field.name = "_sort_order_field";
            field.id = "_sort_order_field";
            field.value = sort_field;
            document.forms[0].appendChild(field);   

            //sort order                                
            field = document.createElement("input");
            field.type = "hidden";
            field.name = "_sort_order";
            field.id = "_sort_order";
            field.value = sort_order;
            document.forms[0].appendChild(field);   

            setSortColumnEvent();
            setColumnIndicator();
        };

        //put order indicator on selected field
        function setColumnIndicator(){
            var id = "col_sort_"+ sort_field;
            var col = document.getElementById(id);
            if (col){

                var arrow = "up";
                if (sort_order == "DESC") arrow = "down";
                var html = col.dataset.caption + "<i class='order-icon "+ arrow +"'></i>";
                col.innerHTML = html;
            }
        }

        //add event click event to columns
        function setSortColumnEvent(){
            var cols = document.querySelectorAll(".column-sort");
            for (var i = 0; i < cols.length; i++) {                            
                cols[i].addEventListener("click", setColumnToOrder );
            }                    
        }

        function setColumnToOrder(){      
            
            var e = this;  //sender

            var order = document.getElementById("_sort_order");
            var col = document.getElementById("_sort_order_field");
            
            var sOrder = "ASC";
            if ( col.value == e.dataset.field){
              if (order.value == "ASC"){
                sOrder = "DESC";
              }else{
                sOrder = "ASC";
              }
            }                         
            col.value = e.dataset.field;   
            order.value = sOrder;
            
            // alert( col.value + " " + sOrder);
            document.forms[0].submit();                
            
        }

