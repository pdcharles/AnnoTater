export let View = function() {

 let background = function() {
  let node = document.createElement('div');
  node.id = 'spc_ele_bg';

  let figSmall = document.createElement('div');
  figSmall.id = 'spc_ele_bg_figSmall';
  
  for (let i = 0; i < 3; i++) {
   let div = document.createElement('div');
   for (let j = 0; j < 10; j++) {
    let p =  document.createElement('p');
    p.textContent = spc.UI.components.common.loremIpsumText();
    div.append(p);
   }
   figSmall.append(div);
  }
  node.append(figSmall);

  return node;
 }

 let topbar = function() {
  let node = document.createElement('div');
  node.id = 'spc_ele_topbar';

  let left = document.createElement('div');
  let title = document.createElement('span');
  title.textContent = 'Spectacle';
  left.append(title);
  node.append(left);

  let middle = document.createElement('div');
  node.importButton = document.createElement('div');
  node.importButton.id = 'spc_ele_importButton';
  node.importButton.classList.add('spc_cls_topbarButton','spc_cls_dialogLaunchButton');
  middle.append(node.importButton);
  node.annotateButton = document.createElement('div');
  node.annotateButton.id = 'spc_ele_annotateButton';
  node.annotateButton.classList.add('spc_cls_topbarButton','spc_cls_dialogLaunchButton','disable');
  middle.append(node.annotateButton);
  node.exportButton = document.createElement('div');
  node.exportButton.id = 'spc_ele_exportButton';
  node.exportButton.classList.add('spc_cls_topbarButton','spc_cls_dialogLaunchButton','disable');
  middle.append(node.exportButton);
  node.append(middle);

  let right = document.createElement('div');
  let help = document.createElement('span');
  let helpLink = document.createElement('a');
  helpLink.textContent = 'Help';
  helpLink.href = '#';
  help.append(helpLink);
  right.append(help);
  let about = document.createElement('span');
  let aboutLink = document.createElement('a');
  aboutLink.textContent = 'About';
  aboutLink.href = '#';
  about.append(aboutLink);
  right.append(about);
  node.append(right);

  return node;
 }

 let spectra = function() {
  let node = document.createElement('div');
  node.id = 'spc_ele_spectra';
  return node;
 }

 let welcomePanel= function() {
  let node = document.createElement('div');
  node.id = 'spc_ele_welcomePanel';
  node.innerHTML = '<h1>Welcome to Spectacle!</h1><br /><br /><div>To get started:</div><br /><br /><div><i>[icon demo here]</i></div>'
  return node;
 }

 let dialogs = function() {
  let node = document.createElement('div');
  node.id = 'spc_ele_dialogs';
  return node;
 }

 let _View = function(ui) {
  this.ui = ui;
  this.background = background();
  this.topbar = topbar();
  this.spectra = spectra();
  this.welcomePanel = welcomePanel();
  this.dialogs = dialogs();
  this.ui.app.elementRoot.append(this.background,this.topbar,this.spectra,this.welcomePanel,this.dialogs);
 }

 return _View;
}();
