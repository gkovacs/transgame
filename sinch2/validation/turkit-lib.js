function unescapeURL(s) {
    return decodeURIComponent(s.replace(/\+/g, "%20"));
}

function getURLParams() {
    var params = {};
    var m = window.location.href.match(/[\\?&]([^=]+)=([^&#]*)/g);
    if(m) {
	for(var i=0; i<m.length; i++) {
	    var a = m[i].match(/.([^=]+)=(.*)/);
	    params[unescapeURL(a[1])] = unescapeURL(a[2]);
	}
    }
    return params;
}

function swap(o, i1, i2) {
    var temp = o[i1];
    o[i1] = o[i2];
    o[i2] = temp;
}

function shuffle(a) {
    for(var i=0; i<a.length; i++) {
	swap(a, i, randomIndex(a.length));
    }
    return a;
}


function findPos(obj) {
    var curleft = curtop = 0;
    if(obj != null && obj.offsetParent) {
	curleft = obj.offsetLeft;
	curtop = obj.offsetTop;
	while (obj = obj.offsetParent) {
	    curleft += obj.offsetLeft;
	    curtop += obj.offsetTop;
	}
    } else {
	return null;
    }

    return [curleft,curtop];
}

function randomIndex(n) {
    return Math.floor(Math.random() * n);
}

$(function () {
	var params = getURLParams();
	if(params.assignmentId) {
	    if(params.assignmentId == "ASSIGNMENT_ID_NOT_AVAILABLE") {
		$('input').attr("DISABLED", "true");
		$('textarea').attr("DISABLED", "true");
		$('button').attr("DISABLED", "true");
		_allowSubmit = false;
	    } else {
		_allowSubmit = true;
	    }
	    $('#assignmentId').attr('value', params.assignmentId);
	    $('form').attr('method', 'POST');
	}
	if (params.turkSubmitTo) {
	    $('form').attr('action', params.turkSubmitTo + '/mturk/externalSubmit');
	}
    
	// randomly permute the locations of all elements of class "random"
	var r = $('.random')
	    $(shuffle(r.after('<div/>').next().get())).each(function (i) {
		    $(this).after(r[i]).remove()
		});
    });