export let AsFigure = function() {

 const FIGUREHEIGHT = 1000;

 const SVG = function() {
  const SVGNS = 'http://www.w3.org/2000/svg';
  let setAttributes = function(attributes) {
   Object.entries(attributes).forEach(([k,v]) => this.setAttribute(k,v));
  }
  let createElement = function(element,attributes) {
   let ele = document.createElementNS(SVGNS, element);
   ele.setAttributes = setAttributes;
   if (attributes) ele.setAttributes(attributes);
   return ele;
  }
  let createText = function(text,attributes) {
   let ele = createElement('text',attributes);
   ele.textContent = text;
   return ele;
  }
  return {
   setAttributes : setAttributes,
   createElement : createElement,
   createText : createText
  }
 }();

 let _AsFigure = function(annotatedSpectrum) {
  this.aS = annotatedSpectrum;
  this.node = document.createElement('div')
  this.node.classList.add('spc_cls_spectrum','hide');
  this.aS.app.ui.view.spectra.append(this.node);
  this.draw();
 }

let getTextWidth = obj => 
 Math.max(...Object.entries(obj)
 .filter(([k,v]) => ['text1','text2','text3','text4'].includes(k))
 .map(([k,v]) => v.getBBox().width));

let getTextHeight = obj => 
 Object.entries(obj)
 .filter(([k,v]) => ['text1','text2','text3','text4'].includes(k))
 .map(([k,v]) => v.getBBox().height)
 .reduce((a,h) => a+h,0);

 _AsFigure.prototype.draw = function() {
  let dP = this.aS.displayParams;
  
  this.graphic = SVG.createElement('svg', {
   viewBox : `0 0 ${FIGUREHEIGHT*spc.constants.GOLDENRATIO} ${FIGUREHEIGHT}`,
   'font-family': dP.fontFamily,
   preserveAspectRatio : 'xMidYMid', 
  });

  if (this.node.hasChildNodes()) {
   this.node.replaceChild(this.graphic,this.node.childNodes[0]);
  }
  else {
   this.node.append(this.graphic);
  }
  this.graphic.append(SVG.createElement('defs'));

  let xAxisBottomMargin = this.graphic.viewBox.baseVal.height*dP.axisMarginPctXAxis/100;
  let yAxisLeftMargin = (this.graphic.viewBox.baseVal.width*dP.axisMarginPctXAxis/100) / spc.constants.GOLDENRATIO;
  let headerHeight = this.graphic.viewBox.baseVal.height*dP.headerHeightPct/100;

  let cX = x => x;
  let cY = y => this.graphic.viewBox.baseVal.height-y;
  let oX = 0 + yAxisLeftMargin;
  let oY = 0 + xAxisBottomMargin;
  let pWidth = this.graphic.viewBox.baseVal.width - yAxisLeftMargin;
  let pHeight = this.graphic.viewBox.baseVal.height - xAxisBottomMargin - headerHeight;

  //axes
  this.graphic.append(SVG.createElement('line',{
   x1: cX(oX),
   y1: cY(oY),
   x2: cX(oX + pWidth),
   y2: cY(oY),
   stroke : dP.cols[dP.axisCol],
   'stroke-width' : dP.axisStrokeWidth
  }));
  let xAxisLabel = SVG.createText(dP.xAxisLabel,{
   x: cX(oX),
   y: cY(oY),
   'text-anchor' : 'left',
   'font-size': dP.axisFontSize,
   fill: dP.cols[dP.axisCol]
  });
  this.graphic.append(xAxisLabel);
  xAxisLabel.setAttributes({
   x: cX(oX) + pWidth/2 - xAxisLabel.getBBox().width/2,
   y: cY(oY) + xAxisBottomMargin - xAxisLabel.getBBox().height*0.2
  });

  this.graphic.append(SVG.createElement('line',{
   x1: cX(oX),
   y1: cY(oY),
   x2: cX(oX),
   y2: cY(oY + pHeight),
   stroke : dP.cols[dP.axisCol],
   'stroke-width' : dP.axisStrokeWidth
  }));
  let yAxisLabel = SVG.createText(dP.yAxisLabel,{
   x: cX(oX),
   y: cY(oY),
   'text-anchor' : 'left',
   'font-size': dP.axisFontSize,
   fill: dP.cols[dP.axisCol],
  });
  this.graphic.append(yAxisLabel);
  yAxisLabel.setAttributes({
   x: cX(oX) - yAxisLeftMargin - yAxisLabel.getBBox().width/2 + yAxisLabel.getBBox().height/2,
   y: cY(oY) - pHeight/2 - yAxisLabel.getBBox().height/2
  });
  yAxisLabel.setAttributes({
   transform: `rotate(-90,${yAxisLabel.getBBox().x+yAxisLabel.getBBox().width/2},${yAxisLabel.getBBox().y+yAxisLabel.getBBox().height/2})`
  });

  if (this.aS.ions != null) {
   let mzMin = dP.mzRange.min;
   let mzMax = dP.mzRange.max;
   let mzSpan = mzMax - mzMin;
   let intMin = dP.intRange.min;
   let intMax = dP.intRange.max;
   let intSpan = intMax - intMin;

   let figureIons = Object.values(this.aS.ions).filter(ion => ion.mz >= mzMin && ion.mz <= mzMax);
   
   let xScale = 1;
   let yScale = 1;
   let cXPlot = mz  => cX(oX + ((+mz-mzMin)/ mzSpan) * pWidth * xScale + (1-xScale)/2*pWidth);
   let cYPlot = int => cY(oY + ((+int-intMin)/ intSpan) * pHeight * yScale);

   let tX = (mz,major) => {
    let tick = {};
    tick.line = SVG.createElement('line',{
     x1: cXPlot(mz),
     y1: cY(oY),
     x2: cXPlot(mz),
     y2: cY(oY) + xAxisBottomMargin*dP.tickLengthPctXAxis/100*(major ? 1 : 0.5),
     stroke: dP.cols[dP.axisCol],
     'stroke-width' : dP.tickStrokeWidth
    });
    this.graphic.append(tick.line);
    if (major) {
     tick.text = SVG.createText(mz,{
      x: cX(oX),
      y: cX(oY),
      'text-anchor': 'start',
      'font-size': dP.tickFontSize,
      fill: dP.cols[dP.axisCol],
     });
     this.graphic.append(tick.text);
     tick.text.setAttributes({
      x: cXPlot(mz) - tick.text.getBBox().width/2,
      y: cY(oY) + xAxisBottomMargin*dP.tickLengthPctXAxis/100 + tick.text.getBBox().height*0.8,
     });
    }
    return tick;
   }

   let tY = (int,major) => {
    let tick = {};
    tick.line = SVG.createElement('line',{
     x1: cX(oX),
     y1: cYPlot(int),
     x2: cX(oX) - xAxisBottomMargin*dP.tickLengthPctXAxis/100*(major ? 1 : 0.5),
     y2: cYPlot(int),
     stroke: dP.cols[dP.axisCol],
     'stroke-width' : dP.tickStrokeWidth
    });
    this.graphic.append(tick.line);
    if (major) {
     tick.text = SVG.createText(
      dP.yTicksRelative ? (int/dP.intRange.max * 100).toFixed(0) : int, {
      x: cX(oX),
      y: cY(oY),
      'text-anchor' : 'left',
      'font-size': dP.tickFontSize,
      fill: dP.cols[dP.axisCol]
     });
     this.graphic.append(tick.text);
     tick.text.setAttributes({
      x: cX(oX) - xAxisBottomMargin*dP.tickLengthPctXAxis/100 - tick.text.getBBox().width/2 - tick.text.getBBox().height*0.8,
      y: cYPlot(int) + (tick.text.getBBox().height/2)*0.65
     });
     tick.text.setAttributes({
      transform: `rotate(-90,${tick.text.getBBox().x + tick.text.getBBox().width/2},${tick.text.getBBox().y + tick.text.getBBox().height/2})`
     });
    }
    return tick;
   }

   let multiplier = [2,2.5,2];

   let mzTickSize = Math.pow(10,-dP.mzPrecision)/2;
   let iMzMulti = 0;
   while (mzSpan/mzTickSize > dP.xTickMaxMajor) {
    mzTickSize *= multiplier[iMzMulti];
    iMzMulti = (iMzMulti+1)%multiplier.length;
   }
   let mzSubTickSize = mzTickSize/5;
   let mzTick = mzTickSize*(((dP.mzRange.min/mzTickSize) >> 0) + 1);
   for (let s = 1; s <= 4; s++) {
    let mzSubTick = mzTick-s*mzSubTickSize;
    if (mzSubTick >= dP.mzRange.min) tX(mzSubTick,false);
   }
   for (; mzTick <= dP.mzRange.max; mzTick += mzTickSize) {
    tX(mzTick,true);
    for (let s = 1; s <= 4; s++) {
     let mzSubTick = mzTick+s*mzSubTickSize;
     if (mzSubTick <= dP.mzRange.max) tX(mzSubTick,false);
    }
   }

   if (dP.yTicksRelative) {
    tY(dP.intRange.max,true);
     tY(dP.intRange.max*0.95,false);
     tY(dP.intRange.max*0.90,false);
     tY(dP.intRange.max*0.85,false);
    tY(dP.intRange.max*0.80,true);
     tY(dP.intRange.max*0.75,false);
     tY(dP.intRange.max*0.70,false);
     tY(dP.intRange.max*0.65,false);
    tY(dP.intRange.max*0.60,true);
     tY(dP.intRange.max*0.55,false);
     tY(dP.intRange.max*0.50,false);
     tY(dP.intRange.max*0.45,false);
    tY(dP.intRange.max*0.40,true);
     tY(dP.intRange.max*0.35,false);
     tY(dP.intRange.max*0.30,false);
     tY(dP.intRange.max*0.25,false);
    tY(dP.intRange.max*0.20,true);
     tY(dP.intRange.max*0.15,false);
     tY(dP.intRange.max*0.10,false);
     tY(dP.intRange.max*0.05,false);
    tY(0,true);
   }
   else {
    let intTickSize = 50;
    let iIntMulti = 0;
    while (intSpan/intTickSize > dP.yTickMaxMajor) {
     intTickSize *= multiplier[iIntMulti];
     iIntMulti = (iIntMulti+1)%multiplier.length;
    }
    let intSubTickSize = intTickSize/5;
    let intTick = intTickSize*(((dP.intRange.min/intTickSize) >> 0) + 1);
    for (let s = 1; s <= 4; s++) {
     let intSubTick = intTick-s*intSubTickSize;
     if (intSubTick >= dP.intRange.min) tY(intSubTick,false);
    }
    for (; intTick <= dP.intRange.max; intTick += intTickSize) {
     tY(intTick,true);
     for (let s = 1; s <= 4; s++) {
      let intSubTick = intTick+s*intSubTickSize;
      if (intSubTick <= dP.intRange.max) tY(intSubTick,false);
     }
    }
   }

   let labels = [];
   let labelHeights = [];
   let labelWidths = [];

   //Draw each label to be displayed (hidden to avoid loading glitches)
   //Calculate maximum length and height required
   figureIons.filter(ion => (ion.annotation != null) && ion.drawLabel).forEach(ion => {
    let label = { ion : ion };
    label.text1 = SVG.createText(ion.annotation,{
     x: 0,
     y: 0,
     'text-anchor' : 'start',
     'font-size': dP.labelFontSize,
     fill: dP.cols[label.ion.col],
     visibility: 'hidden'
    });
    this.graphic.append(label.text1);
    if (dP.labelShowMasses) {
     label.text2 = SVG.createText(ion.mz.toFixed(dP.mzPrecision),{
      x: 0,
      y: 0,
      'text-anchor' : 'start',
      'font-size': dP.labelFontSize,
      fill: dP.cols[label.ion.col],
      visibility: 'hidden'
     });
     this.graphic.append(label.text2);
    }
    labelWidths.push(getTextWidth(label));
    labelHeights.push(getTextHeight(label));
    labels.push(label);
   });

   let drawPeaks = () => {
    figureIons.forEach(ion => {
     let peak = SVG.createElement('line',{
      x1: cXPlot(ion.mz),
      y1: cYPlot(0),
      x2: cXPlot(ion.mz),
      y2: cYPlot(ion.int),
      stroke : dP.peakUseAnnotationCols ? dP.cols[ion.col] : dP.cols[0],
      'stroke-width' : dP.peakStrokeWidth
     });
     peak.ion = ion;
     this.graphic.append(peak);
    });
   }

   if (labels.length) {
    let labelReqHeight = Math.max(...labelHeights)*(1+dP.labelBorderPaddingPct/100);
    let labelReqWidth = Math.max(...labelWidths)*(1+dP.labelBorderPaddingPct/100);
    let labelYPadding = labelReqHeight*0.1;

    let highestPeakMz = figureIons.sort((a,b) => (b.int - a.int))[0].mz;
    let freeCells = [];

    let generateCells = () => {
     freeCells = [];
     let rhs = true;
     let xOffset = 0;
     for (let colLeft = cX(oX + pWidth - labelReqWidth); colLeft >= cX(oX); colLeft-=labelReqWidth) {
      if (rhs && colLeft <= cXPlot(highestPeakMz)) {
       colLeft = cXPlot(highestPeakMz) - labelReqWidth*1.25;
       rhs = false;
      }
      for (let rowBase = cY(oY + pHeight - labelReqHeight); (rowBase + labelYPadding) <= cY(oY); rowBase += (labelReqHeight + labelYPadding)) {
       for (let n3 = 0; n3 <= 1; n3++) {
        let colIons = figureIons.filter(ion => ((cXPlot(ion.mz) >= colLeft) && (cXPlot(ion.mz) <= (colLeft+labelReqWidth))));
        if (!(colLeft < cX(oX) || colIons.some(ion => cYPlot(ion.int) <= rowBase + labelYPadding))) {
         freeCells.push({ cx: colLeft, cy: rowBase, cxmid: colLeft+labelReqWidth/2, cymid: rowBase-labelReqHeight/2 });
         break;
        }
        else {
         colLeft += (n3 ? 1 : -1)*labelReqWidth/2;
        }
       }
      }
     }
    }

    generateCells();
    //Find a scaling value for the spectrum that allows all required labels to be displayed
    //Not used (confusing interaction with setting mz and int display ranges)
    // while(xScale > 0.5) {
    //  generateCells();
    //  if (freeCells.length >= labels.length) break;
    //  else {
    //   xScale -= 0.05;
    //   yScale -= 0.05;
    //  }
    // }

    //Find a font size for the spectrum that allows all required labels to be displayed
    let fontSize = dP.labelFontSize - 0.5;
    if (freeCells.length < labels.length) {
     while(fontSize > 6) {
      labelHeights = [];
      labelWidths = [];
      labels.forEach(label => {
       label.text1.setAttributes({
        'font-size': fontSize,
       });
       if ('text2' in label) label.text2.setAttributes({
        'font-size': fontSize,
       });
       labelWidths.push(getTextWidth(label));
       labelHeights.push(getTextHeight(label));
      });
      labelReqHeight = Math.max(...labelHeights)*(1+dP.labelBorderPaddingPct/100);
      labelReqWidth = Math.max(...labelWidths)*(1+dP.labelBorderPaddingPct/100);
      generateCells();
      if (freeCells.length >= labels.length) break;
      else {
       fontSize -= 0.5;
      }
     }
    }

    drawPeaks();

    // //Debug - possible label locations
    // freeCells.forEach(cell => {
    //  let rect = SVG.createElement('rect',{
    //   x: cell.cx,
    //   y: cell.cy-labelReqHeight,
    //   width: labelReqWidth,
    //   height: labelReqHeight,
    //   stroke: 'grey',
    //   fill: 'white',
    //   'fill-opacity': 0,
    //   'stroke-width': 0.1
    //  });
    //  this.graphic.append(rect);
    // });

    let getWeightedDistanceSq = (x1,x2,y1,y2) => {
     let xd = x1 - x2;
     let yd = y1 - y2;
     return (Math.pow(xd,2) + Math.pow(yd < 0 ? yd : 10*yd,2));
    }

    let getBestFreeCellIndex = (cx,cy) => {
     return freeCells.reduce(([m,mi],cell,i) => {
      let d = Math.sqrt(getWeightedDistanceSq(cell.cxmid,cx,cell.cymid,cy));
      if (d < m) return [d,i];
      else return [m,mi];
     },[Infinity,null])[1];
    }

    labels.sort((a,b) => a.ion.mz - b.ion.mz);
    
    labels.forEach(label => {
     label.cell = freeCells.splice(getBestFreeCellIndex(cXPlot(label.ion.mz),cYPlot(label.ion.int)),1)[0];
    });

    let getTotalDistance = () => {
     let total = 0;
     for (let i = 0; i < labels.length; i++) {
      total += getWeightedDistanceSq(labels[i].cell.cxmid,cXPlot(labels[i].ion.mz),labels[i].cell.cymid,cYPlot(labels[i].ion.int));
     }
     return Math.sqrt(total);
    }

    let distance = getTotalDistance();
    for (let n = 0; n <= labels.length*100; n++) {
     labels.sort(() => 0.5 - Math.random());
     freeCells.push(labels[0].cell);
     labels[0].cell = labels[1].cell;
     let bestCell = getBestFreeCellIndex(cXPlot(labels[1].ion.mz),cYPlot(labels[1].ion.int));
     labels[1].cell = freeCells[bestCell];
     let newDistance = getTotalDistance();
     if (newDistance < distance) {
      freeCells.splice(bestCell,1);
      distance = newDistance;
     }
     else { //revert
      labels[1].cell = labels[0].cell;
      labels[0].cell = freeCells.pop();
     }
    }

    labels.sort((a,b) => b.ion.mz - a.ion.mz);

    labels.forEach(label => {

     if ('text2' in label) {
      label.text1.setAttributes({
       x: label.cell.cxmid - label.text1.getBBox().width/2,
       y: label.cell.cymid - label.text1.getBBox().height*0.2
      });
      label.text1.removeAttribute('visibility');
      label.text2.setAttributes({
       x: label.cell.cxmid - label.text2.getBBox().width/2,
       y: label.cell.cymid + label.text2.getBBox().height*0.8
      });
      label.text2.removeAttribute('visibility');
     }
     else {
      label.text1.setAttributes({
       x: label.cell.cxmid - label.text1.getBBox().width/2,
       y: label.cell.cymid + label.text1.getBBox().height/2 - label.text1.getBBox().height*0.2
      });
      label.text1.removeAttribute('visibility');
     }

     let cellBoundaryX,cellBoundaryY;
     let indicWingOffset;
     let xDiff = (label.cell.cxmid - cXPlot(label.ion.mz));
     let yDiff = (label.cell.cymid - cYPlot(label.ion.int));

     let theta = Math.atan2(yDiff,xDiff);
     let xAtYBoundary = Math.cos(theta) * getTextHeight(label)/2;
     let yAtXBoundary = Math.sin(theta) * getTextWidth(label)/2;
     let sideLR = false;

     if (Math.abs(yAtXBoundary) > getTextHeight(label)/2) { //line hits bottom/top
      cellBoundaryX = label.cell.cxmid - (xAtYBoundary - labelReqWidth*0.05);
      cellBoundaryY = label.cell.cymid + Math.sign(-yDiff)*(labelReqHeight/2 - labelReqHeight*0.05);
      indicWingOffset = Math.sign(-yDiff)*(labelReqHeight*0.1)
     }
     else { //line hits left/right
      sideLR = true;
      cellBoundaryX = label.cell.cxmid + Math.sign(-xDiff)*(labelReqWidth/2 - labelReqWidth*0.05);
      cellBoundaryY = label.cell.cymid - (yAtXBoundary - labelReqHeight*0.05);
      indicWingOffset = Math.sign(-xDiff)*(labelReqHeight*0.1)
     }

     label.line = SVG.createElement('line',{
      x1 : cellBoundaryX,
      y1 : cellBoundaryY,
      x2 : cXPlot(label.ion.mz),
      y2 : cYPlot(label.ion.int),
      stroke: dP.cols[label.ion.col],
      'stroke-width' : dP.labelStrokeWidth,
      'stroke-dasharray': `${dP.labelStrokeWidth*2},${dP.labelStrokeWidth*2}`
     });
     label.indicator = SVG.createElement('line',{
      x1 : sideLR ? cellBoundaryX : label.cell.cxmid - getTextWidth(label)/2*1.03,
      y1 : sideLR ? label.cell.cymid - getTextHeight(label)/2 : cellBoundaryY,
      x2 : sideLR ? cellBoundaryX : label.cell.cxmid + getTextWidth(label)/2*1.02,
      y2 : sideLR ? label.cell.cymid + getTextHeight(label)/2 : cellBoundaryY,
      stroke: dP.cols[label.ion.col],
      'stroke-width' : dP.labelStrokeWidth
     });
     label.indicatorWing1 = SVG.createElement('line',{
      x1 : sideLR ? cellBoundaryX: label.cell.cxmid - getTextWidth(label)/2*1.03,
      y1 : sideLR ? label.cell.cymid - getTextHeight(label)/2 : cellBoundaryY,
      x2 : sideLR ? cellBoundaryX - indicWingOffset: label.cell.cxmid - getTextWidth(label)/2*1.03,
      y2 : sideLR ? label.cell.cymid - getTextHeight(label)/2 : cellBoundaryY - indicWingOffset,
      stroke: dP.cols[label.ion.col],
      'stroke-width' : dP.labelStrokeWidth
     });
     label.indicatorWing2 = SVG.createElement('line',{
      x1 : sideLR ? cellBoundaryX: label.cell.cxmid + getTextWidth(label)/2*1.02,
      y1 : sideLR ? label.cell.cymid + getTextHeight(label)/2 : cellBoundaryY,
      x2 : sideLR ? cellBoundaryX - indicWingOffset: label.cell.cxmid + getTextWidth(label)/2*1.02,
      y2 : sideLR ? label.cell.cymid + getTextHeight(label)/2 : cellBoundaryY - indicWingOffset,
      stroke: dP.cols[label.ion.col],
      'stroke-width' : dP.labelStrokeWidth
     });
     label.bg = SVG.createElement('rect',{
      x: label.cell.cxmid - getTextWidth(label)/2*1.1,
      y: label.cell.cymid - getTextHeight(label)/2*1.1,
      width: getTextWidth(label)*1.1,
      height: getTextHeight(label)*1.1,
      stroke: 'none',
      fill: 'white'
     });
     this.graphic.append(label.line);
    });
    //Move labels to front
    labels.forEach(label => {
     this.graphic.append(label.bg);
     this.graphic.append(label.indicator);
     this.graphic.append(label.indicatorWing1);
     this.graphic.append(label.indicatorWing2);
     this.graphic.append(label.text1);
     if ('text2' in label) {
      this.graphic.append(label.text2);
     }
    });
   }
   else {
    drawPeaks();
   }
   
   //header
   if (this.aS.peptide != null) {

    let relativeToChain0Start = [0];
    let branchLines = [];
    for (let i = 1; i < this.aS.peptide.chains.length; i++) {
     let chain = this.aS.peptide.chains[i];
     let chainRelToChain0Start = [];
     if (this.aS.peptide.branches[i]) {
      let chainBranches = Object.entries(this.aS.peptide.branches[i]);
      let connectsChain0 = false;
      for (let j = 0; j < chainBranches.length; j++) {
       let [position,[branchChainIdx,branchChainPosition,branchNetAdjust]] = chainBranches[j];
       if (branchChainIdx == 0) {
        connectsChain0 = true;
        chainRelToChain0Start = [branchChainPosition - position];
       }
       if (branchChainIdx < i) {
        if (!connectsChain0) chainRelToChain0Start.push(relativeToChain0Start[branchChainIdx] + branchChainPosition - position);
        let branchLine = { from: { chain: i, position: +position} , to: { chain: +branchChainIdx, position: +branchChainPosition } };
        branchLines.push(branchLine);
       }
      }
     }
     relativeToChain0Start[i] = chainRelToChain0Start.length ?
      Math.min(...chainRelToChain0Start) :
      0;
    }

    let glyphs = [];
    for (let i = 0; i < this.aS.peptide.chains.length; i++) {
     let chain = this.aS.peptide.chains[i];
     glyphs[i] = [];
     let glyphWidths = [];
     let glyphHeights = [];
     chain.residues.forEach((residue,position) => {
      let glyph = { residue: residue, position: position };
      if (!('display' in residue.symbol) || residue.symbol.display == 'text') {
        glyph.text1 = SVG.createText(residue.symbol.text,{
        x: 0,
        y: 0,
        'text-anchor' : 'start',
        'font-size': dP.headerFontSize,
        fill: dP.cols[dP.headerCol],
        visibility: 'hidden'
       });
       this.graphic.append(glyph.text1);
       if ('note' in residue.symbol) {
        glyph.text2 = SVG.createText(residue.symbol.note,{
         x: 0,
         y: 0,
         'text-anchor' : 'start',
         'font-size': dP.headerNoteFontSize,
         fill: dP.cols[dP.headerCol],
         visibility: 'hidden'
        });
        this.graphic.append(glyph.text2);
       }
      }
      glyphs[i].push(glyph);
     });
    }

    let cleavages = {};
    labels.filter(label => this.aS.peptide.productIons[label.ion.annotation].products[0].group == 'series').forEach(label => {
     let product = this.aS.peptide.productIons[label.ion.annotation].products[0];
     let chainIdx = product.chainIdx;
     let position = product.descending ? this.aS.peptide.chains[chainIdx].residues.length - product.nResiduesThisChain : (product.nResiduesThisChain-1);
     let cleavage;
     if (!(chainIdx in cleavages)) cleavages[chainIdx] = {};
     if (!(position in cleavages[chainIdx])) cleavages[chainIdx][position] = new Array(2);
     let isDescNumeric = product.descending ? 1 : 0;
     if (!cleavages[chainIdx][position][isDescNumeric]) {
      cleavages[chainIdx][position][isDescNumeric] = {
       chainIdx: chainIdx,
       position: position,
       nResiduesThisChain: product.nResiduesThisChain,
       descending: product.descending, 
       labels : {} 
      };
     }
     if (!(product.type in cleavages[chainIdx][position][isDescNumeric].labels)) {
      cleavages[chainIdx][position][isDescNumeric].labels[product.type] = SVG.createText(
       product.type,{
       x: 0,
       y: 0,
       'text-anchor': 'start',
       'letter-spacing': -0.75,
       'font-size': dP.headerNoteFontSize,
       'letter-spacing': -0.75,
       fill: dP.cols[label.ion.col],
       visibility: 'hidden'
      });
      this.graphic.append(cleavages[chainIdx][position][isDescNumeric].labels[product.type]);
     }
    });

    let dummyText = {};
    dummyText.text1 = SVG.createText('X',{
     x: 0,
     y: 0,
     'text-anchor' : 'start',
     'font-size': dP.headerFontSize,
     fill: dP.cols[dP.headerCol],
     visibility: 'hidden'
    });
    this.graphic.append(dummyText.text1);
    dummyText.text2 = SVG.createText('xxx',{
     x: 0,
     y: 0,
     'text-anchor' : 'start',
     'font-size': dP.headerNoteFontSize,
     fill: dP.cols[dP.headerCol],
     visibility: 'hidden'
    });
    this.graphic.append(dummyText.text2);

    let glyphReqWidth = Math.max(getTextWidth(dummyText))*(1+dP.headerGlyphPaddingPct/100);
    let glyphReqHeight = Math.max(getTextHeight(dummyText))*(1+dP.headerGlyphPaddingPct/100);

    this.graphic.removeChild(dummyText.text1);
    this.graphic.removeChild(dummyText.text2);

    //May eventually need autoshrink code here

    let headerWidth = this.graphic.viewBox.baseVal.width;

    let precursor = Object.values(spectacleApp.annotatedSpectra[0].peptide.products).filter(product => product.type=='p')[0];
    let mass = mslib.moietymath.monoisotopicMass(precursor);
    let mz =  mslib.moietymath.monoisotopicMz(precursor,this.aS.peptide.charge);
    let source = this.aS.app.sources.get(this.aS.sourceDetails.name);
    let scan = source.scans[this.aS.sourceDetails.scanNumber];

    let info = {};
    info.text1 = SVG.createText(`Precursor Mass: ${mass.toFixed(dP.mzPrecision)} (${mz.toFixed(dP.mzPrecision)} m/z, ${this.aS.peptide.charge}+)`,{
     x: 0,
     y: 0,
     'text-anchor' : 'start',
     'font-size': dP.headerFontSize,
     fill: dP.cols[dP.headerCol],
     visibility: 'hidden'
    });
    this.graphic.append(info.text1);
    info.text2 = SVG.createText(`Highest Intensity: ${intMax.toExponential(dP.intPrecision).replace('e+','e')}`,{
     x: 0,
     y: 0,
     'text-anchor' : 'start',
     'font-size': dP.headerFontSize,
     fill: dP.cols[dP.headerCol],
     visibility: 'hidden'
    });
    this.graphic.append(info.text2);
    let tic = scan.totalCurrent;
    if (tic) {
     info.text3 = SVG.createText(`Total Intensity: ${tic.toExponential(dP.intPrecision).replace('e+','e')}`,{
      x: 0,
      y: 0,
      'text-anchor' : 'start',
      'font-size': dP.headerFontSize,
      fill: dP.cols[dP.headerCol],
      visibility: 'hidden'
     });
     this.graphic.append(info.text3);
    }
    let ce = scan.collisionEnergy;
    if (ce) {
     info.text4 = SVG.createText(`Collision Energy: ${ce} (NL)`,{
      x: 0,
      y: 0,
      'text-anchor' : 'start',
      'font-size': dP.headerFontSize,
      fill: dP.cols[dP.headerCol],
      visibility: 'hidden'
     });
     this.graphic.append(info.text4);
    }

    let infoTotalWidth = Object.values(info).map(txt => txt.getBBox().width).reduce((a,w) => a+w,0);
    let infoHeight = Math.max(...Object.values(info).map(txt => txt.getBBox().height));
    let infoSpacing = (headerWidth-infoTotalWidth)/(Object.keys(info).length + 1);
    let infoX = infoSpacing;

    ['text1','text2','text3','text4'].forEach(key => {
     if (key in info) {
      info[key].setAttributes({
       x: infoX,
       y: infoHeight
      });
      info[key].removeAttribute('visibility');
      infoX += info[key].getBBox().width + infoSpacing;
     }
    });

    let leftmostChainStart = Math.min(...relativeToChain0Start);
    let maxChainExtent = Math.max(...relativeToChain0Start.map((start,i) => start + this.aS.peptide.chains[i].residues.length)) - leftmostChainStart;
    let relativeToLeftmostChainStart = relativeToChain0Start.map(start => start - leftmostChainStart)
    let headerXSpacing = headerWidth / (maxChainExtent + (this.aS.peptide.chains[0].nOfType > 1 ? 3 : 2) );
    let headerYSpacing = (headerHeight-infoHeight) / (this.aS.peptide.chains.length + 1);
    let ionTypeOrder = ['c','b','a','x','y','z'];

    let getHeaderTopLineForChain = chain => infoHeight + headerYSpacing*(3/4) + chain*headerYSpacing;
    let getPositionLeftForChain = (chain,position) => (relativeToLeftmostChainStart[chain] + position + (this.aS.peptide.chains[0].nOfType > 1 ? 2 : 1) )*headerXSpacing;

    branchLines.forEach(branchLine => {
     let line = SVG.createElement('line',{
      x1: getPositionLeftForChain(branchLine.from.chain,branchLine.from.position) + headerXSpacing/2,
      y1: getHeaderTopLineForChain(branchLine.from.chain),
      x2: getPositionLeftForChain(branchLine.to.chain,branchLine.to.position) + headerXSpacing/2,
      y2: getHeaderTopLineForChain(branchLine.to.chain)+glyphReqHeight,
      stroke: dP.cols[dP.branchCol],
      'stroke-width' : dP.branchStrokeWidth,
      fill: 'none'
     });
     this.graphic.append(line);
     let topRect = SVG.createElement('rect',{
      x: getPositionLeftForChain(branchLine.to.chain,branchLine.to.position),
      y: getHeaderTopLineForChain(branchLine.to.chain),
      width: headerXSpacing,
      height: glyphReqHeight,
      stroke: 'none',
      'stroke-width' : dP.headerStrokeWidth,
      fill: dP.cols[dP.branchCol]
     });
     this.graphic.append(topRect);
     let bottomRect = SVG.createElement('rect',{
      x: getPositionLeftForChain(branchLine.from.chain,branchLine.from.position),
      y: getHeaderTopLineForChain(branchLine.from.chain),
      width: headerXSpacing,
      height: glyphReqHeight,
      stroke: 'none',
      'stroke-width' : dP.headerStrokeWidth,
      fill: dP.cols[dP.branchCol]
     });
     this.graphic.append(bottomRect);
    });

    for (let i = 0; i < this.aS.peptide.chains.length; i++) {
     let textTopLineY = getHeaderTopLineForChain(i);;
     if (this.aS.peptide.chains[0].nOfType > 1) {
      let chainIndicator = SVG.createText(this.aS.peptide.chainPrefix[i]+':',{
       x: 0,
       y: 0,
       'text-anchor' : 'start',
       'font-size': dP.headerFontSize,
       fill: dP.cols[dP.headerCol],
       visibility: 'hidden'
      });
      this.graphic.append(chainIndicator);
      chainIndicator.setAttributes({
       x: getPositionLeftForChain(i,-1) + (headerXSpacing-chainIndicator.getBBox().width)*(3/4),
       y: textTopLineY + chainIndicator.getBBox().height
      });
      chainIndicator.removeAttribute('visibility');
      let chainSurround = SVG.createElement('circle',{
       cx: chainIndicator.getBBox().x+chainIndicator.getBBox().width/2,
       cy: chainIndicator.getBBox().y+chainIndicator.getBBox().height/2,
       r: chainIndicator.getBBox().height/2,
       stroke: 'none',
       fill: dP.cols[dP.chainLabelBgCol]
      });
      this.graphic.append(chainSurround);
      this.graphic.append(chainIndicator);
     }

     glyphs[i].forEach((glyph,position) => {
      let x = getPositionLeftForChain(i,position);
      let y = textTopLineY;
      glyph.text1.setAttributes({
       x: x + (headerXSpacing-glyph.text1.getBBox().width)/2,
       y: y + glyph.text1.getBBox().height
      });
      glyph.text1.removeAttribute('visibility');
      this.graphic.append(glyph.text1);
      if ('text2' in glyph) {
       glyph.text2.setAttributes({
        x: x + (headerXSpacing-glyph.text2.getBBox().width)/2,
        y: y + glyph.text1.getBBox().height + glyph.text2.getBBox().height - (glyphReqHeight*0.1)
       });
       glyph.text2.removeAttribute('visibility');
       this.graphic.append(glyph.text2);
      }
      if ((i in cleavages) && (position in cleavages[i])) {
       for (let isDescNumeric = 0; isDescNumeric <= 1; isDescNumeric++) {
        if (cleavages[i][position][isDescNumeric]) {
         let xShift = 0;
         let descending = cleavages[i][position][isDescNumeric].descending;
         let nRTC = SVG.createText(cleavages[i][position][isDescNumeric].nResiduesThisChain,{
          x: 0,
          y: 0,
          'text-anchor': 'start',
          'font-size': dP.headerNoteFontSize,
          'letter-spacing': -0.75,
          fill: dP.cols[dP.headerCol],
          visibility: 'hidden'
         });
         this.graphic.append(nRTC);
         if (isDescNumeric==0) xShift = nRTC.getBBox().width*0.9;
         ionTypeOrder.forEach(ionType => {
          if (ionType in cleavages[i][position][isDescNumeric].labels) {
           cleavages[i][position][isDescNumeric].labels[ionType].setAttributes({
            x: x + (descending ? 0 : 1) * headerXSpacing
                 + glyphReqWidth*(3/16) * (isDescNumeric ? 1 : -1)
                 + xShift * (isDescNumeric ? 1 : -1)
                 + (descending ? 0.05 : -1)*cleavages[i][position][isDescNumeric].labels[ionType].getBBox().width,
            y: y + (descending ? 
                    -glyphReqWidth*(1/8) : 
                    glyphReqHeight + glyphReqWidth*(3/8))
           });
           cleavages[i][position][isDescNumeric].labels[ionType].removeAttribute('visibility');
           xShift += cleavages[i][position][isDescNumeric].labels[ionType].getBBox().width;
          }
         });
         nRTC.setAttributes({
          x: x + (descending ? 0 : 1) * headerXSpacing
          + glyphReqWidth*(3/16) * (descending ? 1 : -1)
          + (descending ? xShift : -nRTC.getBBox().width),
          y: y + (descending ? 
           -glyphReqWidth*(1/8) : 
           glyphReqHeight + glyphReqWidth*(3/8))
         });
         nRTC.removeAttribute('visibility');
         if (descending) {
          this.graphic.append(SVG.createElement('line',{
           x1: x,
           y1: y,
           x2: x,
           y2: y + glyphReqHeight,
           stroke: dP.cols[dP.headerCol],
           'stroke-width' : dP.headerStrokeWidth
          }));
          this.graphic.append(cleavages[i][position][isDescNumeric].upperTail = SVG.createElement('line',{
           x1: x,
           y1: y,
           x2: x + glyphReqWidth*(3/16),
           y2: y - glyphReqWidth/4,
           stroke: dP.cols[dP.headerCol],
           'stroke-width' : dP.headerStrokeWidth
          }));
         }
         else {
          if (!((position+1) in cleavages[i]) || !cleavages[i][(position+1)][1]) {
           this.graphic.append(SVG.createElement('line',{
            x1: x + headerXSpacing,
            y1: y,
            x2: x + headerXSpacing,
            y2: y + glyphReqHeight,
            stroke: dP.cols[dP.headerCol],
            'stroke-width' : dP.headerStrokeWidth
           }));
          }
          this.graphic.append(SVG.createElement('line',{
           x1: x + headerXSpacing,
           y1: y + glyphReqHeight,
           x2: x + headerXSpacing - glyphReqWidth*(3/16),
           y2: y + glyphReqHeight + glyphReqWidth/4,
           stroke: dP.cols[dP.headerCol],
           'stroke-width' : dP.headerStrokeWidth
          }));
         }
        }
       }
      }
     });
    }
   }
  }
 }

 _AsFigure.prototype.toText = function() {
  let svgText =  new XMLSerializer().serializeToString(this.graphic);
  svgText = svgText.replace(/font-family="[^"]+"/,`font-family="${this.aS.displayParams.fontFamily}"`)
  svgText = svgText.replace(/(<svg [^>]+>)/,'$1'+`<defs><style><![CDATA[${spc.UI.components.fonts.atRule(this.aS.displayParams.fontFamily)}]]></style></defs>`)
  return svgText;
 }

 return _AsFigure;
}();

//  Array.from(this.node.querySelectorAll('[class]')).forEach(ele => {
//   spc.UI.assignHandles(this.as,ele);
//  });