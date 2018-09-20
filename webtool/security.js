function extractVals()
{
    param = "";
    f = document.forms[0];
    for (i = 0; i < f.elements.length; i++) {
        if ((f.elements[i].name == "idno[]") && (f.elements[i].type == "checkbox")
            && (f.elements[i].checked)) {
            if (param != "") param = param + ",";
            param = param + f.elements[i].value;
        }
    }
    return param;
}


function getEmailByEmp(val){
// alert('aaaa');	
var xmlhttpxxx;

if (window.XMLHttpRequest)
  {
  xmlhttpxxx=new XMLHttpRequest();
  }
else
  {
  xmlhttpxxx=new ActiveXObject('Microsoft.XMLHTTP');
  }

xmlhttpxxx.onreadystatechange=function()
  {
  if (xmlhttpxxx.readyState==4 && xmlhttpxxx.status==200)
    {
   //alert('aaaa');
   var ajaxDisplay = xmlhttpxxx.responseText;
   document.getElementById('idEmail').value= ajaxDisplay;
   }
  }

//window.close();
xmlhttpxxx.open('GET','getEmailByEmp.php?emp='+val,false);
xmlhttpxxx.send();
	
}

function getCurrent()
{
    pp = window.location.href;
    return "&prevpage=" + escape(pp);
}

function updateUserGroup()
{
    param = extractVals();
    if (param == "") return alert("Please select at least one record.");
    window.location = "security.php?qid=13&u=" + escape(param) + "&ug=" + document.forms[0].AssignUserGroup.value + getCurrent();
}
function togglecheckbox()
{
	f = document.forms[0];
    for (i = 0; i < f.elements.length; i++) {
        if ((f.elements[i].name == "idno[]") && (f.elements[i].type == "checkbox")) {
			f.elements[i].checked = f.selectall.checked;	
        }
    }  	
}
function popitup(url) {
    newwindow=window.open(url, 'name', 'toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=0,resizable=0,width=430,height=250');
    if (window.focus) {
      newwindow.focus()
    }
	newwindow.moveTo(screen.availWidth/2-(500/2),screen.availHeight/2-(300/2));
}

function UserGroupSection()
{
	f = document.forms[0];
    for (i = 0; i < f.elements.length; i++) {
        if ((f.elements[i].name == "idno") && (f.elements[i].type == "radio") && (f.elements[i].checked)) {
			radradiobuttonLocationValue = f.elements[i].value;
        }
    }  
    return radradiobuttonLocationValue;
}
function reloadParent(){                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
   opener.location.reload(true);
   self.close();
}
function verifyDeleteUserGroup(n,t)
{
    x = document.forms[0];
    x = confirm("Are you sure you want to delete this usergroup?\n" +
        "All users for this user group will be deleted in Web Users List and this step cannot be undone.");
    if (!x) {
        return;
    }
   // nn = formPost("security.php?qid=03&ug="+escape(n), "");
    //window.location.reload();
	
window.location="del_this.php?no="+n+"&ty="+t+"";		
	
}
function formPost(url, postStr)
{
    retval = "";
    xmlPossible = Sarissa.IS_ENABLED_XMLHTTP;
    if (xmlPossible) {
        xmlObj = new XMLHttpRequest();
        xmlObj.open("POST", url, false);
        xmlObj.setRequestHeader("Content-Length", postStr.length);
        xmlObj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xmlObj.send(postStr);
        retval = xmlObj.responseText;
    }
    return retval;
}
function transferFrom(source, dest)
{
    var f, s, d, i, xx;
    f = document.forms[0];
    s = findControl(f, source);
    d = findControl(f, dest);
//alert(s.options.length);
    for (i = s.options.length-1; i >= 0; i--) {
        if (s.options[i].selected) {
            xx = new Option();
            xx.value = s.options[i].value;
            xx.text = s.options[i].text;
            d.options[d.options.length] = xx;
            s.options[i] = null;
        }
    }
    sortList(d);

}
function findControl(f, s)
{
    var i;
    for (i = 0; i < f.length; i++) {
        if (f[i].name == s) {
//          alert(f[i]);
            return f[i];

        }
    }
    return null;
}
function cancelAddRole()
{
    //window.location="security.php?qid=02";
	
	window.location="security.php?qid=03&wug="+docment.forms[0].getElementByID("wug").value;
	
	
}

