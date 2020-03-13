export let spc_cls_topbarButton = function() {
 
 let click = function(e) {
  if (!e.currentTarget.classList.contains('disable')) {
   let app = this;
   let id = e.currentTarget.id;
   app.ui.openDialog(id);
  }
 }
 click.useCapture = true;

 return {
          click   : click,
        };
}();