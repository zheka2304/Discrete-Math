
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
	
	return number;
}

function process(number_str) {
	
}


RegisterTask({
	name: "subtract 2",
	functions: [exec],
	caller: exec,
	
	inputs: [
		new InputNumber("Input number of base 3: ")
	],
	
	output: function(number) {
		var result = "";
		for (var i in number) {
			result = number[i] + result;
		}
		while (result[0] == "0" && result.length > 1) {
			result = result.substr(1);
		}
		return "Result: " + result;
	}
});