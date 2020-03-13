export let spc_cls_dialogLaunchButton = function() {
 
 let click = function(e) {
  if (!e.currentTarget.classList.contains('disable')) {
   let app = this;
   let id = e.currentTarget.id;
   app.ui.launchDialog(id);
   console.log(id);
  }
 }
 click.useCapture = true;

 return {
          click   : click,
        };
}();
