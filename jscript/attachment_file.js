		
		//check file
		
		function checkAttachment(e, putFilenameToID = "", maxFileSize = 2){
				
		    if (e.files.length){

		    	var size = e.files[0].size;
		    	if ( (size / 1024) > ( 1024 * maxFileSize) ){   //greater than 2 MB

		    		const txt = `Attachment file more than ${maxFileSize} MB is not allowed!`;
		    		if (typeof msgBox === "function" ){
		    			msgBox( txt )
		    		}else{		    		
		    			alert( txt )
		    		}

		    		e.value = "";
		    		return false;
		    	}
		    }		    

		    // where to put the filename
		    if ( putFilenameToID ){
			    const fname = e.value.split('\\');		
			    const txt = document.getElementById(putFilenameToID)
			    if ( txt ){
			    	if (txt.tagName == "INPUT") txt.value = fname[fname.length - 1];			
			    	if (txt.tagName == "A") txt.value = fname[fname.length - 1];			
			    }
			  }
		}