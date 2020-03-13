export let spc_cls_form_nosubmit = function() {
 
 let submit = function(e) {
  e.stopImmediatePropagation() ;
  e.preventDefault();
  return false;
 }
 submit.useCapture = true;

 return {
          submit   : submit,
        };
}();