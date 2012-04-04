// when the proxy loads, send the url string to the parent page to be logged
// also, set a mouseup listener that processes the current selected text
$(document).ready(function() {
    parent.processUrl(real_url, document.title);
    document.onmouseup = sendSelectionInfo;
});

function sendSelectionInfo() {
    var selection = window.getSelection();
    var range = selection.getRangeAt(0);
    if (!range.collapsed) {
        parent.processSelection(range, selection.toString());
    }
}