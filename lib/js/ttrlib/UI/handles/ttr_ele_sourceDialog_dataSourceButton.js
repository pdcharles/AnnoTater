export let ttr_ele_sourceDialog_dataSourceButton = function() {

 let click = function(e) {
  let app = this;
  app.ui.sourceDialog.setSelectedSource();
 }
 click.useCapture = true;

 return {
          click: click
        };
}();