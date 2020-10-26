
export let ttr_ele_exportButton = function() {

 let click = function(e) {
  let app = this;
  let svgDataURL = URL.createObjectURL(new Blob([this.annotatedSpectra[this.ui.aSIndex].figure.toText()], {type: "image/svg+xml;charset=utf-8"}));
  let a = document.createElement('a');
  a.style.display = 'none'
  app.elementRoot.append(a);
  a.href = svgDataURL;
  a.download = this.annotatedSpectra[this.ui.aSIndex].sourceDetails.name+'_'+this.annotatedSpectra[this.ui.aSIndex].sourceDetails.scanNumber+'.svg';
  a.click();
  URL.revokeObjectURL(svgDataURL);
  app.elementRoot.removeChild(a);
 }
 click.useCapture = true;

 return {
          click : click,
        };
}();




