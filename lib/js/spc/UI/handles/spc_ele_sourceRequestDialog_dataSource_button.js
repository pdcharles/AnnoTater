export let spc_ele_sourceRequestDialog_dataSource_button = function() {

 let mouseup = function(e) {
  let app = this;
  app.ui.sourceRequestDialog.getSource();
 }
 mouseup.useCapture = true;

 return {
          mouseup : mouseup,
        };
}();