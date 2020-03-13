export let spc_ele_sourceDialog_select = function() {

 let mouseup = function(e) {
  let app = this;
  app.ui.sourceDialog.setSelectedSource();
 }
 mouseup.useCapture = true;

 return {
          mouseup : mouseup,
        };
}();