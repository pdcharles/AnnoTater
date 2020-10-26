export let ttr_cls_optionTable_cell = function() {
 
 let focusout = function(e) {
  let cell = e.currentTarget;
  cell.optionTable.setDataValue(cell.i,cell.j,cell.childNodes[0].data);
 }
 focusout.useCapture = true;

 let keydown = function(e) {
  let cell = e.currentTarget;
  if (e.keyCode == 13) {
   e.preventDefault();
   e.stopImmediatePropagation();
   focusout(e);
   if (cell.isEOR) cell.optionTable.commit(cell.i);
  }
 }
 keydown.useCapture = true;

 return {
          focusout   : focusout,
          keydown : keydown
        };


}();