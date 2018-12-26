/**
 * This file contains the functions required to export and import JSON files.
 */

function array2json(arr) {
    var parts = [];
    var is_list = false; //(Object.prototype.toString.apply(arr) === '[object Array]');

    for(var key in arr) {
    	var value = arr[key];
        if(typeof value == "object") { //Custom handling for arrays
            if(is_list) parts.push(array2json(value)); /* :RECURSION: */
            else parts.push('"' + key + '":' + array2json(value)); /* :RECURSION: */
            //else parts[key] = array2json(value); /* :RECURSION: */
            
        } else {
            var str = "";
            if(!is_list) str = '"' + key + '":';

            //Custom handling for multiple data types
            if(typeof value == "number") str += value; //Numbers
            else if(value === false) str += 'false'; //The booleans
            else if(value === true) str += 'true';
            else str += '"' + value + '"'; //All other things
            // :TODO: Is there any more datatype we should be in the lookout for? (Functions?)

            parts.push(str);
        }
    }
    var json = parts.join(",");
    
    if(is_list) return '[' + json + ']';//Return numerical JSON
    return '{' + json + '}';//Return associative JSON
}

// Export input values to a JSON file.
function exportJSON(name) {
	obj = document.querySelector('#' + name);
	var values = new Array();
	[].forEach.call(obj.querySelectorAll('input'), function (elem) {
		console.log(elem.id + " => " + elem.value);
		if (elem.type == 'checkbox') {
			values[elem.id] = elem.checked;
		} else if(elem.id != '') {
			values[elem.id] = elem.value;
		}
	});
	download(values['name'] + ".json", array2json(values));
}
function exportJSONByIndex(index) {
	var values = new Array();
	[].forEach.call(document.querySelectorAll('input'), function (elem) {
		if(elem.id.endsWith('_' + index)) {
			var id = elem.id;
			id = id.substring(0, id.lastIndexOf('_'));
			console.log(elem.id + " => " + elem.value);
			if (elem.type == 'checkbox') {
				values[id] = elem.checked;
			} else if(id != '') {
				values[id] = elem.value;
			}
		}
	});
	download(values['name'] + ".json", array2json(values));
}

function download(filename, text) {
	var element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	element.setAttribute('download', filename);
	element.style.display = 'none';
	document.body.appendChild(element);
	element.click();
	document.body.removeChild(element);
}

// Set the value for an element.
function setValue(elem, value) {
	if (elem) {
		if (elem.type && elem.type == 'checkbox') {
			if (value) {
				elem.checked = true;
			} else {
				elem.checked = false;
			}
		} else {
			elem.value = value;
		}
		elem.dispatchEvent(new Event('change'));
	}
}

// JSON upload handler.
function onChange(event) {
	//console.log(event.target);
	var target = event.target.attributes.target.value;
	var file = event.target.files[0];
	var reader = new FileReader();
	reader.onload = (function(f) {
		return function(event) {
			onReaderLoad(event, target);
		};
	})(file);
	reader.readAsText(event.target.files[0]);
}
function onChangeByIndex(event) {
	//console.log(event.target);
	var target = event.target.attributes.target.value;
	var file = event.target.files[0];
	var reader = new FileReader();
	reader.onload = (function(f) {
		return function(event) {
			onReaderLoadByIndex(event, target);
		};
	})(file);
	reader.readAsText(event.target.files[0]);
}

function onReaderLoad(event, target) {
	console.log(event);
	var obj = JSON.parse(event.target.result);
	var parent = document.querySelector('#' + target);
	Object.keys(obj).forEach(function (key) {
		setValue(parent.querySelector('#' + key), obj[key]);
	});
}
function onReaderLoadByIndex(event, target) {
	console.log(event);
	var obj = JSON.parse(event.target.result);
	Object.keys(obj).forEach(function (key) {
		setValue(document.querySelector('#' + key + '_' + target), obj[key]);
	});
}

function setJsonListeners() {
	[].forEach.call(document.querySelectorAll('.json-file-upload'), function (elem) {
		elem.addEventListener('change', onChange);
	});
	[].forEach.call(document.querySelectorAll('.json-file-upload-by-index'), function (elem) {
		elem.addEventListener('change', onChangeByIndex);
	});
}
setJsonListeners();
