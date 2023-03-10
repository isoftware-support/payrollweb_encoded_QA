


// sanitize allowed domains
altDomains = altDomains.replace(/ /g,"");  // remove spaces
altDomains = altDomains.replace(/;/g,",");  // remove spaces
altdomains = altDomains.toLowerCase();
let domains = altDomains.split(',');

var pdfParams = '1'; 
var newDispute = true;

function _suggestEmail(){

  email = employee_email.toLowerCase() ;

  if ( _isValidDomain(email) ){
    let e = getById("send_to_email");
    if (e) e.value = email;
  }

}

function _isValidDomain( email )
{

  if (domains.length == 0) return true;  // no domain setting

  let ret = false;

  for(let i = 0; i < domains.length; i++){
    if ( email.indexOf( domains[i]) > -1 ){
      
      let e = getById("send_to_email");
      if ( e){
        e.value = email;
        ret = true;
        break;
      }
    } 
  } 
  return ret;
}

function _err_msg( msg ){

  let lbl = getById("err_msg");
  lbl.style.display = '';
  lbl.innerHTML = msg;
  setTimeout(function(){ lbl.style.display='none'; }, 5000); 

}

function email_ajax(){

  let email = employee_email;   // actual employee email
  
  if ( isSendToAltEmail == "1" ){

    email = getById("send_to_email").value;  // input email
  
    if ( ! isEmailValid(email) ){
      _err_msg("Please input valid email address.");
      return;
    }

    // check domain
    if ( ! _isValidDomain(email) ){
      _err_msg("Email address domain is invalid.");
      return;
    }

  }
  

  xxhr("GET", "_payroll/pdf_print.php?pd="+pdfParams +"&ea="+email,
    function(msg){
      msgBox( msg.trim() );        
      busy.hide()
    });

  busy.show2()
  msgBox('Please wait for a moment while sending to your email account.');  

}


function generatePayroll(){

    busy.show2()  ;

    generated_cutoff_date = get('#cutoff_nav_start').value;

    var posts = [];
    posts['ds'] = generated_cutoff_date;
    posts['de'] = get('#cutoff_nav_end').value;

    var e = get("select[name='team_emp']");
    if ( e )
        posts['tmm'] = e.value;
        
    // pass requirement
    e = get("#cutoff_nav_user_pass");  
    if ( e ){
        let p = e.value;
        if ( ! p ) p = "none";
        posts['rp'] = p;
    }

     // posts['debug'] = 1;
    //console.log( posts);

    xxhrPost("_payroll/payroll_ajax.php?q=payrollHistory"+ _session_vars, posts, 
    function( res ){

        let data = JSON.parse(res);

        pdfParams = data.pdfParams;

        //console.log( data);
        // history
        var e = get("#payroll_section");
        if (e)
            e.innerHTML = data.html;
        
        // buttons
        e = get("#payroll_buttons");
        if ( e ){
          
          if ( data.btn ){
              e.classList.remove("d-none");
          }else{
              e.classList.add("d-none");
          }
        }

        // pass
        e = get("#cutoff_nav_user_pass");  
        if ( e ) e.value = "";        

        busy.hide();

        // console.log(data);

    });
}

function previewPDFpayslip(){
    
    window.open( PAYROLLWEB_URI + "/_payroll/pdf_print.php?pd="+ pdfParams, "_blank"); 

}

function acknowledgePayslip(t){

  let cancel_dispute_btn = get("#cancel_dispute");

  let ds = "&ds="+ generated_cutoff_date;
  let d = "&debug=1";  //1

  if ( t == -1){            // dispute

    busy.show2();
    
    xxhrGet( PAYROLLWEB_URI + "/_payroll/payroll_ajax.php?q=getDisputeLog"+ ds + d + _session_vars,
    function(res){      

      //nsole.log(res);
      let data = JSON.parse(res);

      let txt = get("#dispute_remarks");      

      var remarks = "";
      if ( data.remarks ){  // already have dispute remarks
        remarks = data.remarks;
        cancel_dispute_btn.style.display = "";
        txt.dataset.new = '0';

        newDispute = false;

      }else{
        cancel_dispute_btn.style.display = "none";  //hide cancel button
        newDispute = true;
      }      
      
      txt.value = remarks;
      

      _showDisputeBox();
      busy.hide();
    });
  
  }else if( t == -11 ){     // submit dispute

      let remarks = get("#dispute_remarks").value;

      if ( !remarks ) return;

      busy.show2();

      if ( newDispute )
        _err_msg( "Sending dispute payslip alert." );        

      let r = "&r="+ remarks;
      xxhrGet( PAYROLLWEB_URI + "/_payroll/payroll_ajax.php?q=disputeLog"+ ds + d + r + _session_vars,
      function(res){      

        // console.log( res);

        let data = JSON.parse(res);
        // console.log(data);

        var msg = "Dispute for payslip has been submitted.";
        if ( data.success == "0" )
            msg = "Dispute remarks has beed updated.";

        _err_msg( msg );        
        
        _showDisputeBox( -1 );

        busy.hide();

      });
  
  }else if( t == -111 ){    // delete dispute entry           

      const func = () => {
        busy.show2();
        xxhrGet( PAYROLLWEB_URI + "/_payroll/payroll_ajax.php?q=removeDisputeLog"+ ds + d + _session_vars,
        function(res){      

          var data = JSON.parse( res);

          if ( data.success == "1")
            _err_msg( "Dipute log has been deleted.");

          _showDisputeBox( -1 );

          busy.hide();
        });
      }

      msgBox("Remove created payslip dispute log?", {okCallBack: func, cancelButton: true}) 

  }else if( t == 0 ){       // cancel dispute

    _showDisputeBox( -1 );

  }else{

    const func = () => {

      busy.show2();

      let d = "&debug=1";

      xxhrGet( PAYROLLWEB_URI + "/_payroll/payroll_ajax.php?q=acknowledgeLog"+ ds + d + _session_vars,
      function(res){      
        
        let data = JSON.parse(res);

        var msg="Payslip acknowledgment has been submitted.";
        if ( data.success == "0"){          
          msg = "The cut-off payslip was already acknowledged on "+ data.dateAcknowledged +".";
        }
        _err_msg(msg);

        busy.hide();
      });      
    }

    msgBox("I hereby acknowledge this payslip.", 
      {okCallBack: func, cancelButton: true})

  }
}

function _showDisputeBox( mode ){
  
  let label = get("#dispute_label");
  label.innerHTML = "Dispute Remarks for cut-off "+ DateFormat(generated_cutoff_date, 'm/d/Y');

  let idDispute = "#dispute_box";
  let div = get(idDispute);

  if ( mode == -1 ){ // hide
    
    div.classList.add("d-none");  

  }else{    
    div.classList.remove("d-none");        
    CenterItem(idDispute) ;
  }

}


