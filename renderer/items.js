const fs = require('fs');

// DOM nodes
let items = document.getElementById('items');

// Get readerJS content
let readerJS;
fs.readFile(`${__dirname}/reader.js`, (err, data) => {
    readerJS = data.toString();
});

// listen for done message from the reader window
window.addEventListener('message', e => {
    //delete item
    //check if the message is correct
    if(e.data.action === 'delete-reader-item') {

        this.delete(e.data.itemIndex)
        e.source.close();
    }
}); 

// Create delete item function
exports.delete = itemIndex => {
    //Remove item from the DOM
    items.removeChild( items.childNodes[itemIndex] );
    // Remove item from storage
    this.storage.splice(itemIndex, 1);
    // Persist the storage
    this.save();

    // Select another item after deleting
    if(this.storage.length){
        // get new item to select
        let newSelecteditemIndex = (itemIndex === 0) ? 0 : itemIndex - 1
        document.getElementsByClassName('read-item')[newSelecteditemIndex].classList.add('selected')
    }
}

exports.getSelectedItem = () => {
    //Get selected node
    let currentItem = document.getElementsByClassName('read-item selected')[0]

    //Get Itel index
    let itemIndex = 0;
    let child = currentItem
    while( (child = child.previousElementSibling) != null )
        itemIndex++;

    // Return selected item and index
    return {node: currentItem, index: itemIndex}
}

// Track items in storage
exports.storage = JSON.parse(localStorage.getItem('readit-items')) || [];

// Persist storage
exports.save = () => {
  localStorage.setItem('readit-items', JSON.stringify(this.storage));
}


// Set item as selected
exports.select = e => {

    // Remove currently selected item class
    this.getSelectedItem().node.classList.remove('selected')
  
    // Add to clicked item
    e.currentTarget.classList.add('selected')
  }

// move to new selected item
exports.changeSelection = direction => {
    // get selected item
    let currentItem =  this.getSelectedItem();
    // handle up and down selection
    if (direction === 'ArrowUp' && currentItem.node.previousElementSibling){
        currentItem.node.classList.remove('selected');
        currentItem.node.previousElementSibling.classList.add('selected');
    } else if (direction === 'ArrowDown' && currentItem.node.nextElementSibling) {
        currentItem.node.classList.remove('selected');
        currentItem.node.nextElementSibling.classList.add('selected');
    }
}

// Open selected item
exports.open = () => {
    //Checking if we don not have items in the storage
    if (!this.storage.length) return;

    // Getting the selected item
    let selectedItem =  this.getSelectedItem();

    // Getting the item url
    let contentUrl = selectedItem.node.dataset.url;

    console.log('open link', contentUrl);

    // Open item link in proxy browserWindow
    let readerWin = window.open(contentUrl, '', `
        maxWidth=2000,
        maxHeight=2000,
        width=1200,
        height=800,
        backgroundColor=#DEDEDE,
        nodeIntegration=0,
        contextIsolation=1
    `);
    // Note: contextIsolation set to 1 or True so JS is executed in its isolated context 
    // without access to other JS like the mainWindow (Safe guard measures)

    // openeing a message
    // Injecting JS with specific item index (selectedItem.index)
    readerWin.eval(readerJS.replace('{{index}}', selectedItem.index))
}


// Add new item
exports.addItem = (item, isNew = false) => {

  // Create a new DOM node
  let itemNode = document.createElement('div');

  // Assign "read-item" class
  itemNode.setAttribute('class', 'read-item');

  //Set item url as data attribute
  itemNode.setAttribute('data-url', item.url);

  // Add inner HTML
  itemNode.innerHTML = `<img src="${item.screenshot}"><h2>${item.title}</h2>`

  // Append new node to "items"
  items.appendChild(itemNode);

  // attach click handler to select
  itemNode.addEventListener('click', this.select);

  //Attach double click to open link
  itemNode.addEventListener('dblclick', this.open);

  // if this is the first item, select it
  if (document.getElementsByClassName('read-item').length === 1) {
    itemNode.classList.add('selected')
  }

  // Add item to storage and persist
  if(isNew) {
    this.storage.push(item);
    this.save();
  }
}

// Add items from storage when app loads
this.storage.forEach( item => {
  this.addItem(item);
})
