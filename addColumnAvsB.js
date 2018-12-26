/*
 * This function is used to add more columns in the Player vs Enemies section.
 */

var myform = document.querySelector('#AvsB');
var iter = 1;
function addColumnAvsB() {
	var values = new Array();
	[].forEach.call(myform.querySelectorAll('input'), function (elem) {
		if (elem.type == 'checkbox') {
			values[elem.id] = elem.checked;
		} else if(elem.id != '') {
			values[elem.id] = elem.value;
		}
	});

	var first = true;
	[].forEach.call(myform.querySelectorAll('tr'), function(trow) {
		var tag = 'td';
		var td = trow.querySelectorAll(tag)[1];
		if(td == null) {
			tag = 'th';
			td = trow.querySelectorAll(tag)[1];
		}
		trow.innerHTML += '<' + tag + '>' + td.innerHTML + '</' + tag + '>';
		
		var td = trow.querySelectorAll(tag);
		td = td[td.length-1];
		if(first) {
			td.innerHTML = iter + '. ' + td.innerHTML;
		}
		[].forEach.call(td.querySelectorAll('span'), function(input) {
			var id = input.id;
			input.id = id.substring(0, id.lastIndexOf('_')) + '_' + iter;
		});
		[].forEach.call(td.querySelectorAll('input'), function(input) {
			if(first) {
				input.value = 'Enemy ' + iter;
				first = false;
			}
			if(input.attributes.target != null) {
				input.setAttribute('target', iter);
			} else {
				var id = input.id;
				input.id = id.substring(0, id.lastIndexOf('_')) + '_' + iter;
			}
		});
		var button = td.querySelector('button');
		if(button != null) {
			button.setAttribute('onclick', 'exportJSONByIndex("' + iter + '")');
			button.addEventListener('change', onChangeByIndex)
		}
	});

	// Restore values in form.
	Object.keys(values).forEach(function (key) {
		setValue(document.querySelectorAll('#' + key)[0], values[key]);
	});
	setJsonListeners();
	iter += 1;
}
addColumnAvsB();
