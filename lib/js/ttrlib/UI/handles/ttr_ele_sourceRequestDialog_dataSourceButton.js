export let ttr_ele_sourceRequestDialog_dataSourceButton = function() {

 let click = function(e) {
  let app = this;
  app.ui.sourceRequestDialog.getSource();
 }
 click.useCapture = true;

 return {
          click: click
        };
}();