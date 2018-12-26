/*
 * This file contains the functions required to calculate the results for all sections.
 */

function calculate_probability() {
	var container = document.querySelector('#probability');
	var number_of_dice = get_int_in_container(container, 'number_of_dice');
	var dice_sides = get_int_in_container(container, 'dice_sides');
	var total = get_int_in_container(container, 'total');
	var times = get_int_in_container(container, 'times');
	var result = 0;
	switch(container.querySelector('#type').value) {
		case '>=':
			result = dice_prob_at_least(total, number_of_dice, dice_sides);
			break;
		case '<=':
			result = dice_prob_at_most(total, number_of_dice, dice_sides);
			break;
		default:
			result = dice_prob(total, number_of_dice, dice_sides);
			break;
	}
	container.querySelector('#result').innerHTML = percentage(Math.pow(result, times));
}

function calculate_expected_damage() {
	var container = document.querySelector('#expected_damage');
	var number_of_dice = get_int_in_container(container, 'number_of_dice');
	var dice_sides = get_int_in_container(container, 'dice_sides');
	var hits = get_int_in_container(container, 'hits');
	container.querySelector('#result').innerHTML = expected_result(number_of_dice, dice_sides, hits);
}

function calculate_damage_per_turn(weapon_number_of_dice, weapon_dice_sides, str, ac_result, saving_throw, no_saving_throw) {
	var damage_per_turn = (expected_result(weapon_number_of_dice, weapon_dice_sides) + str) * dice_prob_at_least(ac_result, 1, 20);
	if(!no_saving_throw) {
		var saving_throw_result = dice_prob_at_least(saving_throw, 1, 20);
		damage_per_turn = damage_per_turn * (1 - saving_throw_result) + damage_per_turn / 2 * saving_throw_result;
	}
	return damage_per_turn;
}

function calculate_turns_to_defeat() {
	var player = new Array();
	player.name = document.querySelector('#name_0').value;
	player.weapon_number_of_dice = get_int('weapon_number_of_dice_0');
	player.weapon_dice_sides = get_int('weapon_dice_sides_0');
	player.str = calculate_bonus(get_int('str_0'));
	player.dex = calculate_bonus(get_int('dex_0'));
	player.tac0 = get_int('tac0_0');
	
	player.hp = get_int('hp_0');
	player.ac = get_int('ac_0');
	player.protection = get_int('protection_0');
	player.saving_throw = get_int('saving_throw_0') - player.protection;
	player.no_saving_throw = document.querySelectorAll('#no_saving_throw_0')[0].checked;
	player.ac_result = 0;
	
	var tr = document.querySelector('#AvsB_result').querySelector('tr');
	var table = document.querySelector('#AvsB_result').querySelector('tbody');
	table.innerHTML = '';

	var i = 1;
	while(i < iter) {
		var enemy = new Array();
		enemy.name = document.querySelector('#name_' + i).value;
		enemy.weapon_number_of_dice = get_int('weapon_number_of_dice_' + i);
		enemy.weapon_dice_sides = get_int('weapon_dice_sides_' + i);
		enemy.str = calculate_bonus(get_int('str_' + i));
		enemy.dex = calculate_bonus(get_int('dex_' + i));
		enemy.tac0 = get_int('tac0_' + i);
		
		enemy.hp = get_int('hp_' + i);
		enemy.ac = get_int('ac_' + i);
		enemy.protection = get_int('protection_' + i);
		enemy.saving_throw = get_int('saving_throw_' + i) - enemy.protection;
		enemy.no_saving_throw = document.querySelectorAll('#no_saving_throw_' + i)[0].checked;
		enemy.ac_result = 0;

		if(!document.querySelector('#always_hit_0').checked) {
			player.ac_result = player.tac0 - enemy.ac + enemy.dex;
		}
		if(!document.querySelector('#always_hit_' + i).checked) {
			enemy.ac_result = enemy.tac0 - player.ac + player.dex;
		}

		/*var damage_per_turn = (expected_result(weapon_number_of_dice, weapon_dice_sides) + str) * dice_prob_at_least(ac_result, 1, 20);
		if(!container.querySelector('#no_saving_throw').checked) {
			var saving_throw_result = dice_prob_at_least(saving_throw, 1, 20);
			damage_per_turn = damage_per_turn * (1 - saving_throw_result) + damage_per_turn / 2 * saving_throw_result;
		}*/
		player.damage_per_turn = calculate_damage_per_turn(player.weapon_number_of_dice, player.weapon_dice_sides, player.str, player.ac_result, enemy.saving_throw, enemy.no_saving_throw);
		enemy.damage_per_turn = calculate_damage_per_turn(enemy.weapon_number_of_dice, enemy.weapon_dice_sides, enemy.str, enemy.ac_result, player.saving_throw, player.no_saving_throw);
		
		[].forEach.call(tr.querySelectorAll('#name_player'), function (elem) {
			elem.innerHTML = player.name;
		});
		tr.querySelector('#damage_player').innerHTML = (expected_result(player.weapon_number_of_dice, player.weapon_dice_sides) + player.str).toFixed(3);
		tr.querySelector('#chance_player').innerHTML = (dice_prob_at_least(player.ac_result, 1, 20)*100).toFixed(0) + "%";
		tr.querySelector('#damage_per_turn_player').innerHTML = player.damage_per_turn.toFixed(3);
		tr.querySelector('#result_player').innerHTML = (enemy.hp / player.damage_per_turn).toFixed(3);
		[].forEach.call(tr.querySelectorAll('#name_enemy'), function (elem) {
			elem.innerHTML = enemy.name;
		});
		tr.querySelector('#damage_enemy').innerHTML = (expected_result(enemy.weapon_number_of_dice, enemy.weapon_dice_sides) + enemy.str).toFixed(3);
		tr.querySelector('#chance_enemy').innerHTML = (dice_prob_at_least(enemy.ac_result, 1, 20)*100).toFixed(0) + "%";
		tr.querySelector('#damage_per_turn_enemy').innerHTML = enemy.damage_per_turn.toFixed(3);
		tr.querySelector('#result_enemy').innerHTML = (player.hp / enemy.damage_per_turn).toFixed(3);
		table.innerHTML += tr.outerHTML;
		i++;
	}
}

