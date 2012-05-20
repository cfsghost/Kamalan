KamalanRuntime.Network = {};

Network._makeRequest = function(method, url, params, callback) {
	var http_request = false;

	if (window.XMLHttpRequest) { // Mozilla, Safari,...
		http_request = new XMLHttpRequest();

	} else if (window.ActiveXObject) { // IE
		try {
			http_request = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e) {
			try {
			http_request = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (e) {}
		}
	}

	if (!http_request) {
		return false;
	}

	http_request.onreadystatechange = function() { 
		if (http_request.readyState == 4) {
			if (http_request.status == 200) {
				callback(null, http_request.responseText);
			} else {
				console.log('There was a problem with the request.');
			}
		}
	};

	var bodyStr = null;
	if (method == 'POST' || params != null) {
		/* Prepare body */
		var body = [];
		for (var key in params) {
			if (body.length > 0)
				body.push('&');

			body.push(encodeURIComponent(key));
			body.push('=');
			body.push(encodeURIComponent(params[key]));
		}
		bodyStr = body.join('');
	}

	http_request.open(method, url, true);
	if (method == 'POST' || params != null) {
		http_request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	}

	http_request.send(bodyStr);
};


Network.get = function(url, callback) {

	return _RedTea._internal.makeRequest('GET', url, null, callback);
};

Network.post = function(url, params, callback) {

	return _RedTea._internal.makeRequest('POST', url, params, callback);
};

