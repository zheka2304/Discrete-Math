Core.no_trace_math_exceptions = true; // disable stacktrace

function base(data) {
	if (data.get() == "[" || data.get() == "(") {
		level1(data);
		base(data);
	}
}

function level1(data) {
	if (data.get() == "[") {
		data.index++;
		level2(data);
		if (data.get() != "]") {
			data.error("expected ]")
		}
		data.index++;
	}
	else if (data.get() == "(") {
		data.index++;
		level2(data);
		if (data.get() != ")") {
			data.error("expected )")
		}
		data.index++;
	}
}


function level2(data) {
	if (data.get() == "[") {
		data.index++;
		if (data.get() != "]") {
			data.error("expected ]");
			level2(data);
		}
		data.index++;
	}
	else if (data.get() == "(") {
		data.index++;
		if (data.get() != ")") {
			data.error("expected )");
			level2(data);
		}
		data.index++;
	}
}


function exec(string) {
	var parser_data = {
		string: string,
		index: 0,

		get: function(len) {
			len = len || 1
			return this.string.substring(this.index, this.index + len);
		},

		end: function() {
			return this.index >= string.length;
		},

		error: function(message) {
			offset = ""
			for (var i = 0; i < this.index; i++) {
				offset += " "
			}
			throw Exception("error " + message + " at character " + this.index + "\n" + string + "\n" + offset + "^");
		}
	}

	base(parser_data);
	if (!parser_data.end()) {
		parser_data.error("unexpected string termination");
	}
	return "Input is correct"
}


RegisterTask({
	name: "Parser",
	functions: [base, level1, level2],
	caller: exec,
	
	inputs: [
		new InputString("Input string to check")
	],
	
	output: function(s) {
		return s;
	}
});
