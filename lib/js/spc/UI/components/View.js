export let View = function() {

 let background = function() {
  let node = document.createElement('div');
  node.id = 'ttr_ele_bg';

  let figSmall = document.createElement('div');
  figSmall.id = 'ttr_ele_bg_figSmall';
  
  for (let i = 0; i < 3; i++) {
   let div = document.createElement('div');
   for (let j = 0; j < 10; j++) {
    let p =  document.createElement('p');
    p.textContent = ttrlib.UI.components.common.loremIpsumText();
    div.append(p);
   }
   figSmall.append(div);
  }
  node.append(figSmall);

  return node;
 }

 let topbar = function() {
  let node = document.createElement('div');
  node.id = 'ttr_ele_topbar';

  let left = document.createElement('div');
  let title = document.createElement('span');
  title.textContent = 'AnnoTater';
  left.append(title);
  let icon = document.createElement('div');
  icon.id = 'ttr_ele_logo';
  left.append(icon);
  node.append(left);

  let middle = document.createElement('div');
  node.importButton = document.createElement('div');
  node.importButton.id = 'ttr_ele_importButton';
  node.importButton.classList.add('ttr_cls_topbarButton','ttr_cls_dialogLaunchButton');
  middle.append(node.importButton);
  node.annotateButton = document.createElement('div');
  node.annotateButton.id = 'ttr_ele_annotateButton';
  node.annotateButton.classList.add('ttr_cls_topbarButton','ttr_cls_dialogLaunchButton','disable');
  middle.append(node.annotateButton);
  node.exportButton = document.createElement('div');
  node.exportButton.id = 'ttr_ele_exportButton';
  node.exportButton.classList.add('ttr_cls_topbarButton','disable');
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
  node.id = 'ttr_ele_spectra';
  return node;
 }

 let welcomePanel= function() {
  let node = document.createElement('div');
  node.id = 'ttr_ele_welcomePanel';
  let h1 = document.createElement('h1');
  h1.textContent = 'Welcome to AnnoTater!';
  node.append(h1);
  let img = document.createElement('img');
  img.src = 'lib/img/landing.jpg';
  node.append(img);
  return node;
 }

 let dialogs = function() {
  let node = document.createElement('div');
  node.id = 'ttr_ele_dialogs';
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
