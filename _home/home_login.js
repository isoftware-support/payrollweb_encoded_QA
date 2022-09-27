

// pupulate sections

    // news and events
    xxhrGet('includes/ajax/sections/news_events_section/news_events_section.php', 
    function(res){
        get('#news_events_section').innerHTML = res;
    });  
    
    // hr updates
    xxhrGet('includes/ajax/sections/hrupdate_section/hrupdates_section.php',
    function(res){
        get('#hr_upates_section').innerHTML = res;
    });  

    // links
    xxhrGet('includes/ajax/sections/links_section/links_section.php' ,
    function(res){
        get('#links_section').innerHTML = res;
    });  

    // birthday
    xxhrGet('includes/ajax/sections/birthday_celebrants_section/birthday_celebrants_section.php',
    function(res){
        get('#birthday_celebrants_section').innerHTML = res;
    });  

    // newly hired
    xxhrGet('includes/ajax/sections/new_hires_section/newlyhired_section.php;',
    function(res){
        get('#newly_hired_section').innerHTML = res;
    });         

// ---------------------


// password event - enter key    

function focusNext(event, e){

    if (e.value.trim() ){
        if ( event.keyCode === 13){            
            if ( e.id == "user_name"){
                getById("user_pass").focus();
            }
            if ( e.id == "user_pass"){
                getById("btn-login").click();
            }
        }
    }
     // console.log( event.keyCode);
    // console.dir( e.id);   
}



function loginAttempt()
{
    
    let _post = [];
    _post['user-login'] = "login-user";
    _post['user'] = getById("user_name").value;
    _post['pass'] = getById("user_pass").value;
    _post['token'] = getById("reg_token").value;
    
    let _busy = new BusyGif();
    _busy.show2();

    xxhrPost( PAYROLLWEB_URI + "/_home/home_login.php", _post, (res)=>{
        
        log( res);
        
        let ret = JSON.parse(res);
        if ( ret.ret == "success") {
            window.location.replace( PAYROLLWEB_URI +"/index.php?qid=01");
        }else{
            
            let div = getById("invalid-login");

            let msg_id = "invalid-login-msg";
            div.innerHTML = "<div class='ContentTextNormal bold c-red' id='"+ msg_id +"'>" +
                "Access denied. You are not authorized to access this feature." +
                "</div>";
            
            let msg = getById('invalid-login-message');
            $("div#"+ msg_id).fadeIn("normal");

            setTimeout( () => { 
                $("div#"+ msg_id).fadeOut("normal", () => div.innerHTML = "");                                  
            }, 5000);    

        }
        _busy.hide();
    });

}