function submitAddRole()
{
   /* f = document.forms[0];
    z = findControl(f, 'allowed[]');
    for (i = 0; i < z.options.length; i++) {
        z.options[i].selected = true;
    }
	x = findControl(f, 'available[]');
    for (i = 0; i < x.options.length; i++) {
        x.options[i].selected = true;
    }
    f.submit();*/
	
	//alert("entering submitaddrole");
    f = document.forms[0];
	
    z = findControl(f, 'allowed[]');
    for (i = 0; i < z.options.length; i++) {
        z.options[i].selected = true;
    }
	
	
	x = findControl(f, 'available[]');
    for (i = 0; i < x.options.length; i++) {
        x.options[i].selected = true;
    }
	
	
	a = findControl(f, 'allowed2[]');
    for (i = 0; i < a.options.length; i++) {
        a.options[i].selected = true;
    }
	
	b = findControl(f, 'available2[]');
    for (i = 0; i < b.options.length; i++) {
        b.options[i].selected = true;
    }
	
	
	
	
	f.getElementByID("UpdateUserGroupPrivilege").value=1;
    f.submit();
	//alert("exiting submitaddrole");
	

}
function submitUGA()
{
    f = document.forms[0];
    
	z = findControl(f, 'allowed[]');
    for (i = 0; i < z.options.length; i++) {
        z.options[i].selected = true;
    }	
	
	a = findControl(f, 'available[]');
    for (i = 0; i < a.options.length; i++) {
        a.options[i].selected = true;
    }	
	
	
	y = findControl(f, 'allowed1[]');
    for (i = 0; i < y.options.length; i++) {
        y.options[i].selected = true;
    }
	
	b = findControl(f, 'available1[]');
    for (i = 0; i < b.options.length; i++) {
        b.options[i].selected = true;
    }	
	
	
    f.submit();
}

function SelectUserGroup(wug)
{
	//alert("entering SelectUserGroup");
	window.location="security.php?qid=03&wug="+wug;
	/*if(window.HMLHttpRequest){ //code for IE7+ Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	}else{ //code for IE6, IE5
		xmlhttp=new ActiveXObject
	}
	xmlhttp.onreadystatechange=function()
	{
		if(xmlhttp.readyState==4 && xmlhttp.status=200){
		}
	}
	
	
	
    f = document.forms[0];
	f.getElementByID("wug").value = wug;
	f.submit();*/
}




