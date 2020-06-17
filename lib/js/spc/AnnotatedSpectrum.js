export let AnnotatedSpectrum = function() {

 let _AnnotatedSpectrum = function(app,data) {
  this.app = app;
  this.sourceDetails = {};
  this.ions = null;
  this.peptide = null;
  this.assignedAnnotationPpmTolerance = 20;
  this.displayParams = {
   fontFamily: 'Roboto',
   cols: ['#000000','#d3d3d3', '#ff0000', '#0000ff', '#800080', '#008000',  '#00ff80',  '#ff0080'],
   //     black     grey       red        blue       purple     darkgreen   lightgreen  pink
   mzPrecision: 2,
   intPrecision: 2,
   mzRange: { min: null , max: null },
   intRange: { min: null , max: null },
   ionTypes: ['y','b','p','i'],
   ionTypeCols: { b: 3, y: 2, a: 5, x: 4, c: 7, z: 6 },
   seriesIonCharges: [1,2],

   headerHeightPct: 35,
   headerFontSize: 30,
   headerNoteFontSize: 17,
   headerCol: 0,
   headerGlyphPaddingPct: 5,
   headerStrokeWidth: 2,

   branchStrokeWidth: 5,
   branchCol: 1,
   
   chainLabelBgCol: 1,

   axisMarginPctXAxis: 10,
   axisFontSize: '24pt',
   axisCol: 0,
   axisStrokeWidth: 2,
   axisPaddingPct: 5,
   xAxisLabel: 'm/z',
   yAxisLabel: 'Intensity',
   
   tickFontSize: '20pt',
   tickStrokeWidth: 2,
   tickLengthPctXAxis: 20,
   xTickMaxMajor: 10,
   yTickMaxMajor: 5,
   yTicksRelative: true,

   peakStrokeWidth: 1,
   peakUseAnnotationCols: false,

   labelFontSize: '16pt',
   labelOffset: 3,
   labelShowMasses: true,
   labelBorderPaddingPct: 25,
   labelStrokeWidth: 2,
  };
  this.figure = new spc.UI.components.AsFigure(this);
 }

 _AnnotatedSpectrum.prototype.toJSON = function() {
  return {spectrum: this.ions, peptide: this.peptide, displayParams: this.displayParams};
 }

 let ion = function(mz,int) {
  this.mz = mz;
  this.int = int;
  this.annotation = null;
  this.drawLabel = true;
  this.col = 0;
 }

 _AnnotatedSpectrum.prototype.setSpectralData = function(sourceDetails) {
  this.sourceDetails = sourceDetails;
  let source = this.app.sources.get(this.sourceDetails.name);
  if (source.fileType == 'mzML' || source.fileType == 'mzXML') {
   source.fetchScanHeader(this.sourceDetails.scanNumber,true)
   .then(() => {
    this.ions = source.currentScanSpectrum.mzs.reduce((obj,mz,i,arr) => { obj[mz] = new ion(mz,source.currentScanSpectrum.ints[i]); return obj },{});
    this.sourceDetails.mzRange = { min: Math.min(...source.currentScanSpectrum.mzs),  max: Math.max(...source.currentScanSpectrum.mzs) }
    this.sourceDetails.intRange = { min: Math.min(...source.currentScanSpectrum.ints),  max: Math.max(...source.currentScanSpectrum.ints) }
    this.setRanges({full : 'both'})
    this.figure.draw()
   });
  }
 }

 _AnnotatedSpectrum.prototype.setPeptide = function(peptide) {
  this.peptide = peptide;
  peptide.calculate();
 }

 _AnnotatedSpectrum.prototype.resetIonCols = function() {
  Object.values(this.ions).forEach(ion => ion.col = 0);
 }

 _AnnotatedSpectrum.prototype.setIonColsByIonType = function() {
  Object.values(this.ions)
  .filter(ion => (ion.annotation != null))
  .forEach(ion => {
   if (Object.keys(this.displayParams.ionTypeCols).includes(this.peptide.productIons[ion.annotation].products[0].type)) {
    ion.col = this.displayParams.ionTypeCols[this.peptide.productIons[ion.annotation].products[0].type];
   }
  });
 }

 _AnnotatedSpectrum.prototype.removeLabelFilters = function() {
  Object.values(this.ions).forEach(ion => ion.drawLabel = true);
 }

 _AnnotatedSpectrum.prototype.filterLabelsByIonType = function() {
  Object.values(this.ions)
  .filter(ion => (ion.annotation != null) && ion.drawLabel)
  .forEach(ion => {
   if (!this.displayParams.ionTypes.includes(this.peptide.productIons[ion.annotation].products[0].type)) {
    ion.drawLabel = false;
   }
  });
 }

 _AnnotatedSpectrum.prototype.filterLabelsBySeriesIonCharge = function() {
  Object.values(this.ions)
  .filter(ion => (ion.annotation != null) && ion.drawLabel && 
                 this.peptide.productIons[ion.annotation].products[0].group == 'series')
  .forEach(ion => {
   if (!this.displayParams.seriesIonCharges.includes(this.peptide.productIons[ion.annotation].charge)) {
    ion.drawLabel = false;
   }
  });
 }

 _AnnotatedSpectrum.prototype.smartFilterLabels = function() {
  let labelledIons = Object.values(this.ions).filter(ion => (ion.annotation != null) && ion.drawLabel);
  labelledIons.forEach(thisIon => {
   let thisProductIon = this.peptide.productIons[thisIon.annotation];
   if (labelledIons
       .filter(ion => 
        this.peptide.productIons[ion.annotation].products[0].id == 
        thisProductIon.products[0].id)
       .some(ion =>
        this.peptide.productIons[ion.annotation].charge <
        thisProductIon.charge)
       ) {
    thisIon.drawLabel = false;
   }
   else if (thisProductIon.products[0].type.length > 1) {
    if (labelledIons
        .filter(ion => 
         this.peptide.productIons[ion.annotation].products[0].traversal.key == 
         thisProductIon.products[0].traversal.key)
        .some(ion =>
         this.peptide.productIons[ion.annotation].products[0].type.length <
         thisProductIon.products[0].type.length)
        ) {
     thisIon.drawLabel = false;
    }
   }
  });
 }

 _AnnotatedSpectrum.prototype.clearAnnotation = function() {
  Object.values(this.ions).forEach(ion => ion.annotation = null);
 }

 _AnnotatedSpectrum.prototype.autoAnnotate = function(ppmTol) {
  if (this.sourceDetails && this.peptide) {
   if (!ppmTol) {
    ppmTol = this.assignedAnnotationPpmTolerance;
   }
   this.assignedAnnotationPpmTolerance = ppmTol;
   let assignedAnnotations = {};
   let lowerBound = this.sourceDetails.mzRange.min-mslib.math.ppmError(this.sourceDetails.mzRange.min,ppmTol)
   let upperBound = this.sourceDetails.mzRange.max+mslib.math.ppmError(this.sourceDetails.mzRange.max,ppmTol)
   let visibleProductIons = Object.entries(this.peptide.productIons).filter(([notation,pIon]) => (lowerBound <= pIon.mzs[1]) && (pIon.mzs[0] <= upperBound));
   Object.entries(this.ions).forEach(([mz,ion]) => {
    let mzLow = +mz-mslib.math.ppmError(mz,ppmTol) 
    let mzHi = +mz+mslib.math.ppmError(mz,ppmTol)
    let matchableProductIons = visibleProductIons.filter(([notation,pIon]) => (mzLow <= pIon.mzs[1]) && (pIon.mzs[0] <= mzHi));
    if (matchableProductIons.length) {
     let matchedNotation = matchableProductIons.reduce((acc,[notation,pIon]) => { 
                              let diff;
                              if ((diff = mslib.math.ppmDiff(mz,pIon.mzs[0])) < acc[1] ||
                                  (diff = mslib.math.ppmDiff(mz,pIon.mzs[1])) < acc[1]
                                 ) acc = [notation,diff];
                              return acc;
                             } ,[null,Infinity])[0];
     if (!(matchedNotation in assignedAnnotations) || assignedAnnotations[matchedNotation].int < ion.int ) {
      assignedAnnotations[matchedNotation] = ion;
     }
    }
   });
   Object.entries(assignedAnnotations).forEach(([notation,ion]) => {
    this.ions[ion.mz].annotation = notation;
   });
  }
 }

 _AnnotatedSpectrum.prototype.setRanges = function(params) {
  if (this.ions) {
   if ('full' in params) {
    if (params.full == 'both' || params.full == 'mz') {
     let padding = (this.sourceDetails.mzRange.max - this.sourceDetails.mzRange.min)*this.displayParams.axisPaddingPct/100;
     this.displayParams.mzRange = { 
      min: Math.max(this.sourceDetails.mzRange.min - padding,0),
      max: this.sourceDetails.mzRange.max + padding
     }
    }
    if (params.full == 'both' || params.full == 'int') {
     let padding = this.displayParams.yTicksRelative ? 0 : (this.sourceDetails.intRange.max - this.sourceDetails.intRange.min)*this.displayParams.axisPaddingPct/100;
     this.displayParams.intRange = {
      min: 0, 
      max: this.sourceDetails.intRange.max + padding
     }
    }
   }
   if ('zoom' in params) {
    if (Object.values(this.ions).filter(ion => (ion.annotation != null) && ion.drawLabel).length) {
     if (params.zoom == 'both' || params.zoom == 'mz') {
      let mzs = Object.values(this.ions).filter(ion => (ion.annotation && ion.drawLabel)).map(ion => ion.mz);
      let [labelMzMin,labelMzMax] = [Math.min(...mzs),Math.max(...mzs)];
      let padding = (labelMzMax - labelMzMin)*this.displayParams.axisPaddingPct/100;
      this.displayParams.mzRange = { 
       min: Math.max(labelMzMin - padding,0),
       max: labelMzMax + padding
      }
     }
     if (params.zoom == 'both' || params.zoom == 'int') {
      let ints = Object.values(this.ions)
                 .filter(ion => ion.mz >= this.displayParams.mzRange.min &&
                                ion.mz <= this.displayParams.mzRange.max)
                 .map(ion => ion.int);
      let [labelIntMin,labelIntMax] = [Math.min(...ints),Math.max(...ints)];
      let padding = this.displayParams.yTicksRelative ? 0 : (labelIntMax - labelIntMin)*this.displayParams.axisPaddingPct/100;
      this.displayParams.intRange = { 
       min: 0,
       max: labelIntMax + padding
      }
     }
    }
   }
   if ('custom' in params) {
    if ('mz' in params.custom) {
     let padding = (params.custom.mz.max - params.custom.mz.min)*this.displayParams.axisPaddingPct/100;
     this.displayParams.mzRange = { 
      min: Math.max(params.custom.mz.min - padding,0),
      max: params.custom.mz.max + padding
     }
    }
    if ('int' in params.custom) {
     let padding = this.displayParams.yTicksRelative ? 0 : (params.custom.int.max - params.custom.int.min)*this.displayParams.axisPaddingPct/100;
     this.displayParams.intRange = { 
      min: Math.max(params.custom.int.min - padding,0),
      max: params.custom.int.max + padding
     }
    }
   }
  }
  // console.log(this.displayParams.mzRange );
  // console.log(this.displayParams.intRange );
 }
 
 return _AnnotatedSpectrum;
}();
