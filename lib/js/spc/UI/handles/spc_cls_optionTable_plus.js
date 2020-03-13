export let spc_cls_optionTable_plus = function() {
 
 let click = function(e) {
  let optionTable = e.currentTarget.optionTable;
  let lastCell = optionTable.node.childNodes[1].lastElementChild.lastElementChild;
  optionTable.commit(lastCell.i);
 }
 click.useCapture = true;

 return {
          click   : click
        };


}();