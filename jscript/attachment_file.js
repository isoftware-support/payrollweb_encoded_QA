		
		//check file
		
		function checkAttachment(e, putFilenameToID = "", maxFileSize = 2){
				
		    if (e.files.length){
		    	var size = e.files[0].size;
		    	if ( (size / 1024) > ( 1024 * maxFileSize) ){   //greater than 2 MB
		    		alert( `Attachment file more than ${maxFileSize} MB is not allowed!`);
		    		e.value = "";
		    		return false;
		    	}
		    }		    

		    // where to put the filename
		    if ( putFilenameToID ){
			    var fname = e.value.split('\\');			
			    document.getElementById(putFilenameToID).value = fname[fname.length - 1];			
			  }
		}