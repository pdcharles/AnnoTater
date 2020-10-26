export let SourceRequestDialog = function() {

 let _SourceRequestDialog = function(ui) {
  this.ui = ui;

  this.node = document.createElement('div');
  this.node.id = 'ttr_ele_sourceDialog';
  this.node.classList.add('ttr_cls_dialog','ttr_cls_dialog_fromTopBar');

  this.dataSource = document.createElement('div');
  this.dataSource.classList.add('ttr_cls_dialog_item');

  this.dataSource.instructions = document.createElement('span');
  this.dataSource.instructions.textContent = 'Please indicate the locations of the following raw files';
  this.node.append(this.dataSource.instructions);
  this.node.append(document.createElement('br'));

  this.dataSource.fileNames = document.createElement('div');
  this.node.append(this.dataSource.fileNames);

  this.dataSource.button = document.createElement('div');
  this.dataSource.button.textContent = 'Choose File';
  this.dataSource.button.id = 'ttr_ele_sourceRequestDialog_dataSource_button';
  this.dataSource.button.classList.add('ttr_cls_dialog_button');
  this.dataSource.append(this.dataSource.button);
  this.node.append(this.dataSource);

  //Reject and Accept

  [this.node.reject,this.node.accept] = ttrlib.UI.components.common.rejectAccept();
  this.node.append(this.node.reject,this.node.accept);
  
  this.ui.view.dialogs.append(this.node);
 }

 _SourceRequestDialog.prototype.update = function() {
  ttrlib.UI.removeChildren(this.dataSource.fileNames);
  this.ui.dialogSession.getCurrentCache().filesFound = 0;
  this.ui.dialogSession.getCurrentCache().missingFiles.forEach(f => {
   let span = document.createElement('span');
   span.textContent = f;
   if (!this.ui.app.sources.has(f)) span.textContent += '  X';
   else this.ui.dialogSession.getCurrentCache().filesFound++;
   this.dataSource.fileNames.append(span);
  });
 }
 
 _SourceRequestDialog.prototype.getSource = function() {
  let fileSelect = document.createElement('input');
  fileSelect.type = 'file';
  fileSelect.accept = '.mzML,.mzXML';
  this.ui.app.fileSelections.push(fileSelect);
  fileSelect.addEventListener('change', (e) => {
   if (fileSelect.files.length) {
    let f = fileSelect.files[0];
    if (f.name == '__NEW__') throw new Error('DisallowedFileName'); //Niche case check
    let d = new mslib.format.MzFile(f)
    this.ui.app.sources.set(f.name,d);
    d.fetchScanOffsets().then(() => {
     this.update();
    });
   }
  });
  fileSelect.click();
 }

 _SourceRequestDialog.prototype.open = function() {
  this.ui.dialogSession.getCurrentCache().missingFiles = [];
  let aS;
  this.ui.app.annotatedSpectra.forEach(aS => {
   if (!this.ui.app.sources.has(aS.sourceDetails.name)) this.ui.dialogSession.getCurrentCache().missingFiles.push(aS.sourceDetails.name);
  });
  if (this.ui.dialogSession.getCurrentCache().missingFiles.length) {
   this.update();
   ttrlib.UI.show(this.node);
  }
  else {
   this.ui.rejectDialog();
  }
 }

 _SourceRequestDialog.prototype.close = function() {
  ttrlib.UI.hide(this.node);
 }

 _SourceRequestDialog.prototype.validate = function() {
  return (this.ui.dialogSession.getCurrentCache().missingFiles.length >= this.ui.dialogSession.getCurrentCache().filesFound);
 }

 _SourceRequestDialog.prototype.accept = function() {
  this.ui.app.annotatedSpectra.forEach(aS => aS.setSpectralData(aS.sourceDetails))
  ttrlib.UI.hide(this.ui.view.welcomePanel);
  ttrlib.UI.show(this.ui.app.annotatedSpectra[this.ui.aSIndex].figure.node);
  ttrlib.UI.enable(this.ui.view.topbar.annotateButton);
  ttrlib.UI.enable(this.ui.view.topbar.exportButton);
 }

 return _SourceRequestDialog;
}();