function calculate_missile_damage(weapon_number_of_dice, weapon_dice_sides, dex, range_bonus, cover, magic_bonus, saving_throw, protection) {
	var damage = expected_result(weapon_number_of_dice, weapon_dice_sides) + dex + range_bonus + magic_bonus;
	var saving_throw_result = dice_prob_at_least(saving_throw - cover, 1, 20);
	return damage * (1 - saving_throw_result) + damage / 2 * saving_throw_result;
}

function calculate_missile_against_target() {
	var container = document.querySelector('#missile_against_target');
	
	var weapon_number_of_dice = get_int_in_container(container, 'weapon_number_of_dice');
	var weapon_dice_sides = get_int_in_container(container, 'weapon_dice_sides');
	var range_bonus = get_int_in_container(container, 'range');
	var magic_bonus = get_int_in_container(container, 'magic_bonus');
	var dex = calculate_bonus(get_int_in_container(container, 'dex'));
	//var tac0 = get_int_in_container(container, 'tac0');
	
	var cover = get_int_in_container(container, 'cover');
	//var ac = get_int_in_container(container, 'ac');
	var protection = get_int_in_container(container, 'protection');
	var saving_throw = get_int_in_container(container, 'saving_throw') - protection;
	/*var ac_result = 0;
	if(!container.querySelector('#always_hit').checked) {
		ac_result = tac0 - ac + dex;
	}*/

	container.querySelector('#result').innerHTML = calculate_missile_damage(weapon_number_of_dice, weapon_dice_sides, dex, range_bonus, cover, magic_bonus, saving_throw, protection).toFixed(3);
}

function calculate_attack_on_platoon() {
	var container = document.querySelector('#attack_on_platoon');
	var units = get_int_in_container(container, 'units');
	
	var weapon_number_of_dice = get_int_in_container(container, 'weapon_number_of_dice');
	var weapon_dice_sides = get_int_in_container(container, 'weapon_dice_sides');
	var range_bonus = get_int_in_container(container, 'range');
	var dex = calculate_bonus(get_int_in_container(container, 'dex'));
	//var str = calculate_bonus(get_int_in_container(container, 'str'));
	//var tac0 = get_int_in_container(container, 'tac0');
	
	var level = get_int_in_container(container, 'level');
	var cover = calculate_bonus(get_int_in_container(container, 'cover'));
	var con = calculate_bonus(get_int_in_container(container, 'con'));
	//var ac = get_int_in_container(container, 'ac');
	var saving_throw = get_int_in_container(container, 'saving_throw') - protection;
	var protection = get_int_in_container(container, 'protection');
	/*var ac_result = 0;
	if(!container.querySelector('#always_hit').checked) {
		ac_result = tac0 - ac + dex;
	}*/
	
	var damage_per_unit = (expected_result(weapon_number_of_dice, weapon_dice_sides) + dex);// * dice_prob_at_least(ac_result, 1, 20);
	var saving_throw_result = dice_prob_at_least(saving_throw, 1, 20);
	damage_per_unit = damage_per_unit * (1 - saving_throw_result) + damage_per_unit / 2 * saving_throw_result;
	container.querySelector('#damage').innerHTML = damage_per_unit.toFixed(3);
	var prob_at_least = dice_prob_at_least(damage_per_unit - con * level, level, 8);
	container.querySelector('#result').innerHTML = (units * prob_at_least) + ' survived units (' + percentage(prob_at_least) + ')';
}
