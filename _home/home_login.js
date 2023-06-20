

// pupulate sections

    // news and events
    xxhrGet('includes/ajax/sections/news_events_section/news_events_section.php', 
        "", 'news_events_section');  
    
    // hr updates
    xxhrGet('includes/ajax/sections/hrupdate_section/hrupdates_section.php',
        "", 'hr_upates_section');

    // links
    xxhrGet('includes/ajax/sections/links_section/links_section.php' ,
        "", 'links_section');  

    // newly hired
    xxhrGet('includes/ajax/sections/new_hires_section/newlyhired_section.php',
        "", 'newly_hired_section');         

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

    _post['browser_info'] = uriString(navigator.appVersion)

    xxhrPost( PAYROLLWEB_URI + "/_home/home_login.php", _post, (res)=>{
               
        let ret = JSON.parse(res);
        const status = ret.ret

        console.log( 'ret', ret);
        // return
        
        if ( status == "success") {
            
            window.location.replace( PAYROLLWEB_URI +"/index.php?qid=01");

        }else{
            
            let div = getById("invalid-login");
            let msg_id = "invalid-login-msg";
            let msg = "Access Denied."

            if ( status == "multi_session"){
                msg = "Multiple login is not allowed."
            }

            div.innerHTML = 
                `<p class='ContentTextNormal bold c-red t-wrap' id='${msg_id}'> ${msg} </p>`;
            
            // let msg = getById('invalid-login-message');
            $("div#"+ msg_id).fadeIn("normal");

            setTimeout( () => { 
                $("p#"+ msg_id).fadeOut("normal", () => div.innerHTML = "");                                  
            }, 8000);    

        }
        _busy.hide();
    });

}