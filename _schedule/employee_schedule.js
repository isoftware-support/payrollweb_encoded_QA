

function GenerateEmpScheduleUrl(url){		
	f = document.forms[0];
	len = f.month.length;				
	for(i=0; i<len; i++){
		if(f.month[i].selected){
			m = f.month.value;
		}
	}
	len = f.year.length;			
	for(x=0; x<len; x++){
		if(f.year[x].selected){
			y = f.year.value;
		}
	}
	url = url + "?month=" + escape(m) + "&year=" + escape(y) + "&empno=" + escape(f.empno.value);					
	return url;
}

function SetDateToCurrent(month, year){			
	var monthObj = document.getElementById('month');
	var yearObj  = document.getElementById('year');		
	
	len = monthObj.length;				
	for(i=0; i<len; i++){
		if(monthObj.options[i].value == month){					
			monthObj.selectedIndex = i;
			break;
		}
	}
	
	len = yearObj.length;			
	for(x=0; x<len; x++){
		if(yearObj.options[x].value == year){					
			yearObj.selectedIndex = x;
			break;
		}
	}
}

