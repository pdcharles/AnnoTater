export let AsFigure = function() {

 const FIGUREHEIGHT = 1000;

 const SVG = function() {
  const SVGNS = 'http://www.w3.org/2000/svg';
  let setAttributes = function(attributes) {
   Object.entries(attributes).forEach(([k,v]) => this.setAttribute(k,v),this);
  }
  let createElement = function(element,attributes) {
   let ele = document.createElementNS(SVGNS, element);
   ele.setAttributes = setAttributes;
   if (attributes) ele.setAttributes(attributes);
   return ele;
  }
  let createText = function(text,attributes) {
   let ele = createElement('text',attributes);
   if (ele.getAttribute('transform')) {
    ele.setAttribute('transform',ele.getAttribute('transform')+' scale(1,-1)');
   }
   else {
    ele.setAttribute('transform','scale(1,-1)');
   }
   ele.setAttribute('y',-ele.getAttribute('y'));
   ele.textContent = text;
   return ele;
  }
  return {
   setAttributes : setAttributes,
   createElement : createElement,
   createText : createText
  }
 }();
//
// const Header = function () {
//  let _Header  = function(this) {
//   let svgEle = SVG.createElement('g',{ class : 'spc_cls_spectrum_graphic_peptide' });
//   svgEle.setNonSequenceText = setNonSequenceText;
//   svgEle.setSequence = setSequence;
//   svgEle.append(SVG.createElement('rect',{
//    x : 0,
//    y : 0,
//    width : 550,
//    height : 50,
//    fill : 'white',
//    class : 'spc_cls_spectrum_graphic_noexport'
//   }));
//   svgEle.sequence = SVG.createElement('text',{
//    x : 275,
//    y : 30,
//    'text-anchor' : 'middle',
//    'font-size' : 20,
//    'font-family' : fontFamily
//   });
//   svgEle.append(svgEle.sequence);
//   return svgEle;
//  }
//
//  let setNonSequenceText = function(string) {
//   spc.UI.removeChildren(this.sequence);
//   let tspan = SVG.createElement('tspan',{ 
//    class : 'spc_cls_spectrum_graphic_noexport',
//    fill : 'grey',
//   })
//   tspan.textContent = string;
//   this.sequence.append(tspan);
//  }
//
//  let setSequence = function(peptide,annotations) {
//   spc.UI.removeChildren(this.sequence);
//   peptide.residues.forEach((residue,i) => {
//    if (i==0) {}
//    let residueSpan = SVG.createElement('tspan');
//    residueSpan.append(document.createTextNode(residue.symbol));
//    this.sequence.append(residueSpan)
//    if (annotations) {
//     //TODO
//    }
//    if (i==(peptide.residues.length-1)) {}
//   });
//  }
//  return _Header;
// }();

 let _AsFigure = function(annotatedSpectrum) {
  this.as = annotatedSpectrum;

  this.node = document.createElement('div')
  this.node.classList.add('spc_cls_spectrum','hide');

  this.node.spectrumSidebar = document.createElement('div');
  this.node.spectrumSidebar.classList.add('spc_cls_spectrum_sidebar');
  this.node.append(this.node.spectrumSidebar);

  this.node.spectrumGraphic = document.createElement('div');
  this.node.spectrumGraphic.classList.add('spc_cls_spectrum_graphic');
  this.node.append(this.node.spectrumGraphic);

  this.as.app.ui.view.spectra.append(this.node);
  this.update();
 }

 _AsFigure.prototype.update = function() {
  this.graphic = SVG.createElement('svg', { viewBox : '0 0 '+FIGUREHEIGHT*spc.constants.GOLDENRATIO+' '+FIGUREHEIGHT, preserveAspectRatio : 'xMidYMid' });
  if (this.node.spectrumGraphic.hasChildNodes()) {
   this.node.spectrumGraphic.replaceChild(this.graphic,this.node.spectrumGraphic.childNodes[0]);
  }
  else {
   this.node.spectrumGraphic.append(this.graphic);
  }
  this.graphic.root = SVG.createElement('g',{ transform : 'scale(1,-1) translate(0,-1000)' });
  this.graphic.append(this.graphic.root);

  let axisLeftWidth = this.graphic.viewBox.baseVal.width*this.as.displayParams.axisLeftWidth/100;
  let axisBottomHeight = this.graphic.viewBox.baseVal.height*this.as.displayParams.axisBottomHeight/100;
  let headerHeight = this.graphic.viewBox.baseVal.height*this.as.displayParams.headerHeight/100;

  let oX = 0 + axisLeftWidth;
  let oY = 0 + axisBottomHeight;
  let pWidth = this.graphic.viewBox.baseVal.width - axisLeftWidth;
  let pHeight = this.graphic.viewBox.baseVal.height - axisBottomHeight - headerHeight;

  this.graphic.plotArea = SVG.createElement('g',{ id : 'plotArea' });
  this.graphic.root.append(this.graphic.plotArea);

  this.graphic.axes = SVG.createElement('g',{ id : 'axes' });
  this.graphic.root.append(this.graphic.axes);

  this.graphic.axes.append(SVG.createElement('line',{
   x1 : oX,
   y1 : oY,
   x2 : pWidth,
   y2 : oY,
   stroke : this.as.displayParams.axisColour,
   'stroke-width' : this.as.displayParams.axisStrokeWidth
  }));
  this.graphic.axes.append(SVG.createElement('line',{
   x1 : oX,
   y1 : oY,
   x2 : oX,
   y2 : pHeight,
   stroke : this.as.displayParams.axisColour,
   'stroke-width' : this.as.displayParams.axisStrokeWidth
  }));

  this.graphic.header = SVG.createElement('g',{ id : 'header' });
  this.graphic.root.append(this.graphic.header);

  if (this.as.peptide) {
   this.graphic.header.append(SVG.createElement('PEPTIDE',{
    x : pWidth/2,
    y : pHeight + headerHeight/2,
    stroke : this.as.displayParams.axisColour,
    'stroke-width' : this.as.displayParams.axisStrokeWidth
   }));
  }

  return;
  
  this.peaks = {};

  //ions
  if ('ions' in this.as) {
   let mzMin = this.as.displayParams.mzRange.min;
   let mzMax = this.as.displayParams.mzRange.max;
   let mzSpan = mzMax - mzMin;
   let intMin = this.as.displayParams.intRange.min;
   let intMax = this.as.displayParams.intRange.max;

   let annotatedElements = [];

   Object.entries(this.as.ions).forEach(([mz,ion]) => {
    this.peaks[mz] = {};

    this.peaks[mz].peak = SVG.createElement('line',{
     x1 : oX + ( (+mz-mzMin) / mzSpan ) * pWidth,
     y1 : oY,
     x2 : oX + ( (+mz-mzMin) / mzSpan ) * pWidth,
     y2 : oY + (ion.intensity/intMax) * pHeight,
     stroke : this.as.displayParams.peakColour,
     'stroke-width' : this.as.displayParams.peakStrokeWidth
    });
    this.peaks[mz].label = SVG.createText('a',{
     x : oX + ( (+mz-mzMin) / mzSpan ) * pWidth,
     y : oY + (ion.intensity/intMax) * pHeight + this.as.displayParams.labelOffset*pHeight,
     'text-anchor' : 'middle',
     'font-family': this.as.displayParams.fontFamily,
     'font-size': this.as.displayParams.labelFontSize
    });

    if ((ion.label !== null)) {
     annotatedElements.push(this.peaks[mz].peak);
     if (ion.showLabel) {
      if (ion.label.match(/^y\d/)) this.peaks[mz].peak.setAttribute('fill','red');
      else if (ion.label.match(/^b\d/)) this.peaks[mz].peak.setAttribute('fill','blue');
      else this.peaks[mz].peak.setAttribute('fill','green');
      this.peaks[mz].textContent = ion.label;
      annotatedElements.push(this.peaks[mz].label);
     }
    }
    else {
     this.graphic.plotArea.append(this.peaks[mz].peak);
     this.graphic.plotArea.append(this.peaks[mz].label);
    }

   });
   annotatedElements.forEach(ele => this.graphic.plotArea.append(ele));
  }

 // this.graphic.header.setSequence(peptide);

//  Array.from(this.node.querySelectorAll('[class]')).forEach(ele => {
//   spc.UI.assignHandles(this.as,ele);
//  });


 }

// _AnnotatedSpectrum.getTestPeptide = function(key) {
//  return {
//   CharlieFehlPhenyethylation : {
//    sequence : 'ARTKQTARxCSTGGKAPR',
//    residueDefinitions : {
//     'xC' : mslib.moietyMath.add(mslib.constants.RESIDUES.CYSTEINE,
//                                     { atoms : {
//                                        CARBON : 8,
//                                        HYDROGEN : 10,
//                                        SULPHUR : -1,
//                                     } },'xC')
//    },
//    scan : 3787
//   }
//  }[key];
// }
 
 return _AsFigure;
}();
