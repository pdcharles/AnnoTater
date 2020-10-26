export let DefinitionsDialog = function() {

 let _DefinitionsDialog= function(ui) {
  this.ui = ui;

  this.node = document.createElement('div');
  this.node.id = 'ttr_ele_definitionsDialog';
  this.node.classList.add('ttr_cls_dialog','ttr_cls_dialog_fromMidScreen');

  this.elements = document.createElement('div');
  this.elements.classList.add('ttr_cls_dialog_item');

  this.elements.label = document.createElement('label');
  this.elements.label.for = 'ttr_ele_definitionsDialog_elementsTable';
  this.elements.label.append(document.createTextNode('Elements'));
  this.elements.append(this.elements.label);
  this.elements.append(document.createElement('br'));

  this.elements.table = new ttrlib.UI.components.OptionTable(
   this.ui.app.elementObjToArr(this.ui.app.definitions.elements),
   ['text','text','code'],
   ['Name','Token','Isotopes'],
   _DefinitionsDialog.prototype.update.bind(this)
  );
  this.elements.append(this.elements.table.node);

  this.node.append(this.elements);

  //Reject and Accept

  [this.node.reject,this.node.accept] = ttrlib.UI.components.common.rejectAccept();
  this.node.append(this.node.reject,this.node.accept);
  
  this.ui.view.dialogs.append(this.node);
 }

 _DefinitionsDialog.prototype.update = function() {
  this.elements.table.setData(
   this.elements.table.data,
   this.elements.table.types,
  )
 }

 _DefinitionsDialog.prototype.open = function() {
  this.update();
  ttrlib.UI.show(this.node);
 }

 _DefinitionsDialog.prototype.close = function() {
  ttrlib.UI.hide(this.node);
 }

 _DefinitionsDialog.prototype.validate = function() {
  return true;
 }

 _DefinitionsDialog.prototype.accept = function() {
  this.ui.app.definitions.elements = this.ui.app.elementArrToObj(this.elements.table.data);
 }

 return _DefinitionsDialog;
}();
