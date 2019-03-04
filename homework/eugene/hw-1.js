// prevent stack traces on math exceptions
Core.no_trace_math_exceptions = true;


function exec(number) {
	if (number < 2) {
		throw Exception("passed number less than 2");
	}
	
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


RegisterTask({
	name: "subtract 2",
	functions: [exec],
	caller: exec,
	
	inputs: [
		new InputNumber("Input number of base 3: ", 3)
	],
	
	output: function(number) {
		number.validate();
		return "Result: " + number.toString();
	}
});