var total_queries = 4; // number of queries per batch
var queries_completed = 0; // number of queries currently completed
var current_url_object; // object representing properties of the current proxy url
var url_path = new Array(); // urls navigated in the proxy
var query; // current query
var query_id = 0; // unique id of the current query
var query_audio;  //link to audio of current query
var prev_queries = new Array(); // ids of previously answered queries

// encodes the input string and returns it in base64
// this is used as an argument to open a page in the proxy
function encode64(input) {
    var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;

    do {
	chr1 = input.charCodeAt(i++);
	chr2 = input.charCodeAt(i++);
	chr3 = input.charCodeAt(i++);
  
	enc1 = chr1 >> 2;
	enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
	enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
	enc4 = chr3 & 63;
  
	if(isNaN(chr2)) {
	    enc3 = enc4 = 64;
	} else if(isNaN(chr3)) {
	    enc4 = 64;
	}
  
	output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) + 
	    keyStr.charAt(enc3) + keyStr.charAt(enc4);
    } while (i < input.length);
  
    return output;
}

// log data when an answer is submitted
function submitTask() {
    if (url_path.length == 1) {
        alert("You must find the answer in the browser below!");
    } else {
        var qi = query_id;
        var a = $("#answer").val();
        var u = JSON.stringify(url_path);
        $.post("php/addAnswer.php",
               {
                   queryId: qi,
                   answer: a,
                   urls: u
               },
               function(data){
                   prev_queries.push(query_id);
                   queries_completed++;
                   // if this was the last query, submit the task, otherwise load the next query
                   if (queries_completed >= total_queries) {
                       var my_form = document.getElementById('myform');
                       my_form.submit();
                   } else {
                       resetPage();
                   }
               });
    }
}

// clears all text fields, updates the current query number, and loads google.com into the proxy
function resetPage() {
    var task_num = (queries_completed + 1) + " of " + total_queries;
    $("#task_num").html(task_num);
    var pq = JSON.stringify(prev_queries);

    $.post("php/gettask.php",
           {
	       prev_queries: pq
	   },
           function(data) {
               var task = eval(data);
               query = task[0].query;
			   query_id = parseInt(task[0].id);
			   query_audio = task[1].audio;	   
			   $("#query_audio").html('<EMBED autostart="false" src="' + query_audio + '" VOLUME="50" HEIGHT="60" WIDTH="144">');
						   			   
           });
	
	
	
    $("#answer").val("");
    url_path = new Array();
    $("#address").val("http://www.google.com/");
    loadUrl();
}

// loads the url in the address input text box into the proxy
function loadUrl() {
    var address = $("#address").val();
    address = encode64(address);
    address = "proxy.php?proxyurl=" + address;
    var browser_frame = document.getElementById('browser_frame');
    browser_frame.src = address;
}

// adds the current proxy url to the url path and resets the selected range
function processUrl(address, title) {
    current_url_object = new Object();
    current_url_object.url = address;
    current_url_object.title = title;
    current_url_object.selections = new Array();
    url_path.push(current_url_object);
    $("#address").val(address);
}

// save information of the current text selection in the proxy
function processSelection(selectedRange, selectedText) {
    var selection_object = new Object();
    selection_object.selected_text = selectedText;
    selection_object.start_container = generateXPath(selectedRange.startContainer).xpathExpression;
    selection_object.start_container = selection_object.start_container.replace("#text", "text()");
    selection_object.start_offset = selectedRange.startOffset;
    selection_object.end_container = generateXPath(selectedRange.endContainer).xpathExpression;
    selection_object.end_container = selection_object.end_container.replace("#text", "text()");
    selection_object.end_offset = selectedRange.endOffset;
    selection_object.common_ancestor = generateXPath(selectedRange.commonAncestorContainer).xpathExpression;
    selection_object.common_ancestor = selection_object.common_ancestor.replace("#text", "text()");
    current_url_object.selections.push(selection_object);
}

// sets the height of the proxy iframe based on the window size
function setFrameSize() {
    var myWidth = 0, myHeight = 0;
    if( typeof( window.innerWidth ) == 'number' ) {
	//Non-IE
	myWidth = window.innerWidth;
	myHeight = window.innerHeight;
    } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
	//IE 6+ in 'standards compliant mode'
	myWidth = document.documentElement.clientWidth;
	myHeight = document.documentElement.clientHeight;
    } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
	//IE 4 compatible
	myWidth = document.body.clientWidth;
	myHeight = document.body.clientHeight;
    }
    var frame = document.getElementById("browser_frame");
    frame.height = myHeight - 325;
    frame.width = myWidth;
}

// every time the page reloads, resize the proxy iframe, add button listeners, and start a new batch
$(document).ready(function() {
    setFrameSize();
    $("#go").click(function() {loadUrl(); return false;});
    $("#submitter").click(function() {submitTask(); return false;});
    resetPage();
});