function Coordinate1(name,drop,dropheight) {
	var c = getAnchorPosition(name);
 //alert("X = "+c.x+" , Y = "+c.y);
  if (document.getElementById) {
	  var o = document.getElementById(drop);
  	if (o.style) {
		o.style.left = (c.x) + 2;
		ShowMe(drop,dropheight);
	//      o.style.top = c.y;
  	}
  }
}
function HideMe(objName){
var x = document.getElementById(objName);
var h = x.style.height;
	for(i = h; i <= 1; i--){
		x.style.height= i + 'px'
	}
	x.style.display = "none";	
	/*
	if (h != 1){
		x.style.height = 2;
	//	alert(x.style.height);
		setTimeout('HideMe(objName)',50000);		
	}else{
		x.style.display = "none";
	}*/
	
}
function ShowMe(objName,objHeight){
var x = document.getElementById(objName);
//var h = objHeight + 'px';
	x.style.display = "inline";
	for(i=0; i <= objHeight; i++){
		var h = i + 'px';	
		x.style.height= h;
		//alert('test delay');		
	}
}