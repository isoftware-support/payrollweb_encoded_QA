
<script type='text/javascript' src='jquery-ui-1.8.18/js/jquery-1.7.1.min.js'></script>

<script>

//document.getElementById('selid').style.visibility="hidden";


$(document).ready(function(){
	 $('#titled_arrow').hide();
	  $('#schedpic').hide();
	 
	  $('#leg_arrow').click(function(){
  		$('#titled_arrow').show();
		  $('#schedpic').fadeToggle();
   		$('#leg_arrow').hide();
		  $('#schedline').hide();
 
 });
 
  $('#titled_arrow').click(function(){
  		$('#leg_arrow').show();
		  $('#schedline').show();
   		$('#titled_arrow').hide();
		$('#schedpic').hide();
 
 });
 
 
 
	
 });

</script>