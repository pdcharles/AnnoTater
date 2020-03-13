export let SourceDialog = function() {

 let _SourceDialog= function(ui) {
  this.ui = ui;

  this.node = document.createElement('div');
  this.node.id = 'spc_ele_sourceDialog';
  this.node.classList.add('spc_cls_dialog','spc_cls_dialog_fromTopBar');

  this.sourceSelect = document.createElement('select');
  this.sourceSelect.id = 'spc_ele_sourceDialog_select';
  this.sourceSelect.classList.add('spc_cls_dialog_item');
  this.node.append(this.sourceSelect);

  this.scanNumber = document.createElement('div');
  this.scanNumber.classList.add('spc_cls_dialog_item','hide');
  this.scanNumber.label = document.createElement('label');
  this.scanNumber.label.for = 'spc_ele_sourceDialog_rawFile_scanNumber_number';
  this.scanNumber.label.append(document.createTextNode('Scan Number (Range '));
  this.scanNumber.label.minSpan = document.createElement('span');
  this.scanNumber.label.append(this.scanNumber.label.minSpan);
  this.scanNumber.label.append(document.createTextNode(' to '));
  this.scanNumber.label.maxSpan = document.createElement('span');
  this.scanNumber.label.append(this.scanNumber.label.maxSpan);
  this.scanNumber.label.append(document.createTextNode(')'));
  this.scanNumber.append(this.scanNumber.label);
  this.scanNumber.number = document.createElement('input');
  this.scanNumber.number.id = 'spc_ele_sourceDialog_rawFile_scanNumber_number';
  this.scanNumber.number.type = 'number';
  this.scanNumber.append(this.scanNumber.number);
  this.node.append(this.scanNumber);

  let sep = document.createElement('div');
  sep.classList.add('spc_cls_dialog_divider');
  this.node.append(sep);

  //Definitions

  this.definitionsButton = document.createElement('div');
  this.definitionsButton.id = 'spc_ele_definitionsButton';
  this.definitionsButton.classList.add('spc_cls_dialog_button','spc_cls_dialog_interstitialButton','spc_cls_dialogLaunchButton');
  this.definitionsButton.textContent = 'Edit Definitions';
  this.node.append(this.definitionsButton);

  //Peptide Sequence

  this.peptide = document.createElement('div');
  this.peptide.classList.add('spc_cls_dialog_item');

  this.peptide.label = document.createElement('label');
  this.peptide.label.for = 'spc_ele_sourceDialog_peptide_sequence';
  this.peptide.label.append(document.createTextNode('Peptide Sequence'));
  this.peptide.append(this.peptide.label);

  this.peptide.sequence = document.createElement('input');
  this.peptide.sequence.id = 'spc_ele_sourceDialog_peptide_sequence';
  this.peptide.sequence.type = 'text';
  this.peptide.append(this.peptide.sequence);

  this.node.append(this.peptide);

  //Modifications

  this.modifications = document.createElement('div');
  this.modifications.classList.add('spc_cls_dialog_item');

  this.modifications.label = document.createElement('label');
  this.modifications.label.for = 'spc_ele_sourceDialog_modificationsTable';
  this.modifications.label.append(document.createTextNode('Modifications'));
  this.modifications.append(this.modifications.label);
  this.modifications.append(document.createElement('br'));

  this.modifications.table = new spc.UI.components.OptionTable(
   this.ui.app.modificationObjToArr(this.ui.app.definitions.modifications),
   ['text','text','text'],
   ['Name','Token','Composition']
  );
  this.modifications.append(this.modifications.table.node);

  this.node.append(this.modifications);

  //Crosslink

  this.crosslink = document.createElement('div');
  this.crosslink.classList.add('spc_cls_dialog_item');

  this.crosslink.check = document.createElement('input');
  this.crosslink.check.id = 'spc_ele_sourceDialog_crosslink_check';
  this.crosslink.check.type = 'checkbox';
  this.crosslink.append(this.crosslink.check);

  this.crosslink.label = document.createElement('label');
  this.crosslink.label.for = 'spc_ele_sourceDialog_crosslink_sequence';
  this.crosslink.label.append(document.createTextNode('Crosslinked Peptide: Sequence'));
  this.crosslink.append(this.crosslink.label);

  this.crosslink.sequence = document.createElement('input');
  this.crosslink.sequence.id = 'spc_ele_sourceDialog_crosslink_sequence';
  this.crosslink.sequence.type = 'text';
  this.crosslink.append(this.crosslink.sequence);

  this.crosslink.label = document.createElement('label');
  this.crosslink.label.for = 'spc_ele_sourceDialog_crosslink_position';
  this.crosslink.label.append(document.createTextNode('Position'));
  this.crosslink.append(this.crosslink.label);

  this.crosslink.position = document.createElement('input');
  this.crosslink.position.id = 'spc_ele_sourceDialog_crosslink_position';
  this.crosslink.position.type = 'number';
  this.crosslink.position.classList.add('spc_cls_sourceDialog_position');
  this.crosslink.append(this.crosslink.position);

  this.node.append(this.crosslink);

  //Glycosylation

  this.glycosylation = document.createElement('div');
  this.glycosylation.classList.add('spc_cls_dialog_item');

  this.glycosylation.check = document.createElement('input');
  this.glycosylation.check.id = 'spc_ele_sourceDialog_glycosylation_check';
  this.glycosylation.check.type = 'checkbox';
  this.glycosylation.append(this.glycosylation.check);

  this.glycosylation.label = document.createElement('label');
  this.glycosylation.label.for = 'spc_ele_sourceDialog_glycosylation_sequence';
  this.glycosylation.label.append(document.createTextNode('Glycosylation: Sequence'));
  this.glycosylation.append(this.glycosylation.label);

  this.glycosylation.sequence = document.createElement('input');
  this.glycosylation.sequence.id = 'spc_ele_sourceDialog_glycosylation_sequence';
  this.glycosylation.sequence.type = 'text';
  this.glycosylation.append(this.glycosylation.sequence);

  this.glycosylation.label = document.createElement('label');
  this.glycosylation.label.for = 'spc_ele_sourceDialog_glycosylation_position';
  this.glycosylation.label.append(document.createTextNode('Position'));
  this.glycosylation.append(this.glycosylation.label);

  this.glycosylation.position = document.createElement('input');
  this.glycosylation.position.id = 'spc_ele_sourceDialog_glycosylation_position';
  this.glycosylation.position.type = 'number';
  this.glycosylation.position.classList.add('spc_cls_sourceDialog_position');
  this.glycosylation.append(this.glycosylation.position);

  this.node.append(this.glycosylation);

  //Reject and Accept

  [this.node.reject,this.node.accept] = spc.UI.components.common.rejectAccept();
  this.node.append(this.node.reject,this.node.accept);
  
  this.ui.view.dialogs.append(this.node);
 }

 _SourceDialog.prototype.update = function() {
  let aS = this.ui.app.annotatedSpectra[this.ui.aSIndex];
  if (!('name' in this.ui.dialogSession.getCurrentCache()) && aS.sourceDetails.name) {
   this.ui.dialogSession.getCurrentCache().name = aS.sourceDetails.name;
  }
  spc.UI.removeChildren(this.sourceSelect);

  let optGroup = document.createElement('optGroup');

  let optionInitialSelection = document.createElement('option');
  optionInitialSelection.setAttribute('value', '');
  optionInitialSelection.setAttribute('disabled', true);
  optionInitialSelection.textContent = 'Select data source...';
  if (!('name' in this.ui.dialogSession.getCurrentCache())) {
   optionInitialSelection.selected = true;
  }
  optGroup.append(optionInitialSelection);

  let optionSelectNewFiles = document.createElement('option');
  optionSelectNewFiles.setAttribute('value','!NEW');
  optionSelectNewFiles.textContent = 'Select new files';
  optGroup.append(optionSelectNewFiles);

  this.ui.app.sources.forEach((undefined,fileName) => { 
   let option = document.createElement('option');
   option.setAttribute('value', fileName);
   console.log(this.ui.dialogSession.getCurrentCache().name == fileName);
   if (('name' in this.ui.dialogSession.getCurrentCache()) && this.ui.dialogSession.getCurrentCache().name == fileName) {
    option.selected = true;
   }
   option.textContent = fileName;
   optGroup.append(option);
  });

  this.sourceSelect.append(optGroup);

  if ('name' in this.ui.dialogSession.getCurrentCache()) {
   let source = this.ui.app.sources.get(this.ui.dialogSession.getCurrentCache().name);
   if (source.fileType == 'mzML' || source.fileType == 'mzXML') {
    if (this.ui.dialogSession.getCurrentCache().name == aS.sourceDetails.name) {
     this.scanNumber.input.value = aS.sourceDetails.scanNumber;
    }
    else this.scanNumber.number.value = 1;
    this.scanNumber.number.min = source.getFirstScanNumber();
    this.scanNumber.label.minSpan.textContent = source.getFirstScanNumber();
    this.scanNumber.number.max = source.getFirstScanNumber();
    this.scanNumber.label.maxSpan.textContent = source.getLastScanNumber();
    spc.UI.show(this.scanNumber);
   }
   else console.log('?');
  }
 }

 _SourceDialog.prototype.setSelectedSource = function() {
  if (this.sourceSelect.value == '!NEW') {
   let fileSelect = document.createElement('input');
   fileSelect.type = 'file';
   fileSelect.accept = '.mzML,.mzXML';
   this.ui.app.fileSelections.push(fileSelect);
   fileSelect.addEventListener('change', (e) => {
    if (fileSelect.files.length) {
     let f = fileSelect.files[0];
     let d = new mslib.format.MzFile(f)
     this.ui.app.sources.set(f.name,d);
     d.fetchAllScanHeaders().then(() => {
      this.ui.dialogSession.getCurrentCache().name = f.name;
      this.update();
     })
     spc.UI.removeChildren(this.sourceSelect);
     let loading = document.createElement('option');
     loading.setAttribute('value', '');
     loading.textContent = 'Loading...';
     loading.selected = true;
     this.sourceSelect.append(loading);
     let progressUpdateInterval = window.setInterval(() => {
      this.sourceSelect.style.background = `linear-gradient(90deg, var(--progress) ${d.progress}%, white 0%, white ${100-d.progress}%)`;
      console.log(`progress ${d.progress}`);
      if (d.ready) {
       this.sourceSelect.style.background = '';
       self.clearInterval(progressUpdateInterval);
       console.log('file loaded');
      }
     },1000);
    }
   });
   fileSelect.click();
  }
  else {
   this.ui.dialogSession.getCurrentCache().name = this.sourceSelect.value;
   this.update();
  }
 }

 _SourceDialog.prototype.open = function() {
  this.update();
  spc.UI.show(this.node);
 }

 _SourceDialog.prototype.close = function() {
  spc.UI.hide(this.node);
 }

 _SourceDialog.prototype.validate = function() {
  return true;
 }

 _SourceDialog.prototype.accept = function() {
  let aS = this.ui.app.annotatedSpectra[this.ui.aSIndex];
  if (this.sourceSelect.value.length) {
   aS.setSpectralData(
    { name: this.sourceSelect.value, scanNumber : this.scanNumber.input.value }
   );
  }
  spc.UI.hide(this.ui.view.welcomePanel);
  spc.UI.show(this.ui.app.annotatedSpectra[this.ui.aSIndex].figure.node);
  spc.UI.enable(this.ui.view.topbar.annotateButton);
  spc.UI.enable(this.ui.view.topbar.exportButton);
 }

 return _SourceDialog;
}();
