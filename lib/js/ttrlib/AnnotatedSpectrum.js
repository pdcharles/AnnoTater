export let AnnotatedSpectrum = function() {

 let _AnnotatedSpectrum = function(app,json) {
  this.app = app;
  this.sourceDetails = {};
  this.ions = null;
  this.peptide = null;
  this.params = new ttrlib.MutableDefinition(ttrlib.defaults.annotationParams);
  this.figure = new ttrlib.UI.components.AsFigure(this);
  if (typeof(json) !== 'undefined') {
   this.sourceDetails = json[0];

   let peptideData = json[1];
   peptideData.chains.forEach(e => Object.entries(e[0].modificationDefinitions).forEach(([key,value]) => this.app.definitions.modifications[key] = value));
   peptideData.chains = peptideData.chains.map(e => 
    new mslib.data[e[1]]({
     sequenceString : e[0].sequenceString,
     residueDefinitions : {},
     modificationDefinitions : this.app.definitions.modifications,
     fixedModifications : e[0].fixedModifications,
     variableModifications : {}
    })
   );
   console.log(peptideData);
   this.setPeptide(new mslib.data.Peptide(peptideData));
   
   Object.entries(json[2]).forEach(([key,value]) => { if (key in this.params) this.params[key] = value });
  }
 }

 _AnnotatedSpectrum.prototype.toJSON = function() {
  return [Object.fromEntries(Object.entries(this.sourceDetails).filter(([key,value]) => !['mzRange','intRange'].includes(key))), 
          this.peptide, 
          this.params];
 }

 let ion = function(mz,int) {
  this.mz = mz;
  this.int = int;
  this.annotation = null;
  this.drawLabel = true;
  this.col = 0;
 }

 _AnnotatedSpectrum.prototype.setSpectralData = function(details) {
  this.sourceDetails = details;
  let source = this.app.sources.get(this.sourceDetails.name);
  (() => {
   if (source.fileType == 'mzML' || source.fileType == 'mzXML') {
    return source.fetchScanHeader(this.sourceDetails.scanNumber,true)
   }
  })().then(() => {
   this.ions = source.currentScanSpectrum.mzs.reduce((obj,mz,i,arr) => { obj[mz] = new ion(mz,source.currentScanSpectrum.ints[i]); return obj },{});
   this.sourceDetails.mzRange = { min: Math.min(...source.currentScanSpectrum.mzs),  max: Math.max(...source.currentScanSpectrum.mzs) }
   this.sourceDetails.intRange = { min: Math.min(...source.currentScanSpectrum.ints),  max: Math.max(...source.currentScanSpectrum.ints) }
   this.setParams();
  });
 }

 _AnnotatedSpectrum.prototype.setPeptide = function(peptide) {
  this.peptide = peptide;
  peptide.calculate();
 }

 _AnnotatedSpectrum.prototype.setParams = function(params) {
  if (typeof params !== 'undefined') Object.entries(params).forEach(([key,value]) => { if (key in this.params) this.params[key] = value });
  
  //Annotation
  Object.values(this.ions).forEach(ion => {
   if (ion.mz in this.params.override && this.params.override[ion.mz][2]) ion.annotation = this.params.override[ion.mz][2];
   else ion.annotation = null;
  });
  if (this.params.autoAnnotate) autoAnnotate.call(this);

  //Set Label Colour
  Object.values(this.ions).forEach(ion => ion.col = 0);
  Object.values(this.ions).filter(ion => (ion.annotation != null))
  .forEach(ion => {
   if (ion.mz in this.params.override) ion.col = this.params.override[ion.mz][1];
   else if (Object.keys(this.params.ionTypeCol).includes(this.peptide.productIons[ion.annotation].products[0].type)) {
    ion.col = this.params.ionTypeCol[this.peptide.productIons[ion.annotation].products[0].type];
   }
  });

  //Should Label Be Drawn?
  Object.values(this.ions).filter(ion => (ion.annotation != null))
  .forEach(ion => {
   if (ion.mz in this.params.override) ion.drawLabel = this.params.override[ion.mz][0];
   else {
    ion.drawLabel = this.params.ionTypeShown.includes(this.peptide.productIons[ion.annotation].products[0].type) 
                    && (this.peptide.productIons[ion.annotation].products[0].group == 'series'
                        ? this.params.seriesIonCharges.includes(this.peptide.productIons[ion.annotation].charge)
                        : true);
   }
  });

  //Smart Filter
  if (this.params.smartFilter) smartFilterLabels.call(this);

  this.figure.draw();
 }


 let smartFilterLabels = function() {
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
       && !(thisIon.mz in this.params.override)
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
        && !(thisIon.mz in this.params.override)
       ) {
     thisIon.drawLabel = false;
    }
   }
  });
 }

 let autoAnnotate = function() {
  if (this.sourceDetails && this.peptide) {
   let assignedAnnotations = {};
   let lowerBound = this.sourceDetails.mzRange.min-mslib.math.ppmError(this.sourceDetails.mzRange.min,this.params.tolerance)
   let upperBound = this.sourceDetails.mzRange.max+mslib.math.ppmError(this.sourceDetails.mzRange.max,this.params.tolerance)
   let visibleProductIons = Object.entries(this.peptide.productIons).filter(([notation,pIon]) => (lowerBound <= pIon.mzs[1]) && (pIon.mzs[0] <= upperBound));
   Object.entries(this.ions).forEach(([mz,ion]) => {
    let mzLow = +mz-mslib.math.ppmError(mz,this.params.tolerance);
    let mzHi = +mz+mslib.math.ppmError(mz,this.params.tolerance);
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

 return _AnnotatedSpectrum;
}();
