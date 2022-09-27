
		function applyFilter(mode){

			var params = '';
			f = document.forms[0];		
			
			if(mode==false){  // clear filter

				f.teamnames.value = -1;	
				f.startdate.value = "";
				f.enddate.value = "";
				f.targetstart.value = "";
				f.targetend.value = "";
				f.employeename.value = "";
				f.status.value = -2;				
				f.requesttype.value = -1;
				f.teamnames.value = -1;
				f.u.val = "";
				f.s.value = "";
				mode = true;
			}
				

			params = '&fm=' + true + '&fds=' + escape(f.startdate.value); 
			params = params + '&fde=' + escape(f.enddate.value) + '&fts=' + escape(f.targetstart.value);
			params = params + '&fte=' + escape(f.targetend.value);
			params = params + '&fen=' + escape(f.employeename.value);
			params = params + '&fs=' + escape(f.status.value) + '&frt=' + escape(f.requesttype.value) + '&frm=' + escape(f.teamnames.value);
			params = params + '&u=' + escape(f.u.value) + '&s=' + escape(f.s.value) + '&up=false';
			//alert(mode);
			//alert(params);			

			let path = host + "/xhtml_response.php?q=SaveFilter&fr="+ parent + params + _session_vars;						
			// alert(path);
			xxhr("GET", path, function(msg){
				
				// alert( msg);
				// console.log(msg);
				filter_reloadParent(params);	

			});
			
		}		

		function filter_reloadParent(params){	
			
			window.opener.location.reload();
			self.close();

			/*
			return;

			var urls = f.prevpage.value;
						

			//alert(urls);
			
			//var local_url = urls.match(/([^qid]*)/gi);	
            var qid_url   = urls.match(/qid([^aprv]*)/gi);
			var cn_url    = urls.match(/cn([^]*)/gi);
			var prev_url =  "?" + qid_url + cn_url;
			var newurl = urls.split('?')[0];
			
	
			opener.location.href = newurl + prev_url + params;
			self.close();
			*/
		}		

	