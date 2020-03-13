export let App = function () {
 
 let _App = function(elementRoot) {
  this.fileSelections = [];
  this.sources = new Map();
  this.annotatedSpectra = [];

  
  this.definitions = {
   elements : mslib.constants.ELEMENTS,
   aminoacids : mslib.constants.RESIDUES.AMINOACIDS,
   monosaccharides : mslib.constants.RESIDUES.MONOSACCHARIDES,
   modifications : spc.defaults.modifications
  }
  //load spc.defaults.customResidues;

  this.elementRoot = elementRoot;
  this.ui = new spc.UI(this);
  spc.googleOAuth.init(this);


  this.readStateFromUrl();
  if (!this.annotatedSpectra.length) {
   this.annotatedSpectra.push(new spc.AnnotatedSpectrum(this));
   this.ui.aSIndex = 0;
  }
//  console.log('Started '+mslib.common.initWorkers(10)+' workers');
 }

 _App.prototype.readStateFromUrl = function() {
  let urlParams = new URLSearchParams(location.search);
  if (urlParams.has('d')) {
   try {
    let dataObj = JSON.parse(
                   mslib.dist.zlib.inflate(
                    atob(
                     decodeURIComponent(
                      urlParams.get('d')
                     )
                    ).split('').map(c => c.charCodeAt(0))
                   ,{to:'string'})
                  );
    console.log(dataObj);
    if ('annSpc' in dataObj) dataObj.annSpc.forEach(as => this.annotatedSpectra.push(new spc.AnnotatedSpectrum(this,as)));
    if ('modDef' in dataObj) this.modificationDefinitions = dataObj.modDef;
    if ('resDef' in dataObj) this.residueDefinitions = dataObj.resDef;
   }
   catch(e) {
    console.log('Warning: URL state interpretation threw error ('+e.message+')');
   }
  }
 }

 _App.prototype.getUrlFromState = function() {
  let baseUrl = document.location.protocol + '//' + document.location.hostname + document.location.pathname;
  let dataObj = { annSpc: this.annotatedSpectra, modDef: this.modificationDefinitions, resDef: this.residueDefinitions };
  console.log(baseUrl);
  console.log(dataObj);
  console.log(JSON.stringify(dataObj));
  console.log(mslib.dist.zlib.deflate(JSON.stringify(dataObj)));
  let d = encodeURIComponent(
           btoa(
            String.fromCharCode.apply(null,
             mslib.dist.zlib.deflate(
              JSON.stringify(dataObj)
             )
            )
           )
          );
  return(`${baseUrl}?d=${d}`)
 }

 _App.prototype.modificationObjToArr = function(modificationObject) {
  return Object.entries(modificationObject).map(([k,v]) => {
   return [k,v.token,this.atomsToString(v.atoms)];
  })
 }

 _App.prototype.atomsToString = function(atoms) {
  return Object.entries(atoms) 
  .sort((a,b) => a[0].localeCompare(b[0]))
  .map(([k,v]) => this.definitions.elements[k].token+v)
  .join('');
 }

 //_App.prototype.modArrayToObject = function(modObj,hasHeader) {
 // let a = [];
 // if (withHeader) {
 //  let header = ['Name','Token','Composition'];
 //  a.push(header);
 // }
 // Object.entries(modObj).forEach(([k,v]) => {
 //  a.push([k,v.token,this.atomsToString(v.atoms)]);
 // })
 // return a;
 //}

 _App.prototype.elementObjToArr = function(elementObject) {
  return Object.entries(elementObject).map(([k,v]) => {
   return [k,v.token,JSON.stringify(v.isotopes)];
  })
 }

 _App.prototype.elementArrToObj = function(elementArray) {
  return elementArray.reduce((o,r) => {
   o[r[0]] = {
    token : r[1],
    symbol : {
     text : r[1],
     display : 'text'
    },
    isotopes: JSON.parse(r[2])
   }
   return o;
  },{});
 }

 return _App;
}();