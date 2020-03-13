export let spc_cls_dialog_rejectButton = function() {
 
 let click = function(e) {
  let app = this;
  app.ui.rejectDialog();
 }
 click.useCapture = true;

 return {
         click: click
        };
}();