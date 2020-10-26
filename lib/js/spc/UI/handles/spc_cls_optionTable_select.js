export let ttr_cls_optionTable_select = function() {
 
 let change = function(e) {
  let select = e.currentTarget;
  select.optionTable.setDataValue(select.cell.i,select.cell.j,select.value);
 }
 change.useCapture = true;

 return {
          change   : change
        };


}();