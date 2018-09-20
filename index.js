function popitup_newsevent(url) {
    newwindow=window.open(url, 'name', 'toolbar=0,location=0,directories=0,status=1,menubar=0,scrollbars=1,resizable=0,width=570,height=530');
    if (window.focus) {
      newwindow.focus()
    }
	newwindow.moveTo(screen.availWidth/2-(500/2),screen.availHeight/2-(300/2));
}
function popitup_calendar(url) {
    newwindow=window.open(url, 'name', 'toolbar=0,location=0,directories=0,status=1,menubar=0,scrollbars=1,resizable=0,width=370,height=230');
    if (window.focus) {
      newwindow.focus()
    }
	newwindow.moveTo(screen.availWidth/2-(500/2),screen.availHeight/2-(300/2));
}
