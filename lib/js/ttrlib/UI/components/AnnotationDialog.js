export let AnnotationDialog = function() {

 let _AnnotationDialog = function(ui) {
  this.ui = ui;

  this.node = document.createElement('div');
  this.node.id = 'ttr_ele_annotationDialog';
  this.node.classList.add('ttr_cls_dialog','ttr_cls_dialog_fromTopBar');

  this.tolerance = document.createElement('div');
  this.tolerance.classList.add('ttr_cls_dialog_item');

  this.tolerance.ppm_label = document.createElement('label');
  this.tolerance.ppm_label.setAttribute('for','ttr_ele_annotationDialog_tolerance_ppm');
  this.tolerance.ppm_label.append(document.createTextNode('Fragment Ion Tolerance (ppm): '));
  this.tolerance.append(this.tolerance.ppm_label);
  this.tolerance.ppm = document.createElement('input');
  this.tolerance.ppm.id = 'ttr_ele_annotationDialog_tolerance_ppm';
  this.tolerance.ppm.type = 'number';
  this.tolerance.append(this.tolerance.ppm);
  this.node.append(this.tolerance);

  this.ionTypes = document.createElement('div');
  this.ionTypes.classList.add('ttr_cls_dialog_item');
  this.ionTypes.append(document.createTextNode('Ion Types:'));
  this.ionTypes.append(document.createElement('br'));

  this.ionTypes.ions = {};
  this.ionTypes.labels = {};
  this.ionTypes.cols = {};
  [['a','series fragment']
  ,['b','series fragment']
  ,['c','series fragment']
  ,['x','series fragment']
  ,['y','series fragment']
  ,['z','series fragment']
  ,['p','precursor']
  ,['i','immonium']]
  .forEach(([ion,desc]) => {
   this.ionTypes.ions[ion] = document.createElement('input');
   this.ionTypes.ions[ion].id = 'ttr_ele_annotationDialog_ionTypes_ion_'+ion;
   this.ionTypes.ions[ion].type = 'checkbox';
   this.ionTypes.append(this.ionTypes.ions[ion]);
   this.ionTypes.labels[ion] = document.createElement('label');
   this.ionTypes.labels[ion].setAttribute('for','ttr_ele_annotationDialog_ionTypes_ion_'+ion);
   this.ionTypes.labels[ion].append(document.createTextNode(ion+' ion ('+desc+')'));
   this.ionTypes.append(this.ionTypes.labels[ion]);
   this.ionTypes.cols[ion] = document.createElement('input');
   this.ionTypes.cols[ion].id = 'ttr_ele_annotationDialog_ionTypes_col_'+ion;
   this.ionTypes.cols[ion].type = 'color';
   this.ionTypes.append(this.ionTypes.cols[ion]);
   this.ionTypes.append(document.createElement('br'));
  });
  this.node.append(this.ionTypes);

  this.smartFilter = document.createElement('div');
  this.smartFilter.classList.add('ttr_cls_dialog_item');
  this.smartFilter.perform = document.createElement('input');
  this.smartFilter.id = 'ttr_ele_annotationDialog_smartFilter_perform';
  this.smartFilter.perform.type = 'checkbox';
  this.smartFilter.append(this.smartFilter.perform);
  this.smartFilter.perform_label = document.createElement('label');
  this.smartFilter.perform_label.setAttribute('for','ttr_ele_annotationDialog_smartFilter_perform');
  this.smartFilter.perform_label.append(document.createTextNode('Use \'smart\' labelling - label one example for each ion type, preferring lowest charge and no neutral loss'));
  this.smartFilter.append(this.smartFilter.perform_label);
  this.node.append(this.smartFilter);

  this.smartZoom = document.createElement('div');
  this.smartZoom.classList.add('ttr_cls_dialog_item');
  this.smartZoom.perform = document.createElement('input');
  this.smartZoom.id = 'ttr_ele_annotationDialog_zoom_perform';
  this.smartZoom.perform.type = 'checkbox';
  this.smartZoom.append(this.smartZoom.perform);
  this.smartZoom.perform_label = document.createElement('label');
  this.smartZoom.perform_label.setAttribute('for','ttr_ele_annotationDialog_zoom_perform');
  this.smartZoom.perform_label.append(document.createTextNode('Use \'smart\' zoom - show only labelled ion area'));
  this.smartZoom.append(this.smartZoom.perform_label);
  this.node.append(this.smartZoom);

  //Reject and Accept

  [this.node.reject,this.node.accept] = ttrlib.UI.components.common.rejectAccept();
  this.node.append(this.node.reject,this.node.accept);
  
  this.ui.view.dialogs.append(this.node);
 }

 _AnnotationDialog.prototype.update = function() {
  let par = this.ui.app.annotatedSpectra[this.ui.aSIndex].params;
  this.tolerance.ppm.value = par.tolerance;
  Object.entries(this.ionTypes.ions)
  .forEach(([ion,ele]) => ele.checked = par.ionTypeShown.includes(ion));
  Object.entries(this.ionTypes.cols)
  .forEach(([ion,ele]) => ele.value = this.ui.app.palette[par.ionTypeCol[ion]]);
  this.smartFilter.perform.checked = par.smartFilter;
  this.smartZoom.perform.checked = 'smart' in par.zoom && par.zoom.smart == 'both';
 }

 _AnnotationDialog.prototype.open = function() {
  this.update();
  ttrlib.UI.show(this.node);
 }

 _AnnotationDialog.prototype.close = function() {
  ttrlib.UI.hide(this.node);
 }

 _AnnotationDialog.prototype.validate = function() {
  return true;
 }

 _AnnotationDialog.prototype.accept = function() {
  let aS = this.ui.app.annotatedSpectra[this.ui.aSIndex];

  let itc = {};
  Object.entries(this.ionTypes.cols)
  .forEach(([ion,ele]) => {
   if (aS.app.palette.includes(ele.value)) itc[ion] = aS.app.palette.indexOf(ele.value);
   else itc[ion] = aS.app.palette.push(ele.value)-1;
  })

  aS.setParams({
   autoAnnotate: true,
   tolerance: this.tolerance.ppm.value,
   zoom: this.smartZoom.perform.checked ? {smart:'both'} : {full:'both'},
   ionTypeShown: Object.entries(this.ionTypes.ions).filter(([ion,ele]) => ele.checked).map(([ion,ele]) => ion),
   ionTypeCol: itc,
   smartFilter: this.smartFilter.perform.checked,
  });
 }

 return _AnnotationDialog;
}();
