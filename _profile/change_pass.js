
function clickCancel(){
    window.location = "index.php?qid=02";
}


function changePass()
{

    const currPass =    get("input[name='currPass']").value
    const newPass =     get("input[name='newPass']").value
    const confirmPass = get("input[name='confirmPass']").value

    let err = "";
    if( trim(currPass) == "" || trim(newPass) == "" || trim(confirmPass) == "" ){
        err = "Please check your entry. All fields are required."
    
    }else if ( newPass !== confirmPass ){
        err = "New Password and Confirm Password not match."
    }

    if ( err ){
        msgBox(err)
        return;
    }


    // check old pass
    let p = {func: 'ConfirmOldPass', v:currPass, i:userId }
    xxhrPost( root_uri + "/ajax_calls.php", p, (res) => {

        // console.log('configm old pass', res)
        const ret = JSON.parse(res)
        if ( ret.result != "success"){
            return msgBox("Current Password is invalid.")
        }

        p = {func:'CheckPass', v:newPass }
        xxhrPost( root_uri + "/ajax_calls.php", p, (res)=>{


            // console.log('check pass', res)
            const ret = JSON.parse(res)

            const errors = ret.result;
            if ( errors.length ){

                const msg = [{message:'Change password failed! Please check following errors.', class:'c-red pt-4 pb-10'}]
                errors.forEach( (i) =>{
                    msg.push({message: i, class:'h5 py-3'})
                })
                msgBox( msg );
                return;
            }

            p = {func:'UserAccount', id: entryNo , f:'f5', d:'0', v:newPass}
            xxhrPost( root_uri + "/ajax_calls.php", p, (res) =>{
                // console.log(res);

                msgBox("Password changed successfully.",
                    {okCallBack: () => {
                        window.location = "index.php?qid=02";
                    }})
            })

        })

    })
}
