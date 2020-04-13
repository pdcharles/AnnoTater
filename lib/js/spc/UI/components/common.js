export let common = function() {

 let rejectAccept = function(node) {
  let reject = document.createElement('div');
  reject.appendChild(document.createTextNode('Cancel'));
  reject.classList.add('spc_cls_dialog_button','spc_cls_dialog_rejectButton');
  let accept = document.createElement('div');
  accept.appendChild(document.createTextNode('OK'));
  accept.classList.add('spc_cls_dialog_button','spc_cls_dialog_acceptButton');
  return([reject,accept]);
 }

 let separator = function() {
  let sep = document.createElement('div');
  sep.classList.add('spc_cls_dialog_divider');
  return(sep);
 }

 const LI = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce et orci eget enim semper gravida. Suspendisse est eros, dapibus imperdiet interdum sit amet, posuere ac nunc. Nunc convallis finibus sem ac posuere. Sed tincidunt est consectetur tellus hendrerit scelerisque. Fusce fringilla lacus tincidunt, posuere ante non, congue odio. Donec auctor placerat sodales. Cras varius maximus velit, dictum luctus tortor lobortis nec. Praesent eget sollicitudin urna. Nam vitae nibh id massa sagittis commodo. Nam eget nulla vulputate, placerat diam et, faucibus tortor. Donec viverra ante eros, in aliquet eros imperdiet ac. In hac habitasse platea dictumst. Vivamus ornare efficitur aliquet. Curabitur semper, dolor id tempus lacinia, nisl ex aliquet nibh, ac sagittis lectus nisi quis risus.',
  'Sed vel nunc auctor, rutrum nunc a, ultrices urna. Etiam a risus laoreet tellus porttitor pulvinar. In hac habitasse platea dictumst. Nulla non laoreet magna, sit amet finibus leo. Ut varius dapibus faucibus. Nunc et mi vitae magna tincidunt pellentesque a quis enim. Proin vel varius nisi. Aenean tortor nisi, venenatis a ornare vel, maximus a erat. Ut ultricies ex dignissim lacus aliquet pellentesque. Nunc a risus quis felis ultrices vestibulum.',
  'In sodales volutpat malesuada. Aliquam cursus id tellus ac malesuada. Phasellus enim diam, ultricies eleifend lobortis eu, convallis nec nisl. Proin vitae egestas purus. Quisque nunc diam, lacinia quis porttitor sed, semper id est. Maecenas viverra interdum velit, at aliquam dui sollicitudin eu. Maecenas quis mi ante. Donec quis arcu pharetra, aliquam ipsum eget, tincidunt nulla. Curabitur consequat nulla dictum ante pharetra gravida. Nullam ut pharetra dolor. Fusce molestie ante ut velit convallis, non accumsan orci vestibulum. Curabitur condimentum mauris leo, at porttitor eros ultrices et.',
  'In ac tortor arcu. Nam placerat tellus ipsum, nec faucibus mi imperdiet consequat. Vivamus volutpat nulla nisl, at lobortis urna blandit vel. Nulla nibh elit, aliquet et commodo vel, dapibus in lorem. Pellentesque ut sagittis dui. Ut libero ligula, pellentesque at finibus sit amet, gravida feugiat risus. Mauris et nibh in ante facilisis dignissim. Donec est orci, malesuada vitae ante ac, consectetur rhoncus justo. Integer maximus nunc eu tempus semper. Nulla facilisi. Mauris id dolor eu ex pulvinar dignissim sit amet quis eros. Donec congue metus a dapibus auctor. Nulla ornare accumsan ipsum vitae mattis.',
  'Nulla maximus nunc mauris, sit amet consequat sem blandit sed. Quisque convallis turpis sapien, sed aliquam mauris placerat at. Maecenas at turpis velit. Vestibulum nec pulvinar erat. Nam ut viverra massa. Fusce ultricies rhoncus ex at efficitur. Duis ut dolor nec lectus porta ultricies ut ac nisi. Integer eu congue ligula. Mauris vitae eros lobortis, condimentum massa eu, rutrum lorem. Pellentesque elementum diam sed turpis consectetur ornare.',
  'Quisque fringilla luctus convallis. Sed sed condimentum nibh, quis vulputate ex. Etiam diam purus, faucibus sit amet ex ut, hendrerit lobortis diam. Quisque semper sem ac dapibus auctor. Nullam feugiat accumsan sem, non tristique neque ultricies a. Maecenas commodo, magna vel pretium porta, nunc eros congue tortor, vel tempus enim elit pretium dolor. Donec id mattis dolor, sed tristique tortor. Duis et massa tempor, consectetur turpis nec, efficitur dolor. Sed at risus et velit ornare sagittis. Nullam dui ante, rhoncus at libero sit amet, rutrum viverra lorem. Etiam posuere ornare aliquam. Proin nisl ligula, gravida et aliquam ac, dictum eu quam. Vestibulum porta eros nibh, sed fringilla mi rutrum vitae.',
  'In tincidunt ligula eu venenatis vulputate. Sed imperdiet, orci vitae rhoncus mollis, dolor massa imperdiet erat, facilisis malesuada lorem libero sit amet turpis. Pellentesque vel venenatis mi. Aliquam suscipit elementum lacus nec volutpat. Duis pharetra sed dolor nec molestie. Curabitur ac leo mollis, ullamcorper velit porttitor, lobortis nulla. Integer accumsan luctus sapien eu tempor. Mauris eu tempus eros.',
  'Nam congue nibh mi, vehicula congue velit rutrum vitae. Fusce lacinia condimentum dapibus. Nullam interdum ligula quis malesuada pellentesque. Integer in vestibulum erat, a tincidunt sem. Aenean accumsan, lectus eu feugiat tempor, dui lectus sodales tortor, sed pretium lectus turpis viverra eros. Pellentesque venenatis, quam eget pretium placerat, urna est dapibus quam, in suscipit tortor felis vitae felis. Pellentesque blandit orci at sapien placerat lobortis. Donec faucibus eget elit quis sodales. Suspendisse pellentesque placerat libero id vulputate. Sed feugiat nibh sed augue semper, eu scelerisque nisl facilisis. Etiam tempor ex tellus, vel porttitor risus ultrices eget. Vivamus vehicula lorem id arcu finibus aliquam. Proin aliquam luctus risus et imperdiet.',
  'In hac habitasse platea dictumst. Aenean sed arcu massa. Aliquam ac nisi tortor. Integer euismod eu risus nec venenatis. Proin venenatis aliquet sem, eget efficitur orci pellentesque vitae. Praesent accumsan sit amet ex non consectetur. Sed feugiat mi et ipsum pulvinar, sit amet vestibulum ipsum blandit.',
  'Fusce vitae nunc venenatis, sollicitudin est posuere, tempor dui. Aenean vestibulum metus congue lectus luctus, sed tempor enim posuere. Aliquam sit amet purus in mi suscipit dictum. In urna ligula, tincidunt sodales diam eget, elementum varius purus. Donec aliquet ipsum ut enim blandit varius. Nulla rutrum, nunc quis laoreet feugiat, nibh nisi commodo est, in posuere justo ipsum quis lorem. Pellentesque id mi at est ullamcorper rhoncus quis non nulla. In dolor ex, ultricies vitae mauris id, tristique semper nunc.',
  'Duis ullamcorper tempor enim eu viverra. Donec a pharetra eros. Aliquam dapibus tortor vel est accumsan accumsan. Phasellus non condimentum urna. Vivamus id nibh convallis, molestie ligula ut, volutpat ipsum. Proin felis odio, tincidunt commodo porttitor ac, egestas quis augue. Sed commodo egestas purus a eleifend. Donec auctor lectus a mauris convallis scelerisque. Nullam ac ipsum eu enim scelerisque porttitor eu at purus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Duis mattis est vel lacus rutrum consequat sit amet vel lacus. Integer blandit risus nulla, nec lobortis nibh aliquet ut. Vivamus fermentum cursus felis, et bibendum urna congue non. Donec ultricies, purus eget cursus facilisis, augue leo sodales augue, ultricies pharetra lacus nunc ac nisl. Praesent pellentesque risus dictum, congue ante cursus, congue tortor.',
  'Suspendisse imperdiet, massa eu maximus luctus, erat eros viverra arcu, at feugiat mauris nisi id orci. Interdum et malesuada fames ac ante ipsum primis in faucibus. Morbi porttitor leo imperdiet cursus cursus. Donec non fringilla nunc. Nunc efficitur rutrum urna. Duis sit amet dictum leo. In libero ante, convallis eget ultrices at, ultrices non arcu.'
 ]

 let liIndex = 0;

 let loremIpsumText = function() {
  liIndex = (liIndex + 1) % LI.length
  return LI[liIndex];
 }

 return { 
  rejectAccept : rejectAccept,
  separator : separator,
  loremIpsumText : loremIpsumText
 };

}();
