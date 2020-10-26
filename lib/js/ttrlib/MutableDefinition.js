export let MutableDefinition = function() {

 let _MutableDefinition = function() {
  Object.defineProperty(this, 'base', { value: {}, enumerable: false });
  [...arguments].forEach(b => Object.entries(b).forEach(([key,value]) => { if (key != 'base') this[key] = this.base[key] = value }));
 }
 _MutableDefinition.prototype.toJSON = function() {
  return Object.fromEntries(Object.entries(this).filter(([key,value]) => !(key in this.base) || JSON.stringify(this.base[key]) != JSON.stringify(value)));
 }

 return _MutableDefinition;
}();