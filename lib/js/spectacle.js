import '../../../mslib/v2/js/mslib.js';

import './ttrlib.js'

window.addEventListener('load', function() {
 window.spectacleApp = new ttrlib.App(document.querySelector('#spectacle'))
});