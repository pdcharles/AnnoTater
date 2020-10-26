export let ttr_ele_sourceDialog_dataSource_chooser = function() {

 let mouseup = function(e) {
  let app = this;
  app.ui.sourceDialog.setSelectedSource();
 }
 mouseup.useCapture = true;

 return {
          mouseup : mouseup,
        };
}();