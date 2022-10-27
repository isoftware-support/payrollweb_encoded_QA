
    showBdateList();

    function showBdateList(){

        let s = localStorage.getItem('my-bday-sort') || "desc";
        const url = 'includes/ajax/sections/birthday_celebrants_section/birthday_celebrants_section.php?s='+ s;
        xxhrGet(url, (res)=>{
            get('#birthday_celebrants_section').innerHTML = res;

            const e = getById('bdate-list');
            e.style.cursor = "pointer" ;
            e.onclick = ()=>{
                s = s == 'asc' ? 'desc' : 'asc';
                localStorage.setItem('my-bday-sort', s);
                showBdateList();
            }
        });  
    }
