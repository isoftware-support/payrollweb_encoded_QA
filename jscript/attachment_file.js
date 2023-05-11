		
		//check file
		
		function checkAttachment(e, putFilenameToID = "", maxFileSize = 2, isSkipImage = false){
				
				let ret = false

		    if (e.files.length){

		    	let file = e.files[0];

		    	let isImage = file.type.indexOf("image") > -1
		    	if ( isSkipImage ) isImage = false;

		    	let mb = e.files[0].size / (1024 * 1024);
		    	if ( isImage && mb > maxFileSize ){   //greater than 2 MB

		    		const txt = `Attachment file more than ${maxFileSize} MB is not allowed!`;
		    		if (typeof msgBox === "function" ){
		    			msgBox( txt )
		    		}else{		    		
		    			alert( txt )
		    		}

		    		e.value = "";   // reset file

		    		ret = false;
		    	}else{
		    		ret = true
		    	}
		    }		    


		    // where to put the filename
		    if ( putFilenameToID ){
			    
			    const el = document.getElementById(putFilenameToID)
			    
			    if ( el ){
						
						let filename = ""
			    	if ( ret ){
				    	const fname = e.value.split('\\');		
				    	filename = fname[fname.length - 1];
			    	}

			    	if ( el.tagName == "INPUT") el.value = filename ;			
			    	if ( el.tagName == "A") el.value = filename;	
			    	if (el.tagName == "LABEL")	el.innerHTML = filename; 
			    }
			  }

			  return ret
		}


