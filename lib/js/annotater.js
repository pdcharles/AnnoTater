import '../../../mslib/v2/js/mslib.js';

import './ttrlib.js'

window.addEventListener('load', function() {
 window.annotaterApp = new ttrlib.App(document.querySelector('#annotater'))
});