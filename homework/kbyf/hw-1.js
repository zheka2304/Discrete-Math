// prevent stack traces on math exceptions
Core.no_trace_math_exceptions = true;


function exec(number) {
	if (number < 1) {
		throw Exception("passed number less than 1");
	}
	
	for (k = 0; number[k] == 0 && k < number.length; k++) {
		number[k] = 2;
	}
	number[k]--;
		
	return number;
}


RegisterTask({
	name: "subtract 1",
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