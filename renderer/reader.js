let readitClose = document.createElement('div');
readitClose.innerText = 'Delete from menu';

// Styling the button
readitClose.style.position = 'fixed';
readitClose.style.bottom = '15px';
readitClose.style.right = '25px';
readitClose.style.padding = '5px 10px';
readitClose.style.fontSize = '20px';
readitClose.style.fontWeight = 'bold';
readitClose.style.background = ' rgb(86, 0, 112)';
readitClose.style.color = 'white';
readitClose.style.borderRadius = '5px';
readitClose.style.cursor = 'default';
readitClose.style.boxShadow = '2px 2px 2px rgba(0,0,0,0.2)';
readitClose.style.zIndex = '999';

readitClose.onclick = e => {
    // message parent (opener) window
    window.opener.postMessage({
        action: 'delete-reader-item',
        itemIndex: {{index}}
    },'*')
}
// Append button to body
// we do not use appenChild method as we will get an error (an object could not be cloned) as ipcRendererInternal.invoke error
document.getElementsByTagName('body')[0].append(readitClose);