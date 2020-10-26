export let SourceDialog = function() {

 let _SourceDialog = function(ui) {
  this.ui = ui;

  this.node = document.createElement('div');
  this.node.id = 'ttr_ele_sourceDialog';
  this.node.classList.add('ttr_cls_dialog','ttr_cls_dialog_fromTopBar');

  this.dataSource = document.createElement('div');
  this.dataSource.classList.add('ttr_cls_dialog_item');

  this.dataSource.chooser_label = document.createElement('label');
  this.dataSource.chooser_label.for = 'ttr_ele_sourceDialog_dataSource_chooser';
  this.dataSource.chooser_label.append(document.createTextNode('Data Source: '));
  this.dataSource.append(this.dataSource.chooser_label);

  this.dataSource.chooser = document.createElement('select');
  this.dataSource.chooser.id = 'ttr_ele_sourceDialog_dataSource_chooser';
  this.dataSource.append(this.dataSource.chooser);
  this.node.append(this.dataSource);

  this.mzFileDetails = document.createElement('div');
  this.mzFileDetails.classList.add('ttr_cls_dialog_item','hide');
  this.mzFileDetails.scanNumber_label = document.createElement('label');
  this.mzFileDetails.scanNumber_label.for = 'ttr_ele_sourceDialog_mzFileDetails_scanNumber';
  this.mzFileDetails.scanNumber_label.append(document.createTextNode('Scan Number (Range '));
  this.mzFileDetails.scanNumber_label.minSpan = document.createElement('span');
  this.mzFileDetails.scanNumber_label.append(this.mzFileDetails.scanNumber_label.minSpan);
  this.mzFileDetails.scanNumber_label.append(document.createTextNode(' to '));
  this.mzFileDetails.scanNumber_label.maxSpan = document.createElement('span');
  this.mzFileDetails.scanNumber_label.append(this.mzFileDetails.scanNumber_label.maxSpan);
  this.mzFileDetails.scanNumber_label.append(document.createTextNode(')'));
  this.mzFileDetails.append(this.mzFileDetails.scanNumber_label);
  this.mzFileDetails.scanNumber = document.createElement('input');
  this.mzFileDetails.scanNumber.id = 'ttr_ele_sourceDialog_mzFileDetails_scanNumber';
  this.mzFileDetails.scanNumber.type = 'number';
  this.mzFileDetails.append(this.mzFileDetails.scanNumber);
  this.node.append(this.mzFileDetails);

  this.node.append(ttrlib.UI.components.common.separator());

  //Definitions

  this.definitionsButton = document.createElement('div');
  this.definitionsButton.id = 'ttr_ele_definitionsButton';
  this.definitionsButton.classList.add('ttr_cls_dialog_button','ttr_cls_dialog_interstitialButton','ttr_cls_dialogLaunchButton');
  this.definitionsButton.textContent = 'Edit Definitions';
  this.node.append(this.definitionsButton);

  //Peptide Sequence

  this.peptideDetails = document.createElement('div');
  this.peptideDetails.classList.add('ttr_cls_dialog_item');

  this.peptideDetails.sequence_label = document.createElement('label');
  this.peptideDetails.sequence_label.for = 'ttr_ele_sourceDialog_peptideDetails_sequence';
  this.peptideDetails.sequence_label.append(document.createTextNode('Peptide Sequence:'));
  this.peptideDetails.append(this.peptideDetails.sequence_label);

  this.peptideDetails.sequence = document.createElement('input');
  this.peptideDetails.sequence.id = 'ttr_ele_sourceDialog_peptideDetails_sequence';
  this.peptideDetails.sequence.type = 'text';
  this.peptideDetails.sequence.classList.add('ttr_cls_sourceDialog_sequence');
  this.peptideDetails.append(this.peptideDetails.sequence);

  this.peptideDetails.charge_label = document.createElement('label');
  this.peptideDetails.charge_label.for = 'ttr_ele_sourceDialog_peptideDetails_charge';
  this.peptideDetails.charge_label.append(document.createTextNode('Charge:'));
  this.peptideDetails.append(this.peptideDetails.charge_label);

  this.peptideDetails.charge = document.createElement('select');
  this.peptideDetails.charge.id = 'ttr_ele_sourceDialog_peptideDetails_charge';
  let optGroup = document.createElement('optGroup');
  let optionInitialSelection = document.createElement('option');
  optionInitialSelection.value = '';
  optionInitialSelection.disabled = true;
  optionInitialSelection.textContent = 'Select charge ...';
  optionInitialSelection.selected = true;
  optGroup.append(optionInitialSelection);
  [1,2,3,4,5,6].forEach(charge => { 
   let option = document.createElement('option');
   option.value = charge;
   option.textContent = `${charge}+`;
   optGroup.append(option);
  });
  this.peptideDetails.charge.append(optGroup);
  this.peptideDetails.append(this.peptideDetails.charge);

  this.node.append(this.peptideDetails);

  //Modifications

  this.fixedModifications = document.createElement('div');
  this.fixedModifications.classList.add('ttr_cls_dialog_item');

  this.fixedModifications.label = document.createElement('label');
  this.fixedModifications.label.for = 'ttr_ele_sourceDialog_fixedModifications_table';
  this.fixedModifications.label.append(document.createTextNode('Fixed Modifications'));
  this.fixedModifications.append(this.fixedModifications.label);
  this.fixedModifications.append(document.createElement('br'));

  this.fixedModifications.table = new ttrlib.UI.components.OptionTable(
   [],
   ['text','text'],
   ['Residue','Modification']
  );
  this.fixedModifications.table.node.id = 'ttr_ele_sourceDialog_fixedModifications_table';
  this.fixedModifications.append(this.fixedModifications.table.node);

  this.node.append(this.fixedModifications);

  this.node.append(ttrlib.UI.components.common.separator());

  //Crosslink

  this.crosslinkDetails = document.createElement('div');
  this.crosslinkDetails.classList.add('ttr_cls_dialog_item');

  this.crosslinkDetails.include = document.createElement('input');
  this.crosslinkDetails.include.id = 'ttr_ele_sourceDialog_crosslinkDetails_include';
  this.crosslinkDetails.include.type = 'checkbox';
  this.crosslinkDetails.append(this.crosslinkDetails.include);

  this.crosslinkDetails.include_label = document.createElement('label');
  this.crosslinkDetails.include_label.for = 'ttr_ele_sourceDialog_crosslinkDetails_include';
  this.crosslinkDetails.include_label.append(document.createTextNode('Has Crosslink to Secondary Peptide'));
  this.crosslinkDetails.append(this.crosslinkDetails.include_label);

  this.crosslinkDetails.append(document.createElement('br'));

  this.crosslinkDetails.sequence_label = document.createElement('label');
  this.crosslinkDetails.sequence_label.for = 'ttr_ele_sourceDialog_crosslinkDetails_sequence';
  this.crosslinkDetails.sequence_label.append(document.createTextNode('Secondary Peptide Sequence:'));
  this.crosslinkDetails.append(this.crosslinkDetails.sequence_label);

  this.crosslinkDetails.sequence = document.createElement('input');
  this.crosslinkDetails.sequence.id = 'ttr_ele_sourceDialog_crosslinkDetails_sequence';
  this.crosslinkDetails.sequence.type = 'text';
  this.crosslinkDetails.sequence.classList.add('ttr_cls_sourceDialog_sequence');
  this.crosslinkDetails.append(this.crosslinkDetails.sequence);

  this.crosslinkDetails.append(document.createElement('br'));

  this.crosslinkDetails.linkType_label = document.createElement('label');
  this.crosslinkDetails.linkType_label.for = 'ttr_ele_sourceDialog_crosslinkDetails_linkType';
  this.crosslinkDetails.linkType_label.append(document.createTextNode('Link Type:'));
  this.crosslinkDetails.append(this.crosslinkDetails.linkType_label);

  this.crosslinkDetails.linkType = document.createElement('select');
  this.crosslinkDetails.linkType.id = 'ttr_ele_sourceDialog_crosslinkDetails_linkType';
  this.crosslinkDetails.append(this.crosslinkDetails.linkType);

  this.crosslinkDetails.append(document.createElement('br'));

  this.crosslinkDetails.positionA_label = document.createElement('label');
  this.crosslinkDetails.positionA_label.for = 'ttr_ele_sourceDialog_crosslinkDetails_positionA';
  this.crosslinkDetails.positionA_label.append(document.createTextNode('Crosslinked Positions - Primary Peptide:'));
  this.crosslinkDetails.append(this.crosslinkDetails.positionA_label);

  this.crosslinkDetails.positionA = document.createElement('input');
  this.crosslinkDetails.positionA.id = 'ttr_ele_sourceDialog_crosslinkDetails_positionA';
  this.crosslinkDetails.positionA.type = 'number';
  this.crosslinkDetails.positionA.classList.add('ttr_cls_sourceDialog_position');
  this.crosslinkDetails.append(this.crosslinkDetails.positionA);

  this.crosslinkDetails.positionB_label = document.createElement('label');
  this.crosslinkDetails.positionB_label.for = 'ttr_ele_sourceDialog_crosslinkDetails_positionB';
  this.crosslinkDetails.positionB_label.append(document.createTextNode('Secondary Peptide:'));
  this.crosslinkDetails.append(this.crosslinkDetails.positionB_label);

  this.crosslinkDetails.positionB = document.createElement('input');
  this.crosslinkDetails.positionB.id = 'ttr_ele_sourceDialog_crosslinkDetails_positionB';
  this.crosslinkDetails.positionB.type = 'number';
  this.crosslinkDetails.positionB.classList.add('ttr_cls_sourceDialog_position');
  this.crosslinkDetails.append(this.crosslinkDetails.positionB);

  this.node.append(this.crosslinkDetails);

  this.node.append(ttrlib.UI.components.common.separator());

  //Glycosylation

  this.glycosylationDetails = document.createElement('div');
  this.glycosylationDetails.classList.add('ttr_cls_dialog_item');

  this.glycosylationDetails.include = document.createElement('input');
  this.glycosylationDetails.include.id = 'ttr_ele_sourceDialog_glycosylationDetails_include';
  this.glycosylationDetails.include.type = 'checkbox';
  this.glycosylationDetails.append(this.glycosylationDetails.include);

  this.glycosylationDetails.include_label = document.createElement('label');
  this.glycosylationDetails.include_label.for = 'ttr_ele_sourceDialog_glycosylationDetails_include';
  this.glycosylationDetails.include_label.append(document.createTextNode('Has Glycosylation'));
  this.glycosylationDetails.append(this.glycosylationDetails.include_label);

  this.glycosylationDetails.append(document.createElement('br'));

  this.glycosylationDetails.sequence_label = document.createElement('label');
  this.glycosylationDetails.sequence_label.for = 'ttr_ele_sourceDialog_glycosylationDetails_sequence';
  this.glycosylationDetails.sequence_label.append(document.createTextNode('Glycosylation Sequence:'));
  this.glycosylationDetails.append(this.glycosylationDetails.sequence_label);

  this.glycosylationDetails.sequence = document.createElement('input');
  this.glycosylationDetails.sequence.id = 'ttr_ele_sourceDialog_glycosylationDetails_sequence';
  this.glycosylationDetails.sequence.type = 'text';
  this.glycosylationDetails.sequence.classList.add('ttr_cls_sourceDialog_sequence');
  this.glycosylationDetails.append(this.glycosylationDetails.sequence);

  this.glycosylationDetails.position_label = document.createElement('label');
  this.glycosylationDetails.position_label.for = 'ttr_ele_sourceDialog_glycosylationDetails_position';
  this.glycosylationDetails.position_label.append(document.createTextNode('Position:'));
  this.glycosylationDetails.append(this.glycosylationDetails.position_label);

  this.glycosylationDetails.position = document.createElement('input');
  this.glycosylationDetails.position.id = 'ttr_ele_sourceDialog_glycosylationDetails_position';
  this.glycosylationDetails.position.type = 'number';
  this.glycosylationDetails.position.classList.add('ttr_cls_sourceDialog_position');
  this.glycosylationDetails.append(this.glycosylationDetails.position);

  this.node.append(this.glycosylationDetails);

  //Reject and Accept

  [this.node.reject,this.node.accept] = ttrlib.UI.components.common.rejectAccept();
  this.node.append(this.node.reject,this.node.accept);
  
  this.ui.view.dialogs.append(this.node);
 }

 _SourceDialog.prototype.update = function() {
  updateSourceSelect.call(this);
  updateSourceDetails.call(this);
  updateFixedModifications.call(this);
  updateCrosslinkType.call(this);
 }

 let updateSourceSelect = function() {
  let aS = this.ui.app.annotatedSpectra[this.ui.aSIndex];
  if (!('sourceDetails_name' in this.ui.dialogSession.getCurrentCache()) && aS.sourceDetails.name) {
   this.ui.dialogSession.getCurrentCache().sourceDetails_name = aS.sourceDetails.name;
  }

  ttrlib.UI.removeChildren(this.dataSource.chooser);
  let optGroup = document.createElement('optGroup');

  let optionInitialSelection = document.createElement('option');
  optionInitialSelection.value = '';
  optionInitialSelection.disabled = true;
  optionInitialSelection.textContent = 'Select data source...';
  if (!('name' in this.ui.dialogSession.getCurrentCache())) {
   optionInitialSelection.selected = true;
  }
  optGroup.append(optionInitialSelection);

  let optionSelectNewFiles = document.createElement('option');
  optionSelectNewFiles.value = '__NEW__';
  optionSelectNewFiles.textContent = 'Select new files';
  optGroup.append(optionSelectNewFiles);

  this.ui.app.sources.forEach((undefined,fileName) => { 
   let option = document.createElement('option');
   option.value = fileName;
   option.textContent = fileName;
   if (('sourceDetails_name' in this.ui.dialogSession.getCurrentCache()) && this.ui.dialogSession.getCurrentCache().sourceDetails_name == fileName) {
    option.selected = true;
   }
   optGroup.append(option);
  });

  this.dataSource.chooser.append(optGroup);
 }

 let updateSourceDetails = function() {
  let aS = this.ui.app.annotatedSpectra[this.ui.aSIndex];
  if ('sourceDetails_name' in this.ui.dialogSession.getCurrentCache()) {
   let source = this.ui.app.sources.get(this.ui.dialogSession.getCurrentCache().sourceDetails_name);
   if (source.fileType == 'mzML' || source.fileType == 'mzXML') {
    if (this.ui.dialogSession.getCurrentCache().sourceDetails_name == aS.sourceDetails.name) {
     this.mzFileDetails.scanNumber.value = aS.sourceDetails.scanNumber;
    }
    // else this.mzFileDetails.scanNumber.value = 1;
    this.mzFileDetails.scanNumber_label.minSpan.textContent = 
     this.mzFileDetails.scanNumber.min = source.getFirstScanNumber();
    this.mzFileDetails.scanNumber_label.maxSpan.textContent = 
     this.mzFileDetails.scanNumber.max = source.getLastScanNumber();
    ttrlib.UI.show(this.mzFileDetails);
   }
   else console.log('Warning: Filetype Unknown');
  }
 }

 let updateFixedModifications = function() {
  this.fixedModifications.table.setData(this.fixedModifications.table.data,
   [Object.values(this.ui.app.definitions.aminoacids).map(v => v.token),
    Object.entries(this.ui.app.definitions.modifications).map(([key,value]) => [key,value.caption])]
  );
 }

 let updateCrosslinkType = function() {
  let selectedClType = this.crosslinkDetails.linkType.value;
  ttrlib.UI.removeChildren(this.crosslinkDetails.linkType);

  let optGroup = document.createElement('optGroup');

  let optionInitialSelection = document.createElement('option');
  optionInitialSelection.value = '';
  optionInitialSelection.disabled = true;
  optionInitialSelection.textContent = 'Select crosslink type...';
  if (!selectedClType) {
   optionInitialSelection.selected = true;
  }
  optGroup.append(optionInitialSelection);

  Object.keys(this.ui.app.definitions.crosslinkTypes).forEach(clType => { 
   let option = document.createElement('option');
   option.value = clType;
   option.textContent = clType;
   if (selectedClType && selectedClType == clType) {
    option.selected = true;
   }
   optGroup.append(option);
  });

  this.crosslinkDetails.linkType.append(optGroup);
 }
 
 _SourceDialog.prototype.setSelectedSource = function() {
  if (this.dataSource.chooser.value == '__NEW__') {
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
      this.ui.dialogSession.getCurrentCache().sourceDetails_name = f.name;
      this.update();
     })
     // ttrlib.UI.removeChildren(this.dataSource.chooser);
     // let loading = document.createElement('option');
     // loading.value = '';
     // loading.textContent = 'Loading...';
     // loading.selected = true;
     // this.dataSource.chooser.append(loading);
     // let progressUpdateInterval = window.setInterval(() => {
     //  this.dataSource.chooser.style.background = `linear-gradient(90deg, var(--progress) ${d.progress}%, white 0%, white ${100-d.progress}%)`;
     //  console.log(`progress ${d.progress}`);
     //  if (d.ready) {
     //   this.dataSource.chooser.style.background = '';
     //   self.clearInterval(progressUpdateInterval);
     //   console.log('file loaded');
     //  }
     // },1000);
    }
   });
   fileSelect.click();
  }
  else {
   this.ui.dialogSession.getCurrentCache().sourceDetails_name = this.dataSource.chooser.value;
   this.update();
  }
 }

 _SourceDialog.prototype.open = function() {
  this.update();

  //Shortcut!
  this.mzFileDetails.scanNumber.value = 7049;
  this.peptideDetails.sequence.value = 'CEHADLLAGSYD';
  this.peptideDetails.charge.value = '3';
  this.fixedModifications.table.data = [['C','CARBAMIDOMETHYLATION']];
  this.fixedModifications.table.update();
  this.crosslinkDetails.include.checked = true;
  this.crosslinkDetails.sequence.value = 'TKIISNR';
  this.crosslinkDetails.linkType.value = 'Amide Bond';
  this.crosslinkDetails.positionA.value = 12;
  this.crosslinkDetails.positionB.value = 2;

  // this.mzFileDetails.scanNumber.value = 15253;
  // this.peptideDetails.sequence.value = 'TLAATGTGFDCASKTEIQLVQSLGVPPER';
  // this.peptideDetails.charge.value = '4';
  // this.fixedModifications.table.data = [['C','Carbamidomethylation']];
  // this.fixedModifications.table.update();
  // this.crosslinkDetails.include.checked = true;
  // this.crosslinkDetails.sequence.value = 'RPDACFMAYTFEGSYD';
  // this.crosslinkDetails.linkType.value = 'NeissLock';
  // this.crosslinkDetails.positionA.value = 14;
  // this.crosslinkDetails.positionB.value = 16;

  // this.mzFileDetails.scanNumber.value = 11093;
  // this.peptideDetails.sequence.value = 'QVSQIKYAANNGVQM(ox)M(ox)TFDSEVELM(ox)K';
  // this.peptideDetails.charge.value = '4';
  // this.fixedModifications.table.data = [['C','Carbamidomethylation']];
  // this.fixedModifications.table.update();
  // this.crosslinkDetails.include.checked = true;
  // this.crosslinkDetails.sequence.value = 'RPDACFM(ox)AYTFEYD';
  // this.crosslinkDetails.linkType.value = 'NeissLock';
  // this.crosslinkDetails.positionA.value = 6;
  // this.crosslinkDetails.positionB.value = 14;

  // this.mzFileDetails.scanNumber.value = 13027;
  // this.peptideDetails.sequence.value = 'TLAATGTGFDCASKTEIQLVQSLGVPPER';
  // this.peptideDetails.charge.value = '4';
  // this.fixedModifications.table.data = [['C','Carbamidomethylation']];
  // this.fixedModifications.table.update();
  // this.crosslinkDetails.include.checked = true;
  // this.crosslinkDetails.sequence.value = 'RPDACFM(ox)AYTFEYD';
  // this.crosslinkDetails.linkType.value = 'NeissLock';
  // this.crosslinkDetails.positionA.value = 14;
  // this.crosslinkDetails.positionB.value = 14;

  // this.mzFileDetails.scanNumber.value = 5825;
  // this.peptideDetails.sequence.value = 'HAVSEGTKAVTK';
  // this.peptideDetails.charge.value = '2';
  // this.fixedModifications.table.data = [['C','Carbamidomethylation']];
  // this.fixedModifications.table.update();
  // this.crosslinkDetails.include.checked = true;
  // this.crosslinkDetails.sequence.value = 'GG';
  // this.crosslinkDetails.linkType.value = 'NeissLock';
  // this.crosslinkDetails.positionA.value = 8;
  // this.crosslinkDetails.positionB.value = 2;

  // this.mzFileDetails.scanNumber.value = 23449;
  // this.peptideDetails.sequence.value = 'GADFLVTEVENGGSLGSKK';
  // this.peptideDetails.charge.value = '3';
  // this.fixedModifications.table.data = [['C','Carbamidomethylation']];
  // this.fixedModifications.table.update();
  // this.crosslinkDetails.include.checked = true;
  // this.crosslinkDetails.sequence.value = 'GG';
  // this.crosslinkDetails.linkType.value = 'NeissLock';
  // this.crosslinkDetails.positionA.value = 18;
  // this.crosslinkDetails.positionB.value = 2;

  // this.mzFileDetails.scanNumber.value = 12023;
  // this.peptideDetails.sequence.value = 'LSNLALVKPEKTK';
  // this.peptideDetails.charge.value = '3';
  // this.fixedModifications.table.data = [['C','Carbamidomethylation']];
  // this.fixedModifications.table.update();
  // this.crosslinkDetails.include.checked = true;
  // this.crosslinkDetails.sequence.value = 'GG';
  // this.crosslinkDetails.linkType.value = 'NeissLock';
  // this.crosslinkDetails.positionA.value = 8; //11,13
  // this.crosslinkDetails.positionB.value = 2;

  ttrlib.UI.show(this.node);
 }

 _SourceDialog.prototype.close = function() {
  ttrlib.UI.hide(this.node);
 }

 _SourceDialog.prototype.validate = function() {
  return true;
 }

 _SourceDialog.prototype.accept = function() {
  let aS = this.ui.app.annotatedSpectra[this.ui.aSIndex];
  if (this.dataSource.chooser.value.length) {
   let sourceName = this.dataSource.chooser.value;
   let source = this.ui.app.sources.get(sourceName);
   if (source.fileType == 'mzML' || source.fileType == 'mzXML') {
    aS.setSpectralData(
     { name: sourceName, scanNumber : this.mzFileDetails.scanNumber.value }
    );
   }
   let peptideData = { charge : this.peptideDetails.charge.value, chains : [], branches : {} };

   let fixedModObj = this.fixedModifications.table.data.reduce((a,e) => { a[e[0]] = e[1]; return a },{});

   peptideData.chains.push(
    new mslib.data.AminoAcidChain({
     sequenceString : this.peptideDetails.sequence.value,
     residueDefinitions : {},
     modificationDefinitions : this.ui.app.definitions.modifications,
     fixedModifications : fixedModObj,
     variableModifications : {}
    })
   );

   if (this.crosslinkDetails.include.checked) {
    peptideData.chains.push(
     new mslib.data.AminoAcidChain({
      sequenceString : this.crosslinkDetails.sequence.value,
      residueDefinitions : {},
      modificationDefinitions : this.ui.app.definitions.modifications,
      fixedModifications : fixedModObj,
      variableModifications : {}
     })
    );
    let branchNetAdjust;
    if (this.crosslinkDetails.linkType.value) {
     branchNetAdjust = this.ui.app.definitions.crosslinkTypes[this.crosslinkDetails.linkType.value];
    }
    peptideData.branches[peptideData.chains.length-1] = { [this.crosslinkDetails.positionB.value-1] : [0,this.crosslinkDetails.positionA.value-1,branchNetAdjust] };
   }

   // if (this.glycosylationDetails.include.checked) {
   //  peptideData.chains.push(
   //   new mslib.data.MonosaccharideChain({
   //    sequenceString : this.glycosylationDetails.sequence.value
   //   })
   //  );
   //  peptideData.branches[peptideData.chains.length-1] = { [this.glycosylationDetails.positionB.value-1] : [0,this.glycosylationDetails.positionA.value-1] };
   // }

   // console.log('chains length is ' + peptideData.chains.length);
   // console.log('branches length is ' + ('branches' in peptideData ? Object.keys(peptideData.branches).length : 0 ));

   aS.setPeptide(new mslib.data.Peptide(peptideData));
  }
  ttrlib.UI.hide(this.ui.view.welcomePanel);
  ttrlib.UI.show(this.ui.app.annotatedSpectra[this.ui.aSIndex].figure.node);
  ttrlib.UI.enable(this.ui.view.topbar.annotateButton);
  ttrlib.UI.enable(this.ui.view.topbar.exportButton);
 }

 return _SourceDialog;
}();
