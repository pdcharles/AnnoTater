export let OptionTable = function() {

 let _OptionTable = function(data,firstColCheckboxes) {
  this.node = document.createElement('table');
  this.node.classList.add('spc_cls_optionTable');
  this.setData(data,firstColCheckboxes);
 }

 let getRow = function(row,rowNumber,firstColCheckbox) {
  let tr = document.createElement('tr');
  let rowData;
  if (firstColCheckbox) {
   let checkBox = document.createElement('input');
   checkBox.setAttribute('type', 'checkbox');
   checkBox.setAttribute('checked', row[0]);
   checkBox.classList.add('spc_cls_optionTable_checkBox');
   checkBox.i = rowNumber+1;
   checkBox.j = 0;
   checkBox.optionTable = this;
   tr.append(checkBox);
  }
  (firstColCheckbox ? row.slice(1) : row).forEach((cell,colIndex) => {
   let td = document.createElement('td');
   td.append(document.createTextNode(cell));
   td.setAttribute('contenteditable',true);
   td.classList.add('spc_cls_optionTable_cell');
   td.i = rowNumber+1;
   td.j = colIndex+(firstColCheckbox ? 1 : 0);
   td.optionTable = this;
   tr.append(td);
  });
  tr.lastElementChild.isEOR = true;
  return tr;
 }

 _OptionTable.prototype.update = function() {
  console.log(this.node);
  spc.UI.removeChildren(this.node);
  console.log(this.data);
  let thead = document.createElement('thead');
  let headerRow = document.createElement('tr');
  this.data[0].forEach(header => {
   let th = document.createElement('th');
   th.append(document.createTextNode(header));
   headerRow.append(th);
  });
  thead.append(headerRow);
  this.node.append(thead);
  let tbody = document.createElement('tbody');
  this.data.slice(1).forEach((row,rowNumber) => tbody.append(getRow.call(this,row,rowNumber,this.firstColCheckboxes)));
  let lastRow;
  if (this.firstColCheckboxes) {
   lastRow = getRow.call(this,[false,...Array(this.data[0].length).fill('')],this.data.length-1,true);
  }
  else {
   lastRow = getRow.call(this,[...Array(this.data[0].length).fill('')],this.data.length-1,false);
  }
  tbody.append(lastRow);
  this.node.append(tbody);
  let div = document.createElement('div');
  div.classList.add('spc_cls_optionTable_plus')
  div.textContent = '+';
  this.node.append(div);
  Array.from(this.node.querySelectorAll('[class]')).forEach(ele => { if(!ele.id) spc.UI.assignHandles(this,ele) } );  
 }

 _OptionTable.prototype.setData = function(data,firstColCheckboxes) {
  this.firstColCheckboxes = firstColCheckboxes;
  this.data = data;
  this.update();
 }

 _OptionTable.prototype.setDataValue = function(i,j,value) {
  if (value.length) {
   if (this.data[i]) this.data[i][j] = value;
   else {   
    if (this.firstColCheckboxes) {
    this.data[i] = [false,...Array(this.data[0].length).fill('')]
    }
    else {
    this.data[i] = [...Array(this.data[0].length).fill('')]
    }
    this.data[i][j] = value;
   }
  }
 }

 _OptionTable.prototype.insertRowAfter = function(i) {
  console.log(this.data);
  if (i < (this.data.length-1)) {
   console.log('appending',i,this.data.length);
   if (this.firstColCheckboxes) {
    this.data.splice(i+1,0,[false,...Array(this.data[0].length).fill('')]);
   }
   else {
    this.data.splice(i+1,0,[...Array(this.data[0].length).fill('')]);
   }
  }
  console.log(this.data);  
  this.update();
 }

 return _OptionTable;
}();