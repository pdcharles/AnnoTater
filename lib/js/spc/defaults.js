export let defaults = function () {
 
 return {
  elements: {},
  aminoacids: {
   //example (some common modifications are already defined in mslib)
   // C': mslib.moietymath.add(mslib.constants.RESIDUES.AMINOACIDS.CYSTEINE,
   //  { atoms: {
   //     CARBON: 8,
   //     HYDROGEN: 10,
   //     SULPHUR: -1
   //  } },'xC')
  },
  monosaccharides: {},
  modifications: {
   //example (some common modifications are already defined in mslib)
   /*
   OXIDATION:  {  
    token: 'ox',
    symbol: {
     text: 'ox',
     display: 'text'
    },
    allowedResidues: ['M'],
    atoms: {
            O: 1
           },
    caption: 'Oxidation'
   }
   */
  },
  crosslinkTypes: {
   'Amide Bond': {
    symbol: {
     text: '-[H2O]',
     display: 'text'
    },
    atoms: {
     H: -2,
     O: -1
    } 
   }
  },
  //Paul Tol
  palette: ['#000000','#bbbbbb', '#cc3311', '#0077bb', '#ee7733', '#009988',  '#33bbee',  '#ee3377'],
  //         black     grey       red        blue       orange     teal       cyan         magenta
  annotationParams: {
   autoAnnotate: true,
   tolerance: 20,
   override: {},
   zoom: {full: 'both'},
  
   ionTypeShown: ['y','b','p','i'],
   ionTypeCol: { b: 3, y: 2, a: 5, x: 4, c: 7, z: 6, p: 0, i: 0 },
   seriesIonCharges: [1,2],
   smartFilter: true,

   fontFamily: 'Roboto',
   mzPrecision: 2,
   intPrecision: 2,

   headerHeightPct: 35,
   headerFontSize: 30,
   headerNoteFontSize: 17,
   headerCol: 0,
   headerGlyphPaddingPct: 5,
   headerStrokeWidth: 2,
   headerMaxXSpacing: 100,

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
  }
 }

}()