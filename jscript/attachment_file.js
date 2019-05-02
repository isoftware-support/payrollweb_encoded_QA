		
		//check file
		
		function checkAttachment(e, msgID = ""){
		
		    if (e.files.length){
		    	var size = e.files[0].size;
		    	if ( (size / 1024) > ( 1024 * 2) ){   //greater than 2 MB
		    		alert( "Attachment file more than 2MB is not allowed!");
		    		e.value = "";
		    		return false;
		    	}
		    }		    

		    if ( msgID ){
			    var fname = e.value.split('\\');			
			    document.getElementById(msgID).value = fname[fname.length - 1];			
			  }
		}