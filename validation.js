
function OnSubmitProfileValidation(thisform) {	

	with (thisform) {

    if ( get("[name='Email']") ){    
  		if(!onValidEmail(Email.value)){
  			
        const func = () => {
          Email.focus();
          Email.select();
        }
        msgBox("Please enter valid email address.", {okCallBack: func});  
  			return false;
  		}
    }

    if ( get("[name='HomePhone1']") ){    
  		if (!validateNum(HomePhone1) && HomePhone1 != "") return false;
    }

    if ( get("[name='HomePhone2']") ){    
  		if (!validateNum(HomePhone2) && HomePhone2 != "") return false;
    }
		
    if ( get("[name='BankAccount']") ){    
  		if (!validateNum(BankAccount) && BankAccount != "") return false;
  	}
		
    if ( get("[name='SSN']") ){    
		  if (!validateNum2(SSN) && SSN != "") return false;
		}
		
    if ( get("[name='TIN']") ){
  		if (!validateNum2(TIN) && TIN != "") return false;
    }

    if ( get("[name='PhilHealthID']") ){    
		  if (!validateNum2(PhilHealthID) && PhilHealthID != "") return false;
		}
		
    if ( get("[name='PagIbigID']") ){    
  		if (!validateNum2(PagIbigID) && PagIbigID != "") return false;
		}
		
    if ( get("[name='PRCLicenseNo']") ){
  		if (!validateNum2(PRCLicenseNo) && PRCLicenseNo != "") return false;
    }

    if ( get("[name='GSISNumber']") ){
  		if (!validateNum2(GSISNumber) && GSISNumber != "") return false;
    }
		
		if ( get("[name='BPNumber']") ){
  		if (!validateNum2(BPNumber) && BPNumber != "") return false;
    }
		
    if ( get("[name='PolicyNo']") ){
  		if (!validateNum2(PolicyNo) && PolicyNo != "") return false;
    }		
		
    if ( get("[name='MobilePhone']") ){    
		  if(MobilePhone.value.length > 0){
			 if  ( !validateGSMNum(MobilePhone)) {
    			return false;
		    }
	    }
    }

    if ( get("[name='RAZIPCode']") ){    
		  if (!validateNum(RAZIPCode) && RAZIPCode != "") return false;
		}
		
    if ( get("[name='RAZIPCode']") ){    
		  if (!validateNum(RAZIPCode) && RAZIPCode != "") return false;
		}
		
    if ( get("[name='LHAZIPCode']") ){    
		  if (!validateNum(LHAZIPCode) && LHAZIPCode != "") return false;
		}
		
    if ( get("[name='FAZIPCode']") ){    
		  if (!validateNum(FAZIPCode) && FAZIPCode != "") return false;
		}
		
    if ( get("[name='Height']") ){    
		  if (!validateNum(Height) && Height != "") return false;
		}
		
    if ( get("[name='Weight']") ){    
		  if (!validateNum(Weight) && Weight != "") return false;
		}
		
    if ( get("[name='WifeClaiming']") ){    
		  if (!validateNum(WifeClaiming) && WifeClaiming != "") return false;
		}
		
    if ( get("[name='NoOfChildren']") ){    
		  if (!validateNum(NoOfChildren) && NoOfChildren != "") return false;
		}
		
	}
	//thisform.submit();
}
function onValidEmail(emailStr) {
    var emailPat=/^(.+)@(.+)$/
    var specialChars="\\(\\)<>@,;:\\\\\\\"\\.\\[\\]"
    var validChars="\[^\\s" + specialChars + "\]"
    var quotedUser="(\"[^\"]*\")"
    var ipDomainPat=/^\[(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\]$/
    var atom=validChars + '+'
    var word="(" + atom + "|" + quotedUser + ")"
    var userPat=new RegExp("^" + word + "(\\." + word + ")*$")
    var domainPat=new RegExp("^" + atom + "(\\." + atom +")*$")

    var matchArray=emailStr.match(emailPat)
    if (matchArray==null) {
          return false;
    }

    var user=matchArray[1]
    var domain=matchArray[2]

    if (user.match(userPat)==null) {
      return false;
    }

    var IPArray=domain.match(ipDomainPat)
    if (IPArray!=null) {
          for (var i=1;i<=4;i++) {
            if (IPArray[i]>255) {
              return false;
            }
      }
      return true;
    }

    var domainArray=domain.match(domainPat);
    if (domainArray==null) {
      return false;
    }

    var atomPat=new RegExp(atom,"g");
    var domArr=domain.match(atomPat);
    var len=domArr.length;

    if (domArr[domArr.length-1].length<2 || domArr[domArr.length-1].length>3) {
      return false;
    }

    if (len<2) {
      return false;
    }

    return true;
  }
function validateGSMNum(field) {


  if ( ! validateCharsOnly(field.value, "0123456789-+() ") ){

    const func = () => {    
      field.focus();
      field.select();
    }
    msgBox("Invalid Mobile Number. ( accepted characters are -+( )09171234567 ) ",
        {okCallBack: func});
    return false;
  }
  return true;
}

function validateNum(field) {

    var valid = "0123456789"
    var ok = "yes";
    var temp;
    for (var i=0; i<field.value.length; i++) {
        temp = "" + field.value.substring(i, i+1);
        if (valid.indexOf(temp) == "-1") ok = "no";
    }
    if (ok == "no") {

      const func = () => {
        field.focus();
        field.select();
      }
      msgBox("Only numbers are accepted in this field.", {okCallBack: func});

      return false;
    }	
    return true;
}

function validateNum2(field) {
    var valid = "0123456789-"
    var ok = "yes";
    var temp;
    for (var i=0; i<field.value.length; i++) {
        temp = "" + field.value.substring(i, i+1);
        if (valid.indexOf(temp) == "-1") ok = "no";
    }
    if (ok == "no") {
      
      const func = () => {      
        field.focus();
        field.select();
      }

      msgBox("Only numbers and (-) symbol are accepted in this field.",
        {okCallBack: func});
      return false;
    }	
    return true;
}


function onVerifyEntry(txtEntry, strMessage){
    if (txtEntry.value=="") {

        msgBox(strMessage, 
          {okCallBack: () => {
            txtEntry.focus()
            txtEntry.select()
          }
        })

        return false;
    }
	return true;
}

 function trim(s) 
{ 
    var l=0; var r=s.length -1; 
    while(l < s.length && s[l] == ' ') 
    {     l++; } 
    while(r > l && s[r] == ' ') 
    {     r-=1;     } 
    return s.substring(l, r+1); 
} 
  