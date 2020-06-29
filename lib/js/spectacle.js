import '../../../mslib/v2/js/mslib.js';

import * as spc from './spc/_index.js';
self.spc = spc;

window.addEventListener('load', function() {
 window.spectacleApp = new spc.App(document.querySelector('#spectacle'))
});