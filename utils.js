/*
 * This file contains some generic functions.
 */

function calculate_bonus(score) {
	if(score <= 3) {
		return -3;
	} else if(score <= 5) {
		return -2;
	} else if(score <= 8) {
		return -1;
	} else if(score <= 12) {
		return 0;
	} else if(score <= 15) {
		return 1;
	} else if(score <= 17) {
		return 2;
	} else {
		return 3;
	}
}

function percentage(num, decimals=2) {
	return (num*100).toFixed(decimals) + '%';
}

// Calculates the expected damage for *n* dice with *s* sides after *h* hits.
function expected_result(n, s, h=1) {
	return n * (s / 2 + 0.5) * h;
}

var factorial_cache = [1, 1];
function factorial(n) {
	if (n < factorial_cache.length) {
		return factorial_cache[n];
	}
	var i = factorial_cache.length;
	var result = factorial_cache[i-1];
	for (i; i <= n; i++) {
		result *= i;
		factorial_cache[i] = result;
	}
	return result;
}

// Calculates the probability for obtaining a given total *p* using *n* dice with *s* sides.
// The function implements the formula described here: http://mathworld.wolfram.com/Dice.html
// and implemented here for Matlab: https://github.com/carlosvega/DiceProbabilities
function dice_prob(p, n, s=6) {
	var k_max = Math.floor((p - n) / s);
	var sum = 0;
	for (var k = 0; k <= k_max; k++) {
		var val1 = Math.pow(-1, k);
		var val2 = comb_sans_repeat(n, k);
		var val3 = comb_sans_repeat(p - (s * k) - 1, n - 1);
		sum = sum + (val1 * val2 * val3);
	}
	return sum / Math.pow(s, n);
}
function comb_sans_repeat(n, k) {
	return factorial(n) / (factorial(k) * factorial(n - k));
}

function dice_prob_at_least(p, n, s=6) {
	var sum = 1;
	for(var i = 0; i < p; i++) {
		sum -= dice_prob(i, n, s);
	}
	return sum;
}

function dice_prob_at_most(p, n, s=6) {
	var sum = 0;
	for(var i = 0; i <= p; i++) {
		sum += dice_prob(i, n, s);
	}
	return sum;
}

function get_int(id) {
	//console.log(id + ' => ' + document.querySelector('#' + id).value);
	return parseInt(document.querySelector('#' + id).value);
}
function get_int_in_container(container, id) {
	//console.log(id);// + ' => ' + container.querySelectorAll('#' + id)[0].value);
	return parseInt(container.querySelector('#' + id).value);
}