function cancelUGA()
{
    window.location="security.php?qid=04";
}
/* nawawala ang sortList */
function sortList(d)
{
    var i, j;
    for (i = 0; i < d.options.length - 1; i++) {
        for (j = i+1; j < d.options.length; j++) {
            if (d.options[i].text > d.options[j].text) {
                t1 = d.options[i].text;
                t2 = d.options[i].value;
                d.options[i].text = d.options[j].text;
                d.options[i].value = d.options[j].value;
                d.options[j].text = t1;
                d.options[j].value = t2;

            }
        }
    }
}
function GetSelectedRadioButton(ObjRadioButtonName)
{
	var radradiobuttonLocationValue = "";
	f = document.forms[0];
    for (i = 0; i < f.elements.length; i++) {
        if ((f.elements[i].name == ObjRadioButtonName) && (f.elements[i].type == "radio") && (f.elements[i].checked)) {
			radradiobuttonLocationValue = f.elements[i].value;
        }
    }  
    return radradiobuttonLocationValue;
}
function UpdateWebUser(mode)
{
	var x     = document.forms[0];;	
	var url   = "";
	var param = "";
	switch(mode){
		case 0: // add record
				url = "security_popup.php?m="+escape(mode);
			break;
		case 1: // edit record			
				param = GetSelectedRadioButton("webuserno");
				if (param == "") return alert("Please select at least one record.");
				url = "security_popup.php?m="+escape(mode)+"&uid="+escape(param);				
			break;	
		case 2:		
				param = GetSelectedRadioButton("webuserno");
				if (param == "") return alert("Please select at least one record.");							
				
			    x = confirm("Are you sure you want to delete this User?");				
			    if (!x) return;
				
				//alert(param);
				//nn = formPost("security_popup.php?m="+escape(mode)+"&uid="+escape(param), "");
			    //window.location.reload();	
				
				// ** commented out by MYONGSON 01/29/2014 ** //
				
				//var nos = document.getElementById('')
				var t = 4; // for Delete Users
				window.location="del_this.php?no="+param+"&ty="+t+"";	
				
								
			break;
		default: // by default add record	
				url = "security_popup.php?m=0";
			break;		
	}	
	
	if(url!=""){
				

		newwindow=window.open(url, 'name', 'toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=0,resizable=0,width=500,height=390');		
	    if (window.focus) {
	      newwindow.focus()
	    }
	    
	    

		newwindow.moveTo(screen.availWidth/2-(460/2),screen.availHeight/2-(300/2));
		

	}
}
function onSubmitChangeMyPassword(FormName,pass_setting5,pass_setting4,pass_setting3,pass_setting2,pass_setting1){	
	f = document.forms[FormName];	
			
	if(trim(f.CurrentPassword.value) == "" || trim(f.CurrentPassword.value) == null){ 	 		
		f.CurrentPassword.focus(); 		
		return alert("Please enter valid Current Password!");
	}	
	if(trim(f.NewPassword.value) == "" || trim(f.NewPassword.value) == null ){ 
		f.NewPassword.focus(); 
		return alert("Please enter valid New Password!");
	}	
	

	// check if the password is less than 8 characters
	
	if(f.NewPassword.value.length < pass_setting3 && f.NewPassword.value != ""){
		f.NewPassword.focus();
		return alert("Password must have a minimum length of (" +pass_setting3+ ") character(s).");
	}
	

	// check if the password contain at least (n) letters
	
	sLetters = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
	ntcount = 0;
	pass_text = f.NewPassword.value;
	pass_length = pass_text.length - 1;

	for(i=0; i<= pass_length; i++){
		
		if(sLetters.indexOf(pass_text.substr(i,1).toUpperCase())>-1) ntcount++;
	    if(ntcount > pass_setting1) break;
	}
	if(ntcount < pass_setting1 && f.NewPassword.value != "" ){
		
		return alert("The password is required to have at least (" +pass_setting1+ ") letter(s).");
	}
	
	
	// check if the password contain at least (n) numbers
	
	sNumbers = "01234567890";
	ntcount = 0;
	
	pass_text = f.NewPassword.value;
	pass_length = pass_text.length - 1;
    
	for(i=0; i<= pass_length; i++){
		
		if(sNumbers.indexOf(pass_text.substr(i,1).toUpperCase())>-1) ntcount++;
	    if(ntcount > pass_setting2) break;
	}
	
	if(ntcount < pass_setting2 && f.NewPassword.value != "" ){	
		return alert("The password is required to have at least (" +pass_setting2+ ") numbers(s).");
	}

    // check if the password contains at least (n) Uppercase Letters -> STARTS

    ntcount =0;
	pass_text = f.NewPassword.value;
	pass_length = pass_text.length - 1;
	
	for(i=0; i<= pass_length; i++){
	 if(sLetters.indexOf(pass_text.substr(i,1))>-1) ntcount++;
	    if(ntcount > pass_setting4) break;
		
	}
   
    if(ntcount < pass_setting4 && f.NewPassword.value != "" ){
		
		return alert("The password is required to have at least (" +pass_setting4+ ") capital letter(s).");
	}
   

    // check if the password contains at least (n) Special Characters
   
    sSpecChars = "`'~!@#$%^&*()_-+={[}]/|:<,>.?\"}";
	ntcount =0;
	pass_text = f.NewPassword.value;
	pass_length = pass_text.length - 1;
   
   
   for(i=0; i<= pass_length; i++){
   	
     if(sSpecChars.indexOf(pass_text.substr(i,1))>-1) ntcount++;
	 	if(ntcount > pass_setting5) break;
    
   }

    if(ntcount < pass_setting5 && f.NewPassword.value != "" ){
		
		return alert("The password is required to have at least (" +pass_setting5+ ") special characters(s) such as " +sSpecChars+ ".");
	}
	
	if(trim(f.ConfirmPassword.value) == "" || trim(f.ConfirmPassword.value) == null){ 
		f.ConfirmPassword.focus(); 
		return alert("Please enter valid ConfirmPassword Password!");
	}
		
	if(f.ConfirmPassword.value != f.NewPassword.value){ 
		f.ConfirmPassword.focus(); 
		return alert("Passwords did not match!");
	}

	f.submit();
}

