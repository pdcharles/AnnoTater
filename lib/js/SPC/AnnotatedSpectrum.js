export let AnnotatedSpectrum = function() {

 let _AnnotatedSpectrum = function(app,data) {
  this.app = app;
  this.sourceDetails = {};
  this.ions = null;
  this.peptide = null;
  this.displayParams = { 
   axisLeftWidth : 10,
   axisBottomHeight : 10,
   headerHeight: 20,
   axisColour: 'black',
   axisStrokeWidth: 3,
   peakColour: 'black',
   peakStrokeWidth: 2,
   labelFontSize: '8pt',
   labelOffset: 3,
   fontFamily : this.app.ui.fontFamily,
   colours : ['black'],
   mzRange : { min : null , max : null } 
  };
  this.figure = new spc.UI.components.AsFigure(this);
 }

 _AnnotatedSpectrum.prototype.toJSON = function() {
  return {spectrum: this.ions, peptide: this.peptide, displayParams : this.displayParams};
 }

 _AnnotatedSpectrum.prototype.setSpectralData = function(sourceDetails) {
  this.sourceDetails = sourceDetails;
  let source = this.app.sources.get(this.sourceDetails.name);
  if (source.fileType == 'mzML' || source.fileType == 'mzXML') {
   source.fetchScanHeader(this.sourceDetails.scanNumber,true)
   .then(() => {
    this.ions = source.currentScanSpectrum.mzs.reduce((obj,mz,i,arr) => { obj[mz] = { intensity : source.currentScanSpectrum.ints[i], label : null, showLabel : true, col : 0 }; return obj },{});
    this.displayParams.mzRange = this.sourceDetails.mzRange = { min : Math.min(...source.currentScanSpectrum.mzs),  max : Math.max(...source.currentScanSpectrum.mzs) }
    this.displayParams.intRange = this.sourceDetails.intRange = { min : Math.min(...source.currentScanSpectrum.ints),  max : Math.max(...source.currentScanSpectrum.ints) }
    this.figure.update()
   });
  }
  console.log(this);
 // annotateSpectrum.call(this);
 }

 _AnnotatedSpectrum.prototype.setAnnotation = function(peptide,ppmTol) {
  if (ppmTol === undefined) ppmTol = 100;
  this.peptide = peptide;
  annotateSpectrum.call(this);
 }

 let autoAnnotate = function() {
  if (this.sourceName && this.peptide) {
   let lowerBound = this.mzRange.min-mslib.math.ppmError(this.mzRange.min,ppmTol)
   let upperBound = this.mzRange.max+mslib.math.ppmError(this.mzRange.max,ppmTol)
   let productMasses = peptide.productMasses.filter(([annotation,pmz]) => (lowerBound <= pmz) && (pmz <= upperBound));
   this.assignedAnnotations = {};
   Object.entries(this.ions).forEach(([mz,ion]) => {
    let mzLow = +mz-mslib.math.ppmError(mz,ppmTol) 
    let mzHi = +mz+mslib.math.ppmError(mz,ppmTol)
    let possibleProducts = productMasses.filter(([product,pmz]) => (mzLow <= pmz) && (pmz <= mzHi));
    if (possibleProducts.length) {
     let matchedAnnotation = possibleProducts.reduce((acc,[product,pmz]) => { 
                              let diff;
                              if ((diff = mslib.math.ppmDiff(mz,pmz)) < acc[2]) acc = [product,pmz,diff]; 
                              return acc 
                             } ,['',0,1e7])[0];
     if (!this.assignedAnnotations[matchedAnnotation] || this.assignedAnnotations[matchedAnnotation].intensity < ion.intensity ) {
      this.assignedAnnotations[matchedAnnotation] = ion;
     }
    }
   });
  }
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
 
 return _AnnotatedSpectrum;
}();
