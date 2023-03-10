
    showBdateList();

    function showBdateList(){

        let s = localStorage.getItem('my-bday-sort') || "desc";
        const url = 'includes/ajax/sections/birthday_celebrants_section/birthday_celebrants_section.php?s='+ s;
        xxhrGet(url, (res)=>{

            let e = get('#birthday_celebrants_section')
            if (e) e.innerHTML = res;

            e = getById('bdate-list');
            if ( e ){
                e.style.cursor = "pointer" ;
                e.onclick = ()=>{
                    s = s == 'asc' ? 'desc' : 'asc';
                    localStorage.setItem('my-bday-sort', s);
                    showBdateList();
                }
            }
        });  
    }