function OnSubmitWebUsersForm(FormName,rb_button,pass_setting5,pass_setting4,pass_setting3,pass_setting2,pass_setting1) // 'Edit Button'
{			
	f = document.forms[FormName];		
	if(trim(f.uname.value) == "" || trim(f.uname.value) == null){ 
		f.uname.focus(); 
		return alert("Please enter valid Username!");
	}
	
	if(rb_button==0){ // If Reset Button is not enabled

	if(trim(f.pword.value)!="" && trim(f.pword.value)!=null){ 					
		if(trim(f.confirm_pword.value)!=trim(f.pword.value)){ 
			//f.confirm_pword.value="";
			f.confirm_pword.focus(); 
			return alert("Passwords did not match!");
		}    
	}	
	
	
	// check if the password is less than 8 characters
	
	if(f.pword.value.length < pass_setting3 && f.pword.value != ""){
		f.pword.focus();
		return alert("Password must have a minimum length of (" +pass_setting3+ ") character(s).");
	}
	

	// check if the password contain at least (n) letters
	
	sLetters = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
	ntcount = 0;
	pass_text = f.pword.value;
	pass_length = pass_text.length - 1;

	for(i=0; i<= pass_length; i++){
		
		if(sLetters.indexOf(pass_text.substr(i,1).toUpperCase())>-1) ntcount++;
	    if(ntcount > pass_setting1) break;
	}
	if(ntcount < pass_setting1 && f.pword.value != "" ){
		
		return alert("The password is required to have at least (" +pass_setting1+ ") letter(s).");
	}
	
	
	// check if the password contain at least (n) numbers
	
	sNumbers = "01234567890";
	ntcount = 0;
	
	pass_text = f.pword.value;
	pass_length = pass_text.length - 1;
    
	for(i=0; i<= pass_length; i++){
		
		if(sNumbers.indexOf(pass_text.substr(i,1).toUpperCase())>-1) ntcount++;
	    if(ntcount > pass_setting2) break;
	}
	
	if(ntcount < pass_setting2 && f.pword.value != "" ){	
		return alert("The password is required to have at least (" +pass_setting2+ ") numbers(s).");
	}

    // check if the password contains at least (n) Uppercase Letters -> STARTS

    ntcount =0;
	pass_text = f.pword.value;
	pass_length = pass_text.length - 1;
	
	for(i=0; i<= pass_length; i++){
	 if(sLetters.indexOf(pass_text.substr(i,1))>-1) ntcount++;
	    if(ntcount > pass_setting4) break;
		
	}
   
    if(ntcount < pass_setting4 && f.pword.value != "" ){
		
		return alert("The password is required to have at least (" +pass_setting4+ ") capital letter(s).");
	}
   

    // check if the password contains at least (n) Special Characters
   
    sSpecChars = "`'~!@#$%^&*()_-+={[}]/|:<,>.?\"}";
	ntcount =0;
	pass_text = f.pword.value;
	pass_length = pass_text.length - 1;
   
   
   for(i=0; i<= pass_length; i++){
   	
     if(sSpecChars.indexOf(pass_text.substr(i,1))>-1) ntcount++;
	 	if(ntcount > pass_setting5) break;
    
   }

    if(ntcount < pass_setting5 && f.pword.value != "" ){
		
		return alert("The password is required to have at least (" +pass_setting5+ ") special characters(s) such as " +sSpecChars+ ".");
	}

	}// // Reset button checking ends

	if(f.empno.value == -1){
		if(trim(f.FiledAs.value) == "" || trim(f.FiledAs.value) == null){ 
			f.FiledAs.focus(); 
			return alert("Please enter valid FiledAs!");
		}
	}	
	
	if(trim(f.Email.value) == "" || trim(f.Email.value) == null){ 
			f.Email.focus(); 
			return alert("Please enter valid Email!");
	}
	if(!onValidEmail(f.Email.value)){
			f.Email.focus(); 
			return alert("Please enter valid Email!	");
	}		
	
	if(f.ugno.value == -1 || f.ugno.value=="" || f.ugno.value == null){
		f.ugno.focus(); 
		return alert("Please select Group!");
	}
			
	f.SUBMIT_AS.value = "UPDATE_FORM";	
	f.submit();
}


