		

 		$(document).ready(function(){
 			
 			xy();

 		});

 		function xy(){


 			let bln = false; 			
 			var div =  $("div#floatingbtn");

 			if ( type != 4){  // if not team add request 

	 			var elem = $(f);	 			

	 			bln = isOnScreen(elem);	 			
	 			if (bln) $(div).fadeOut();

			}else{
				bln = false;		// always false if type 4 or with add OT, dont hide floating buttons
			}

			// show button
 			if ( !bln ){
				var x = ($(window).width() / 2) + $("table.table_company_head").width() / 2;
				var y = ($(window).height() * .4) -  $("div#mybox").height()/2;

        	$(div).css({"top":y, "left":x});	        
        	$(div).fadeIn();
		  }

 		}

 		$(window).resize(function(){
 			xy();
 		}); 
 		//--------------------------
	 	
	 	$(window).scroll(function(){	        
	        xy();	        
	    });
	    //---------------------------

 	    $('a.floating_buttons').click(function(){	
			return false;
		});
		//---------------------------

		$("img[name='floating_img']").hover(			

			function(){

				let index = this.dataset.index;	  				
  				let back = get("img#floating_back" + index);

  				if ( back ){
  					back.classList.add('shadow-5');
  					back.classList.add('shadow-circle');
  				}
  				

			},
			function(){

				let index = this.dataset.index;	  				
  				let back = get("img#floating_back" + index);

  				if ( back ){
  					back.classList.remove('shadow-5');
  					back.classList.remove('shadow-circle');
  				}

			}

			/*
  			function() {  		
  				var id = this.id;
  				var len = id.length;
  				id = id.substr(len -1, len);

  				var back = "img#floating_back" + id,
  				    img = "img#floating_img" + id;

  				//var xy = <?php echo $xy; ?> - 8,
  				//	wb = <?php echo $wb; ?> + 10,

  				var w = wb - 8;

    			$(back).css({"top":xy, "left":xy, "width":wb, "height":wb});
				$(img).css({"top":xy + 3, "left":xy + 3, "width":w, "height":w});

				// $(back).animate({"top":xy, "left":xy, "width":wb, "height":wb});
				// $(img).animate({"top":xy + 3, "left":xy + 3, "width":w, "height":w});

  			}, 
  			function() {
  				var id = this.id;
  				var len = id.length;
  				id = id.substr(len -1, len);

  				var back = $("img#floating_back" + id),
  				    img = $("img#floating_img" + id);
 		
  				var xy = parseInt($(back).css("left"));  				
  				var wb = parseInt($(back).css("width"));
  				xy += 8;
  				wb -= 10;
  				var w = wb - 8;

    			// $(back).css({"top":0, "left":0, "width":wb, "height":wb});
				// $(img).css({"top":xy, "left":xy, "width":w, "height":w});
				
    			$(back).animate({"top":0, "left":0, "width":wb, "height":wb}, 100);
				$(img).animate({"top":xy, "left":xy, "width":w, "height":w}, 100);
		  	}
		  	*/
		);

	 