function close_window(){
var x = document.forms[0];
xx = x.group_id.value;
y = x.cm_id.value;
window.location = "content_manager.php?optSection=" + xx + "&id=" + y;

}
function extractVals()
{
    param = "";
    f = document.forms[0];
    for (i = 0; i < f.elements.length; i++) {
        if ((f.elements[i].name == "id[]") && (f.elements[i].type == "radio")
            && (f.elements[i].checked)) {
            if (param != "") param = param + ",";
            param = param + f.elements[i].value;
        }
    }
    return param;
}
function getCurrent()
{
    pp = window.location.href;
    return "&prevpage=" + escape(pp);
}
function EditContent()
{
    var x = document.forms[0];
    param2 = x.optSection.value;
    param = extractVals();
    if (param == "") return alert("Please select at least one record.");
    window.location = "edit_content.php?cm_id=" + escape(param) + getCurrent() + "&optSection=" + param2;
}
function DeleteContent()
{
	var x = document.forms[0];
	param2 = x.optSection.value;
    param = extractVals();
    if (param == "") return alert("Please select at least one record.");
    window.location = "delete_content.php?cm_id=" + escape(param) + getCurrent() + "&optSection=" + param2;
}
function viewArticleContent(artObj)
{
 var x = document.forms[0];
 param = extractVals();
 param2 = x.optSection.value;
 if (param == "") return alert("Please select at least one record.");
 window.location = "view_content.php?&article=" + escape(param) + getCurrent() + "&optSection=" + param2;

}


function viewSection(secObj){
var x = secObj.value;
    window.location = "content_manager.php?optSection=" + x;
}

