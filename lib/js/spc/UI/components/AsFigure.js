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
  let par = this.aS.params;
  let palette = this.aS.app.palette;
  
  this.graphic = SVG.createElement('svg', {
   viewBox : `0 0 ${FIGUREHEIGHT*spc.constants.GOLDENRATIO} ${FIGUREHEIGHT}`,
   'font-family': par.fontFamily,
   preserveAspectRatio : 'xMidYMid', 
  });

  if (this.node.hasChildNodes()) {
   this.node.replaceChild(this.graphic,this.node.childNodes[0]);
  }
  else {
   this.node.append(this.graphic);
  }
  this.graphic.append(SVG.createElement('defs'));

  let xAxisBottomMargin = this.graphic.viewBox.baseVal.height*par.axisMarginPctXAxis/100;
  let yAxisLeftMargin = (this.graphic.viewBox.baseVal.width*par.axisMarginPctXAxis/100) / spc.constants.GOLDENRATIO;
  let headerHeight = this.graphic.viewBox.baseVal.height*par.headerHeightPct/100;

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
   stroke : palette[par.axisCol],
   'stroke-width' : par.axisStrokeWidth
  }));
  let xAxisLabel = SVG.createText(par.xAxisLabel,{
   x: cX(oX),
   y: cY(oY),
   'text-anchor' : 'left',
   'font-size': par.axisFontSize,
   fill: palette[par.axisCol]
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
   stroke : palette[par.axisCol],
   'stroke-width' : par.axisStrokeWidth
  }));
  let yAxisLabel = SVG.createText(par.yAxisLabel,{
   x: cX(oX),
   y: cY(oY),
   'text-anchor' : 'left',
   'font-size': par.axisFontSize,
   fill: palette[par.axisCol],
  });
  this.graphic.append(yAxisLabel);
  yAxisLabel.setAttributes({
   x: cX(oX) - yAxisLeftMargin - yAxisLabel.getBBox().width/2 + yAxisLabel.getBBox().height/2,
   y: cY(oY) - pHeight/2 - yAxisLabel.getBBox().height/2
  });
  yAxisLabel.setAttributes({
   transform: `rotate(-90,${yAxisLabel.getBBox().x+yAxisLabel.getBBox().width/2},${yAxisLabel.getBBox().y+yAxisLabel.getBBox().height/2})`
  });

  let mzMin = 0;
  let mzMax = 1;
  let intMin = 0;
  let intMax = 1;

  if (this.aS.ions != null) {

   //Calculate Ranges
   let zoom = par.zoom;
   if (!Object.keys(zoom).length) throw new Error('Invalid zoom setting!');
   if ('full' in zoom) {
    if (zoom.full == 'both' || zoom.full == 'mz') {
     let padding = (this.aS.sourceDetails.mzRange.max - this.aS.sourceDetails.mzRange.min)*par.axisPaddingPct/100;
     mzMin = Math.max(this.aS.sourceDetails.mzRange.min - padding,0);
     mzMax = this.aS.sourceDetails.mzRange.max + padding;
    }
    if (zoom.full == 'both' || zoom.full == 'int') {
     let padding = par.yTicksRelative ? 0 : (this.aS.sourceDetails.intRange.max - this.aS.sourceDetails.intRange.min)*par.axisPaddingPct/100;
     intMin = 0;
     intMax = this.aS.sourceDetails.intRange.max + padding;
    }
   }
   if ('smart' in zoom) {
    if (Object.values(this.aS.ions).filter(ion => (ion.annotation != null) && ion.drawLabel).length) {
     if (zoom.smart == 'both' || zoom.smart == 'mz') {
      let mzs = Object.values(this.aS.ions).filter(ion => (ion.annotation && ion.drawLabel)).map(ion => ion.mz);
      let [labelMzMin,labelMzMax] = [Math.min(...mzs),Math.max(...mzs)];
      let padding = (labelMzMax - labelMzMin)*par.axisPaddingPct/100;
      mzMin = Math.max(labelMzMin - padding,0);
      mzMax = labelMzMax + padding;
     }
     if (zoom.smart == 'both' || zoom.smart == 'int') {
      let ints = Object.values(this.aS.ions)
                 .filter(ion => ion.mz >= mzMin &&
                                ion.mz <= mzMax)
                 .map(ion => ion.int);
      let [labelIntMin,labelIntMax] = [Math.min(...ints),Math.max(...ints)];
      let padding = par.yTicksRelative ? 0 : (labelIntMax - labelIntMin)*par.axisPaddingPct/100;
      intMin = 0;
      intMax = labelIntMax + padding;
     }
    }
   }
   if ('custom' in zoom) {
    if ('mz' in zoom.custom) {
     let padding = (zoom.custom.mz.max - zoom.custom.mz.min)*par.axisPaddingPct/100;
     mzMin = Math.max(zoom.custom.mz.min - padding,0);
     mzMax = this.params.zoom.custom.mz.max + padding;
    }
    if ('int' in zoom.custom) {
     let padding = par.yTicksRelative ? 0 : (zoom.custom.int.max - zoom.custom.int.min)*par.axisPaddingPct/100;
     intMin = Math.max(zoom.custom.int.min - padding,0);
     intMax = zoom.custom.int.max + padding;
    }
   }

   let mzSpan = mzMax - mzMin;
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
     y2: cY(oY) + xAxisBottomMargin*par.tickLengthPctXAxis/100*(major ? 1 : 0.5),
     stroke: palette[par.axisCol],
     'stroke-width' : par.tickStrokeWidth
    });
    this.graphic.append(tick.line);
    if (major) {
     tick.text = SVG.createText(mz,{
      x: cX(oX),
      y: cX(oY),
      'text-anchor': 'start',
      'font-size': par.tickFontSize,
      fill: palette[par.axisCol],
     });
     this.graphic.append(tick.text);
     tick.text.setAttributes({
      x: cXPlot(mz) - tick.text.getBBox().width/2,
      y: cY(oY) + xAxisBottomMargin*par.tickLengthPctXAxis/100 + tick.text.getBBox().height*0.8,
     });
    }
    return tick;
   }

   let tY = (int,major) => {
    let tick = {};
    tick.line = SVG.createElement('line',{
     x1: cX(oX),
     y1: cYPlot(int),
     x2: cX(oX) - xAxisBottomMargin*par.tickLengthPctXAxis/100*(major ? 1 : 0.5),
     y2: cYPlot(int),
     stroke: palette[par.axisCol],
     'stroke-width' : par.tickStrokeWidth
    });
    this.graphic.append(tick.line);
    if (major) {
     tick.text = SVG.createText(
      par.yTicksRelative ? (int/intMax * 100).toFixed(0) : int, {
      x: cX(oX),
      y: cY(oY),
      'text-anchor' : 'left',
      'font-size': par.tickFontSize,
      fill: palette[par.axisCol]
     });
     this.graphic.append(tick.text);
     tick.text.setAttributes({
      x: cX(oX) - xAxisBottomMargin*par.tickLengthPctXAxis/100 - tick.text.getBBox().width/2 - tick.text.getBBox().height*0.8,
      y: cYPlot(int) + (tick.text.getBBox().height/2)*0.65
     });
     tick.text.setAttributes({
      transform: `rotate(-90,${tick.text.getBBox().x + tick.text.getBBox().width/2},${tick.text.getBBox().y + tick.text.getBBox().height/2})`
     });
    }
    return tick;
   }

   let multiplier = [2,2.5,2];

   let mzTickSize = Math.pow(10,-par.mzPrecision)/2;
   let iMzMulti = 0;
   while (mzSpan/mzTickSize > par.xTickMaxMajor) {
    mzTickSize *= multiplier[iMzMulti];
    iMzMulti = (iMzMulti+1)%multiplier.length;
   }
   let mzSubTickSize = mzTickSize/5;
   let mzTick = mzTickSize*(((mzMin/mzTickSize) >> 0) + 1);
   for (let s = 1; s <= 4; s++) {
    let mzSubTick = mzTick-s*mzSubTickSize;
    if (mzSubTick >= mzMin) tX(mzSubTick,false);
   }
   for (; mzTick <= mzMax; mzTick += mzTickSize) {
    tX(mzTick,true);
    for (let s = 1; s <= 4; s++) {
     let mzSubTick = mzTick+s*mzSubTickSize;
     if (mzSubTick <= mzMax) tX(mzSubTick,false);
    }
   }

   if (par.yTicksRelative) {
    tY(intMax,true);      //Major
    tY(intMax*0.95,false);
    tY(intMax*0.90,false);
    tY(intMax*0.85,false);
    tY(intMax*0.80,true); //Major
    tY(intMax*0.75,false);
    tY(intMax*0.70,false);
    tY(intMax*0.65,false);
    tY(intMax*0.60,true); //Major
    tY(intMax*0.55,false);
    tY(intMax*0.50,false);
    tY(intMax*0.45,false);
    tY(intMax*0.40,true); //Major
    tY(intMax*0.35,false);
    tY(intMax*0.30,false);
    tY(intMax*0.25,false);
    tY(intMax*0.20,true); //Major
    tY(intMax*0.15,false);
    tY(intMax*0.10,false);
    tY(intMax*0.05,false);
    tY(0,true);           //Major
   }
   else {
    let intTickSize = 50;
    let iIntMulti = 0;
    while (intSpan/intTickSize > par.yTickMaxMajor) {
     intTickSize *= multiplier[iIntMulti];
     iIntMulti = (iIntMulti+1)%multiplier.length;
    }
    let intSubTickSize = intTickSize/5;
    let intTick = intTickSize*(((intMin/intTickSize) >> 0) + 1);
    for (let s = 1; s <= 4; s++) {
     let intSubTick = intTick-s*intSubTickSize;
     if (intSubTick >= intMin) tY(intSubTick,false);
    }
    for (; intTick <= intMax; intTick += intTickSize) {
     tY(intTick,true);
     for (let s = 1; s <= 4; s++) {
      let intSubTick = intTick+s*intSubTickSize;
      if (intSubTick <= intMax) tY(intSubTick,false);
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
     'font-size': par.labelFontSize,
     fill: palette[label.ion.col],
     visibility: 'hidden'
    });
    this.graphic.append(label.text1);
    if (par.labelShowMasses) {
     label.text2 = SVG.createText(ion.mz.toFixed(par.mzPrecision),{
      x: 0,
      y: 0,
      'text-anchor' : 'start',
      'font-size': par.labelFontSize,
      fill: palette[label.ion.col],
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
      stroke : par.peakUseAnnotationCols ? palette[ion.col] : palette[0],
      'stroke-width' : par.peakStrokeWidth
     });
     peak.ion = ion;
     this.graphic.append(peak);
    });
   }

   if (labels.length) {
    let labelReqHeight = Math.max(...labelHeights)*(1+par.labelBorderPaddingPct/100);
    let labelReqWidth = Math.max(...labelWidths)*(1+par.labelBorderPaddingPct/100);
    let labelYPadding = labelReqHeight*0.1;
    let cells = [];
    let generateCells = () => {
     cells = [];
     for (let colLeft = cX(oX + pWidth - labelReqWidth); (colLeft-labelReqWidth/4) >= cX(oX); colLeft-=labelReqWidth/4) {
      let colIonPeakTop = cYPlot(Math.max(oY,...figureIons
                                        .filter(ion => ((cXPlot(ion.mz) >= (colLeft-labelReqWidth/8)) && (cXPlot(ion.mz) <= (colLeft+labelReqWidth*9/8))))
                                        .map(ion => ion.int)));
      for (let rowBase = cY(oY + pHeight - labelReqHeight); (rowBase + labelYPadding) <= colIonPeakTop; rowBase += (labelReqHeight + labelYPadding)) {
       let adjToRight = cells.filter(cell => cell.cy==rowBase && cell.cx < colLeft+labelReqWidth);
       cells.push({ cx: colLeft, 
                    cy: rowBase, 
                    cxmid: colLeft+labelReqWidth/2, 
                    cymid: rowBase-labelReqHeight/2,
                    adjToRight: adjToRight || [],
                    free: true
                   });
      }
     }
    } 
    generateCells();
    //Find a scaling value for the spectrum that allows all required labels to be displayed
    //Not used (confusing interaction with setting mz and int display ranges)
    // while(xScale > 0.5) {
    //  generateCells();
    //  if (cells.length >= labels.length) break;
    //  else {
    //   xScale -= 0.05;
    //   yScale -= 0.05;
    //  }
    // }

    //Find a font size for the spectrum that allows all required labels to be displayed
    let fontSize = par.labelFontSize - 0.5;
    if (cells.length < labels.length) {
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
      labelReqHeight = Math.max(...labelHeights)*(1+par.labelBorderPaddingPct/100);
      labelReqWidth = Math.max(...labelWidths)*(1+par.labelBorderPaddingPct/100);
      generateCells();
      if (cells.length >= labels.length) break;
      else {
       fontSize -= 0.5;
      }
     }
    }

    drawPeaks();

    // //Debug - possible label locations
    // cells.forEach(cell => {
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
     // return (Math.pow(xd,2) + Math.pow(yd < 0 ? yd : 10*yd,2));
     // return (Math.pow(xd*2,2) + Math.pow(yd,2));
     return (Math.pow(xd,2) + Math.pow(yd,2));
    }

    let getBestFreeCellIndex = (cx,cy) => {
     return cells.reduce(([m,mi],cell,i) => {
      if (cell.free && cell.adjToRight.every(adjCell => adjCell.free)) {
       let d = Math.sqrt(getWeightedDistanceSq(cell.cxmid,cx,cell.cymid,cy));
       if (d < m) return [d,i];
      }
      return [m,mi];
     },[Infinity,null])[1];
    }

    labels.sort((a,b) => a.ion.mz - b.ion.mz);

    // labels = labels.slice(0,1);
    
    labels.forEach((label,i) => {
     label.cell = cells[getBestFreeCellIndex(cXPlot(label.ion.mz),cYPlot(label.ion.int))];
     label.cell.txt = label.text1.textContent;
     label.cell.free = false;
     label.cell.adjToRight.forEach(cell => cell.free = false);
    });

    let getTotalDistance = () => {
     let total = 0;
     for (let i = 0; i < labels.length; i++) {
      total += getWeightedDistanceSq(labels[i].cell.cxmid,cXPlot(labels[i].ion.mz),labels[i].cell.cymid,cYPlot(labels[i].ion.int));
     }
     return Math.sqrt(total);
    }

    let distance = getTotalDistance();
    for (let n = 0; n <= labels.length*0; n++) {
     labels.sort(() => 0.5 - Math.random());
     labels[0].cell.free = true;
     labels[0].cell.adjToRight.forEach(cell => cell.free = true);
     let oldCell = labels[0].cell;
     labels[0].cell = labels[1].cell;
     labels[1].cell = cells[getBestFreeCellIndex(cXPlot(labels[1].ion.mz),cYPlot(labels[1].ion.int))];
     let newDistance = getTotalDistance();
     if (newDistance < distance) {
      labels[1].cell.free = false;
      labels[1].cell.adjToRight.forEach(cell => cell.free = true);
      distance = newDistance;
     }
     else { //revert
      labels[1].cell = labels[0].cell;
      labels[0].cell = oldCell;
      labels[0].cell.free = false;
      labels[0].cell.adjToRight.forEach(cell => cell.free = false);
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
      stroke: palette[label.ion.col],
      'stroke-width' : par.labelStrokeWidth,
      'stroke-dasharray': `${par.labelStrokeWidth*2},${par.labelStrokeWidth*2}`
     });
     label.indicator = SVG.createElement('line',{
      x1 : sideLR ? cellBoundaryX : label.cell.cxmid - getTextWidth(label)/2*1.03,
      y1 : sideLR ? label.cell.cymid - getTextHeight(label)/2 : cellBoundaryY,
      x2 : sideLR ? cellBoundaryX : label.cell.cxmid + getTextWidth(label)/2*1.02,
      y2 : sideLR ? label.cell.cymid + getTextHeight(label)/2 : cellBoundaryY,
      stroke: palette[label.ion.col],
      'stroke-width' : par.labelStrokeWidth
     });
     label.indicatorWing1 = SVG.createElement('line',{
      x1 : sideLR ? cellBoundaryX: label.cell.cxmid - getTextWidth(label)/2*1.03,
      y1 : sideLR ? label.cell.cymid - getTextHeight(label)/2 : cellBoundaryY,
      x2 : sideLR ? cellBoundaryX - indicWingOffset: label.cell.cxmid - getTextWidth(label)/2*1.03,
      y2 : sideLR ? label.cell.cymid - getTextHeight(label)/2 : cellBoundaryY - indicWingOffset,
      stroke: palette[label.ion.col],
      'stroke-width' : par.labelStrokeWidth
     });
     label.indicatorWing2 = SVG.createElement('line',{
      x1 : sideLR ? cellBoundaryX: label.cell.cxmid + getTextWidth(label)/2*1.02,
      y1 : sideLR ? label.cell.cymid + getTextHeight(label)/2 : cellBoundaryY,
      x2 : sideLR ? cellBoundaryX - indicWingOffset: label.cell.cxmid + getTextWidth(label)/2*1.02,
      y2 : sideLR ? label.cell.cymid + getTextHeight(label)/2 : cellBoundaryY - indicWingOffset,
      stroke: palette[label.ion.col],
      'stroke-width' : par.labelStrokeWidth
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
        'font-size': par.headerFontSize,
        fill: palette[par.headerCol],
        visibility: 'hidden'
       });
       this.graphic.append(glyph.text1);
       if ('note' in residue.symbol) {
        glyph.text2 = SVG.createText(residue.symbol.note,{
         x: 0,
         y: 0,
         'text-anchor' : 'start',
         'font-size': par.headerNoteFontSize,
         fill: palette[par.headerCol],
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
       'font-size': par.headerNoteFontSize,
       'letter-spacing': -0.75,
       fill: palette[label.ion.col],
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
     'font-size': par.headerFontSize,
     fill: palette[par.headerCol],
     visibility: 'hidden'
    });
    this.graphic.append(dummyText.text1);
    dummyText.text2 = SVG.createText('xxx',{
     x: 0,
     y: 0,
     'text-anchor' : 'start',
     'font-size': par.headerNoteFontSize,
     fill: palette[par.headerCol],
     visibility: 'hidden'
    });
    this.graphic.append(dummyText.text2);

    let glyphReqWidth = Math.max(getTextWidth(dummyText))*(1+par.headerGlyphPaddingPct/100);
    let glyphReqHeight = Math.max(getTextHeight(dummyText))*(1+par.headerGlyphPaddingPct/100);

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
    info.text1 = SVG.createText(`Precursor Mass: ${mass.toFixed(par.mzPrecision)} (${mz.toFixed(par.mzPrecision)} m/z, ${this.aS.peptide.charge}+)`,{
     x: 0,
     y: 0,
     'text-anchor' : 'start',
     'font-size': par.headerFontSize,
     fill: palette[par.headerCol],
     visibility: 'hidden'
    });
    this.graphic.append(info.text1);
    info.text2 = SVG.createText(`Highest Intensity: ${intMax.toExponential(par.intPrecision).replace('e+','e')}`,{
     x: 0,
     y: 0,
     'text-anchor' : 'start',
     'font-size': par.headerFontSize,
     fill: palette[par.headerCol],
     visibility: 'hidden'
    });
    this.graphic.append(info.text2);
    let tic = scan.totalCurrent;
    if (tic) {
     info.text3 = SVG.createText(`Total Intensity: ${tic.toExponential(par.intPrecision).replace('e+','e')}`,{
      x: 0,
      y: 0,
      'text-anchor' : 'start',
      'font-size': par.headerFontSize,
      fill: palette[par.headerCol],
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
      'font-size': par.headerFontSize,
      fill: palette[par.headerCol],
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
    
    let extraSpace = (this.aS.peptide.chains[0].nOfType > 1 ? 1 : 0)
    let headerNumSpacesRequired = maxChainExtent + extraSpace;

    let headerXSpacing = headerWidth / headerNumSpacesRequired;
    if (headerXSpacing > par.headerMaxXSpacing) headerXSpacing = par.headerMaxXSpacing;
    let headerXMargin = (headerWidth - ( headerXSpacing * headerNumSpacesRequired ))/2;

    let headerYSpacing = (headerHeight-infoHeight) / (this.aS.peptide.chains.length + 1);
    let ionTypeOrder = ['c','b','a','x','y','z'];

    let getHeaderTopLineForChain = chain => infoHeight + headerYSpacing*(3/4) + chain*headerYSpacing;
    let getPositionLeftForChain = (chain,position) => headerXMargin + (relativeToLeftmostChainStart[chain] + position + extraSpace)*headerXSpacing;

    branchLines.forEach(branchLine => {
     let line = SVG.createElement('line',{
      x1: getPositionLeftForChain(branchLine.from.chain,branchLine.from.position) + headerXSpacing/2,
      y1: getHeaderTopLineForChain(branchLine.from.chain),
      x2: getPositionLeftForChain(branchLine.to.chain,branchLine.to.position) + headerXSpacing/2,
      y2: getHeaderTopLineForChain(branchLine.to.chain)+glyphReqHeight,
      stroke: palette[par.branchCol],
      'stroke-width' : par.branchStrokeWidth,
      fill: 'none'
     });
     this.graphic.append(line);
     let topRect = SVG.createElement('rect',{
      x: getPositionLeftForChain(branchLine.to.chain,branchLine.to.position),
      y: getHeaderTopLineForChain(branchLine.to.chain),
      width: headerXSpacing,
      height: glyphReqHeight,
      stroke: 'none',
      'stroke-width' : par.headerStrokeWidth,
      fill: palette[par.branchCol]
     });
     this.graphic.append(topRect);
     let bottomRect = SVG.createElement('rect',{
      x: getPositionLeftForChain(branchLine.from.chain,branchLine.from.position),
      y: getHeaderTopLineForChain(branchLine.from.chain),
      width: headerXSpacing,
      height: glyphReqHeight,
      stroke: 'none',
      'stroke-width' : par.headerStrokeWidth,
      fill: palette[par.branchCol]
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
       'font-size': par.headerFontSize,
       fill: palette[par.headerCol],
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
       fill: palette[par.chainLabelBgCol]
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
          'font-size': par.headerNoteFontSize,
          'letter-spacing': -0.75,
          fill: palette[par.headerCol],
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
           stroke: palette[par.headerCol],
           'stroke-width' : par.headerStrokeWidth
          }));
          this.graphic.append(cleavages[i][position][isDescNumeric].upperTail = SVG.createElement('line',{
           x1: x,
           y1: y,
           x2: x + glyphReqWidth*(3/16),
           y2: y - glyphReqWidth/4,
           stroke: palette[par.headerCol],
           'stroke-width' : par.headerStrokeWidth
          }));
         }
         else {
          if (!((position+1) in cleavages[i]) || !cleavages[i][(position+1)][1]) {
           this.graphic.append(SVG.createElement('line',{
            x1: x + headerXSpacing,
            y1: y,
            x2: x + headerXSpacing,
            y2: y + glyphReqHeight,
            stroke: palette[par.headerCol],
            'stroke-width' : par.headerStrokeWidth
           }));
          }
          this.graphic.append(SVG.createElement('line',{
           x1: x + headerXSpacing,
           y1: y + glyphReqHeight,
           x2: x + headerXSpacing - glyphReqWidth*(3/16),
           y2: y + glyphReqHeight + glyphReqWidth/4,
           stroke: palette[par.headerCol],
           'stroke-width' : par.headerStrokeWidth
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
  svgText = svgText.replace(/font-family="[^"]+"/,`font-family="${this.aS.params.fontFamily}"`)
  svgText = svgText.replace(/(<svg [^>]+>)/,'$1'+`<defs><style><![CDATA[${spc.UI.components.fonts.atRule(this.aS.params.fontFamily)}]]></style></defs>`)
  return svgText;
 }

 return _AsFigure;
}();

//  Array.from(this.node.querySelectorAll('[class]')).forEach(ele => {
//   spc.UI.assignHandles(this.as,ele);
//  });