function OnSubmitWebUsersForm2(FormName,rb_button,pass_setting5,pass_setting4,pass_setting3,pass_setting2,pass_setting1) // 'Add Button'
{		

    //alert('a');
	f = document.forms[FormName];		
	if(trim(f.uname.value) == "" || trim(f.uname.value) == null){ 
		f.uname.focus(); 
		return alert("Please enter valid Username!");
	}
	

	if(rb_button==0){ // If Reset Button is not enabled
	
	
	if(trim(f.pword.value)=="" || trim(f.pword.value)==null){ 					
		f.pword.focus(); 
		return alert("Please input a Password!");
	}
	

		
	// check if the password is less than 8 characters
	
	if(f.pword.value.length < pass_setting3){
		f.pword.focus();
		return alert("Password must have a minimum length of (" +pass_setting3+ ") character(s).");
	}
	

	// check if the password contain at least (n) letters
	
	sLetters = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
	ntcount = 0;
	pass_text = f.pword.value;
	pass_length = pass_text.length - 1;

	for(i=0; i<= pass_length; i++){
		
		if(sLetters.indexOf(pass_text.substr(i,1).toUpperCase())>-1) ntcount++;
	    if(ntcount > pass_setting1) break;
	}
	if(ntcount < pass_setting1 ){
		
		return alert("The password is required to have at least (" +pass_setting1+ ") letter(s).");
	}
	
	
	// check if the password contain at least (n) numbers
	
	sNumbers = "01234567890";
	ntcount = 0;
	
	pass_text = f.pword.value;
	pass_length = pass_text.length - 1;
    
	for(i=0; i<= pass_length; i++){
		
		if(sNumbers.indexOf(pass_text.substr(i,1).toUpperCase())>-1) ntcount++;
	    if(ntcount > pass_setting2) break;
	}
	
	if(ntcount < pass_setting2 ){	
		return alert("The password is required to have at least (" +pass_setting2+ ") numbers(s).");
	}

    // check if the password contains at least (n) Uppercase Letters -> STARTS

    ntcount =0;
	pass_text = f.pword.value;
	pass_length = pass_text.length - 1;
	
	for(i=0; i<= pass_length; i++){
	 if(sLetters.indexOf(pass_text.substr(i,1))>-1) ntcount++;
	    if(ntcount > pass_setting4) break;
		
	}
   
    if(ntcount < pass_setting4 ){
		
		return alert("The password is required to have at least (" +pass_setting4+ ") capital letter(s).");
	}
   
   
   
    // check if the password contains at least (n) Special Characters
   
    sSpecChars = "`'~!@#$%^&*()_-+={[}]/|:<,>.?\"}";
	ntcount =0;
	pass_text = f.pword.value;
	pass_length = pass_text.length - 1;
   
   
   for(i=0; i<= pass_length; i++){
   	
     if(sSpecChars.indexOf(pass_text.substr(i,1))>-1) ntcount++;
	 	if(ntcount > pass_setting5) break;
    
   }

    if(ntcount < pass_setting5 ){
		
		return alert("The password is required to have at least (" +pass_setting5+ ") special characters(s) such as " +sSpecChars+ ".");
	}



		if(trim(f.confirm_pword.value)!=trim(f.pword.value)){ 
			//f.confirm_pword.value="";
			f.confirm_pword.focus(); 
			return alert("Passwords did not match!");
		}    
		
    } // Reset button checking ends
		
	if(f.empno.value == -1){
		if(trim(f.FiledAs.value) == "" || trim(f.FiledAs.value) == null){ 
			f.FiledAs.focus(); 
			return alert("Please enter valid FiledAs!");
		}

	}	
	
	if(trim(f.Email.value) == "" || trim(f.Email.value) == null){ 
			f.Email.focus(); 
			return alert("Please enter valid Email!");
	}
	if(!onValidEmail(f.Email.value)){
			f.Email.focus(); 
			return alert("Please enter valid Email!	");
	}	
	

	if(f.ugno.value == -1 || f.ugno.value=="" || f.ugno.value == null){
		f.ugno.focus(); 
		return alert("Please select Group!");
	}
			
	f.SUBMIT_AS.value = "UPDATE_FORM";	
	f.submit();
}

function prompt_msg(){

	var c = confirm('Accounts will now be created for employees with email accounts.\n\nPassword will be sent directly to employee\'s email account.');

	if(c==true){		
		window.location = 'initialize_employee.php';
		
	}

}


function randomString() {
	var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZ";
	var string_length = 8;
	var randomstring = '';
	for (var i=0; i<string_length; i++) {
		var rnum = Math.floor(Math.random() * chars.length);
		randomstring += chars.substring(rnum,rnum+1);	
	}
	document.getElementById('pwordx').value = randomstring;
	document.getElementById('confirm_pword').value = randomstring;	
	document.getElementById('hd_reset').value = 1;
	document.getElementById('pwordx').readOnly=true;
	document.getElementById('confirm_pword').readOnly=true;	
	
	//document.randform.randomfield.value = randomstring;
}






function SubmitAuditTrailForm(){
	f = document.forms[0];
	if(f.filter_startdate.value > f.filter_enddate.value){
		f.filter_enddate.value = f.filter_startdate.value;	
	}	
}
function ValidatePasswordField(){	
	f = document.forms[0];
	if(trim(f.pword.value)=="" || trim(f.pword.value)==null)		
		f.confirm_pword.value = "";	
}
function RepaintForm(){	
	f = document.forms[0];
	if(f.empno.value == -1){
		document.getElementById("FiledAs").style.display = '';
		document.getElementById("Email").style.display   = '';
	}else{
		document.getElementById("FiledAs").style.display = 'none';
		//document.getElementById("Email").style.display   = 'none';
	}
}