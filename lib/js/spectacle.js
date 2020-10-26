import '../../../mslib/v2/js/mslib.js';

import './spc.js'

window.addEventListener('load', function() {
 window.spectacleApp = new spc.App(document.querySelector('#spectacle'))
});