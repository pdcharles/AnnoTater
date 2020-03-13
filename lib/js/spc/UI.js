import * as components from './UI/components/_index.js';
import * as handles from './UI/handles/_index.js';

export let UI = function() {

 const UI_UPDATE_INTERVAL = 1000;

 let DialogSession = function(isOpen) {
  this.open = isOpen;
  this.dialog = null;
  this.response = {};
 }
 
 let _UI = function(app) {
  this.app = app;

  this.fontFamily = window.getComputedStyle(this.app.elementRoot).fontFamily;
  this.dialogSession = new DialogSession(false);

  this.view = new components.View(this);
  this.sourceDialog = new components.SourceDialog(this);

  Array.from(this.app.elementRoot.querySelectorAll('[id]')).forEach(id => assignHandles(app,id) );
  Array.from(this.app.elementRoot.querySelectorAll('[class]')).forEach(ele => { if(!ele.id) assignHandles(app,ele) } );
 }


//---

 _UI.prototype.openDialog = function(callerId) {
  if (!this.dialogSession.open) {
   this.dialogSession = new DialogSession(true);
   switch(callerId) {
    case 'spc_ele_importButton' :
     this.sourceDialog.open();
     break;
//    case 'spc_ele_annotateButton' :
//     this.getAnnotationDetails(); 
//     break;
   }
  }
 }

 _UI.prototype.rejectDialog = function() {
  hide(this.dialogSession.dialog.node);
  this.dialogSession.open = false;
 }

 _UI.prototype.acceptDialog = function() {
  this.dialogSession.dialog.node.accept.classList.remove('warn');
  void this.dialogSession.dialog.node.accept.offsetWidth;
  if (this.dialogSession.dialog.validate()) {
   this.dialogSession.dialog.accept();
   hide(this.dialogSession.dialog.node);
   this.dialogSession.open = false;
  }
  else {
   this.dialogSession.dialog.node.accept.classList.add('warn');
  }
 }

//---

 _UI.prototype.getAnnotationDetails = function() {
  let aS = this.app.annotatedSpectra[this.aSIndex];
  /*
  removeChildren(this.elements['spc_ele_peptideDialog_customDefinitions']) //rebuild custom defs each time
  let modificationRows = Object.entries(this.app.modificationDefinitions).map(([token,modificationDefinition]) => 
   [false,token,Object.entries(modificationDefinition.atoms).map([atom,n] => `${mslib.constants.ELEMENTS[atom].symbol}${n}`).join(' ')] 
  );
  this.elements['spc_ele_peptideDialog_customDefinitions'].appendChild( new optionTable([['token','definition'],...modificationRows]).domEle );
  let residueRows = Object.entries(this.app.residueDefinitions).map(([token,residueDefinition]) => 
   [false,token,Object.entries(residueDefinition.atoms).map([atom,n] => `${mslib.constants.ELEMENTS[atom].symbol}${n}`).join(' ')] 
  );
  this.elements['spc_ele_peptideDialog_customDefinitions'].appendChild( new optionTable([['token','definition'],...residueRows]).domEle );
  */
  this.dialogSession.dialog = this.elements['spc_ele_annotateDialog'];
  show(this.dialogSession.dialog);
 }

 _UI.prototype.annotationDialogComplete = function() {
  let aS = this.app.annotatedSpectra[this.aSIndex];
  let sequence = this.elements['spc_ele_peptideDialog_sequence'].value;
  aS.setAnnotation(new mslib.data.Peptide({chains:[new mslib.data.AminoAcidChain({
   sequenceString : this.elements['spc_ele_peptideDialog_sequence'].value,
   modificationDefinitions : this.app.modificationDefinitions,
   residueDefinitions : this.app.residueDefinitions
  })]}));
 }

//---

 let assignHandles = function(ctx,ele) {
  Object.entries(UI.handles)
  .filter(([targetName,events]) => (ele.id == targetName)|ele.classList.contains(targetName))
  .forEach(([targetName,events]) => {
   console.log(targetName);
   Object.entries(events).forEach(([eventName,action]) => {
    ele.addEventListener(
     eventName,
     action.bind(ctx),
     action.useCapture
    );
   });
  });
 }

 let removeChildren = function(node) {
  node.querySelectorAll(':scope > *').forEach(child => {console.log(child); node.removeChild(child) });
 }

// let resetDisplayStyleAll = function(node) {
//  node.style.display='';
//  Array.from(node.querySelectorAll('*')).forEach(ele => ele.style.display=''); 
// }

 let show = function(node) {
  node.classList.remove('hide');
  node.classList.add('show');
 }

 let hide = function(node) {
  node.classList.add('hide');
  node.classList.remove('show');
 }

 let enable = function(node) {
  node.classList.remove('disable');
 }

 let disable = function(node) {
  node.classList.add('disable');
 }

 _UI.components = components;
 _UI.handles = handles;

 _UI.assignHandles = assignHandles;
 _UI.removeChildren = removeChildren;
 _UI.show = show;
 _UI.hide = hide;
 _UI.enable = enable;
 _UI.disable = disable;


 return _UI;
}();