// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
// DOM Nodes
const {ipcRenderer} = require('electron');
const items = require('./items');

let showModal = document.getElementById('show-modal'),
    closeModal = document.getElementById('close-modal'),
    modal = document.getElementById('modal'),
    addItem = document.getElementById('add-item'),
    itemUrl = document.getElementById('url'),
    search = document.getElementById('search')

// open modal window from menu
ipcRenderer.on('menu-show-modal', () => {
    showModal.click();
});

// Open selected item from menu
ipcRenderer.on('menu-open-item', () => {
    items.open();
});

// Delete selected item from menu
ipcRenderer.on('menu-delete-item', () => {
    let seletedItem = items.getSelectedItem();
    items.delete(seletedItem.index)
});

// Open NATIVE in browser from menu
ipcRenderer.on('menu-open-item-native', () => {
    items.openNativeInBrowser()
});

// Search for items
ipcRenderer.on('menu-focus-search', () => {
    search.focus();
});

// filter items when searching
search.addEventListener('keyup', e => {

    // loop through all items
    Array.from(document.getElementsByClassName('read-item')).forEach( item => {

        // Hide elements do not match search
        let hasMatch = item.innerText.toLowerCase().includes(search.value);
        item.style.display = hasMatch ? 'flex' : 'none';
    });

});

// navigate between items using key arrows 
document.addEventListener('keyup', e => {
    if(e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        items.changeSelection(e.key);
    }
})


// Disable and enable modal buttons
const toggleModalButtons = () => {
    //ckeck btn state
    if(addItem.disabled === true){
        addItem.disabled = false;
        addItem.style.opacity = 1;
        addItem.innerText = 'Add item';
        closeModal.style.display = 'inline'
    } else {
        addItem.disabled = true;
        addItem.style.opacity = 0.5;
        addItem.innerText = 'Adding...';
        closeModal.style.display = 'none'
    }
}


    // Show Modal
showModal.addEventListener('click', e => {
    modal.style.display = 'flex';
    itemUrl.focus();
});

closeModal.addEventListener('click', e => {
    modal.style.display = 'none';
});

addItem.addEventListener('click', e => {
    
    //Check url if exist
    if(itemUrl.value){
        // console.log(itemUrl.value);
        // send new item url to main process
        ipcRenderer.send('new-item', itemUrl.value);

        toggleModalButtons();
    }
});

// Listen for the new item main process
ipcRenderer.on('new-item-success', (event, newItem)=> {
    
    console.log(newItem);

    // Add new item to 'items' node
    items.addItem(newItem, true);

    toggleModalButtons();
    //Hide modal and clear values
    modal.style.display = 'none';
    itemUrl.value = '';
});

// listen to key submit
itemUrl.addEventListener('keyup', e => {
    if(e.key === 'Enter') addItem.click();
})