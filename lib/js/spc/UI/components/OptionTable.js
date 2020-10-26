export let OptionTable = function() {

 let _OptionTable = function(data,types,headers,onChange) {
  this.node = document.createElement('table');
  this.node.classList.add('spc_cls_optionTable');
  this.headers = headers;
  this.onChange = onChange;
  this.setData(data,types);
 }

 let getEmptyRow = function(types) {
  return types.map(t => t=='check' ? false : '');
 }

 let getRow = function(row,i,types) {
  let tr = document.createElement('tr');
  let rowData;
  types.forEach((t,j) => {
   let td = document.createElement('td');
   if (Array.isArray(t)) {
    let select = document.createElement('select');
    select.classList.add('spc_cls_optionTable_select');
    let optGroup = document.createElement('optGroup');

    let optionInitialSelection = document.createElement('option');
    optionInitialSelection.value = '';
    optionInitialSelection.disabled = true;
    optionInitialSelection.textContent = 'Select value...';
    if (row[j] == '') {
     optionInitialSelection.selected = true;
    }
    optGroup.append(optionInitialSelection);

    t.forEach((opt) => { 
     let option = document.createElement('option');
     option.value = (Array.isArray(opt) ? opt[0] : opt);
     if ((row[j] != '') && row[j] == (Array.isArray(opt) ? opt[0] : opt)) {
      option.selected = true;
     }
     option.textContent = Array.isArray(opt) ? opt[1] : opt;
     optGroup.append(option);
    });

    select.append(optGroup);
    select.cell = td;
    select.optionTable = this;
    td.append(select);
   }
   else if (t=='check') {
    let checkBox = document.createElement('input');
    checkBox.type = 'checkbox';
    checkBox.checked = row[0];
    checkBox.classList.add('spc_cls_optionTable_checkBox');
    checkBox.cell = td;
    checkBox.optionTable = this;
    td.append(checkBox);
   }
   else {
    td.contenteditable = true;
    td.classList.add('spc_cls_optionTable_cell');
    if (t=='code') td.classList.add('pre');
    td.append(document.createTextNode(row[j]));
    td.optionTable = this;
   }
   td.i = i;
   td.j = j;
   tr.append(td);
  });
  tr.lastElementChild.isEOR = true;
  return tr;
 }

 _OptionTable.prototype.update = function() {
  spc.UI.removeChildren(this.node);
  //console.log(this.data);
  let thead = document.createElement('thead');
  let headerRow = document.createElement('tr');
  this.headers.forEach(header => {
   let th = document.createElement('th');
   th.append(document.createTextNode(header));
   headerRow.append(th);
  });
  thead.append(headerRow);
  this.node.append(thead);
  let tbody = document.createElement('tbody');
  this.data.forEach((row,rowNumber) => tbody.append(getRow.call(this,row,rowNumber,this.types)));
  let lastRow = getRow.call(this,getEmptyRow(this.types),this.data.length,this.types);
  tbody.append(lastRow);
  this.node.append(tbody);
  let div = document.createElement('div');
  div.classList.add('spc_cls_optionTable_plus')
  div.textContent = '+';
  div.optionTable = this;
  this.node.append(div);
  Array.from(this.node.querySelectorAll('[class]')).forEach(ele => { if(!ele.id) spc.UI.assignHandles(this,ele) } );
 }

 _OptionTable.prototype.setData = function(data,types) {
  this.types = types;
  this.data = data;
  this.update();
 }

 _OptionTable.prototype.setDataValue = function(i,j,value) {
  if (value.length) {
   if (this.data[i]) this.data[i][j] = value;
   else {   
    this.data[i] = getEmptyRow(this.types)
    this.data[i][j] = value;
   }
  }
 }

 _OptionTable.prototype.commit = function(i) {
  if (i < (this.data.length-1)) {
   this.data.splice(i+1,0,getEmptyRow(this.types));
  }
  if (this.onChange instanceof Function) {
   this.onChange();
  }
  else {
   this.update()
  };
 }

 return _OptionTable;
}();