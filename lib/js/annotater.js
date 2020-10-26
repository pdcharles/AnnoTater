import '../../../mslib/v2/js/mslib.bundle.js';

import './ttrlib.bundle.js'

window.addEventListener('load', function() {
 window.annotaterApp = new ttrlib.App(document.querySelector('#annotater'))
});