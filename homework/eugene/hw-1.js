
function exec(number) {
	if (number[0] < 2) {
		number[0]++;
		for (k = 1; number[k] == 0 && k < number.length; k++) {
			number[k] = 2;
		}
		number[k]--;
	}
	else {
		number[0] -= 2;
	}

}


RegisterTask({
	name: "task1",
	functions: [exec],
	caller: exec
});

RegisterTask({
	name: "task1",
	functions: [exec],
	caller: exec
});

RegisterTask({
	name: "task1",
	functions: [exec],
	caller: exec
});

RegisterTask({
	name: "task1",
	functions: [exec],
	caller: exec
});