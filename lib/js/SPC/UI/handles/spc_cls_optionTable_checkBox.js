export let spc_cls_optionTable_checkBox = function() {
 
 let click = function(e) {
  let checkBox = e.currentTarget;
  checkBox.optionTable.setDataValue(checkBox.i,checkBox.j,checkBox.checked);
 }
 click.useCapture = true;

 return {
          click   : click
        };


}();