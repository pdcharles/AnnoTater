export let spc_cls_dialog_acceptButton = function() {
 
 let click = function(e) {
  let app = this;
  app.ui.acceptDialog();
 }
 click.useCapture = true;

 return {
         click: click
        };
}();