export let ttr_cls_annotationDialog_sizeButton = function() {
 
 let click = function(e) {
  let app = this;
  let id = e.currentTarget.id;
  app.ui.changeAnnotationSet(id);
 }
 click.useCapture = true;

 return {
          click: click,
        };
}();