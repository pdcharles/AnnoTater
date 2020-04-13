export let defaults = function () {
 
 return {
  fixedModifications : {
   C : 'cam'
  },
  modifications : {
   Oxidation :  {
          token : 'ox',
          symbol : {
           text : 'ox',
           display : 'text'
          },
          atoms : {
                   OXYGEN : 1
                  }
         },
   Carbamidomethylation : {
          token : 'cam',
          symbol : {
           text : 'cam',
           display : 'text'
          },
          atoms : {
                   CARBON : 2,
                   HYDROGEN : 3,
                   NITROGEN : 1,
                   OXYGEN : 1
                  } 
         },
  },
  crosslinkTypes : {
   NeissLock : {
    symbol : {
     text : '-[H2O]',
     display : 'text'
    },
    atoms : {
     HYDROGEN : -2,
     OXYGEN : -1
    } 
   }
  },
  customResidues : {
   AMINOACIDS : {
    xC : mslib.data.Moiety.add(mslib.constants.RESIDUES.AMINOACIDS.CYSTEINE,
                                   { atoms : {
                                      CARBON : 8,
                                      HYDROGEN : 10,
                                      SULPHUR : -1
                                   } },'xC')
   }
  }
 }

}()