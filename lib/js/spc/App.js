export let App = function () {
 
 let _App = function(elementRoot) {
  this.fileSelections = [];
  this.sources = new Map();
  this.annotatedSpectra = [];

  this.palette = spc.defaults.palette;

  this.definitions = {
   elements: new spc.MutableDefinition(mslib.constants.ELEMENTS),
   aminoacids: new spc.MutableDefinition(mslib.constants.RESIDUES.AMINOACIDS),
   monosaccharides: new spc.MutableDefinition(mslib.constants.RESIDUES.MONOSACCHARIDES),
   modifications: new spc.MutableDefinition(mslib.constants.MODIFICATIONS,spc.defaults.modifications),
   crosslinkTypes: new spc.MutableDefinition(spc.defaults.crosslinkTypes)
  }

  this.elementRoot = elementRoot;
  this.ui = new spc.UI(this);
  spc.googleOAuth.init(this);


  this.readStateFromUrl();
  if (!this.annotatedSpectra.length) {
   this.annotatedSpectra.push(new spc.AnnotatedSpectrum(this));
   this.ui.aSIndex = 0;
  }
  else {
   this.ui.launchDialog('app_load');
  }
//  console.log('Started '+mslib.common.initWorkers(10)+' workers');
 }

 const JSON_VERSION = 1;

 const SHORTHANDMAP = [
  ['"name"','"@f"'],
  ['"scanNumber"','"@n"'],
  ['"charge"','"@g"'],
  ['"chains"','"@i"'],
  ['"sequenceString"','"@t"'],
  ['"residueDefinitions"','"@r"'],
  ['"modificationDefinitions"','"@m"'],
  ['"fixedModifications"','"@x"'],
  ['"variableModifications"','"@v"'],
  ['"AminoAcidChain"','"@p"'],
  ['"MonosaccharideChain"','"@s"'],
  ['"atoms"','"@a"'],
  ['"branches"','"@b"'],
 ];
 if (SHORTHANDMAP.map(e => e[1]).some((e,i,a) => a.indexOf(e) != i)) throw new Error ('AppNonuniqueShorthand');

 _App.prototype.readStateFromUrl = function() {
  let urlParams = new URLSearchParams(location.search);
  if (urlParams.has('d')) {
   try {
    let str = mslib.dist.zlib.inflate(
               atob(
                decodeURIComponent(
                 urlParams.get('d')
                )
               ).split('').map(c => c.charCodeAt(0))
              ,{to:'string'});
    SHORTHANDMAP.forEach(e => { str = str.replace(new RegExp(e[1],'g'),e[0]) });
    console.log(str);
    let dataObj = JSON.parse(str);
    console.log(dataObj);
    let version = dataObj.shift();
    if (version != JSON_VERSION) throw new Error('JSON Version Mismatch');
    this.ui.aSIndex = dataObj.shift();
    dataObj.forEach(aSData => this.annotatedSpectra.push(new spc.AnnotatedSpectrum(this,aSData)));
   }
   catch(e) {
    console.log('Warning: URL state interpretation threw error ('+e.message+')');
   }
  }
 }

 _App.prototype.getUrlFromState = function() {
  let baseUrl = document.location.protocol + '//' + document.location.hostname + document.location.pathname;
  let dataObj = [JSON_VERSION,this.ui.aSIndex].concat(this.annotatedSpectra);
  // console.log(baseUrl);
  // console.log(dataObj);
  // console.log(JSON.stringify(dataObj));
  // console.log(mslib.dist.zlib.deflate(JSON.stringify(dataObj)));
  let str = JSON.stringify(dataObj);
  SHORTHANDMAP.forEach(e => { str = str.replace(new RegExp(e[0],'g'),e[1]) });
  console.log(str);
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