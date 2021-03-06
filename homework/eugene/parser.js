Core.no_trace_math_exceptions = true; // disable stacktrace


function base(data) {
	if (data.get() == "[" || data.get() == "(") {
		brackets(data);
		base(data);
	}
}

function brackets(data) {
	if (data.get() == "[") {
		data.index++;
		brackets(data);
		brackets(data);
		base(data);
		if (data.get() == "]") {	
			data.index++;
		} else {
			data.error("expected ]");
		}
	} else if (data.get() == "(") {
		data.index++;
		base(data);
		if (data.get() == ")") {
			data.index++;
		} else {
			data.error("expected )")
		}
	} else {
		data.error("expected opening bracket");
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
			throw Exception("error " + message + " at index " + this.index + "\n" + string + "\n" + offset + "^");
		}
	}

	base(parser_data);
	if (!parser_data.end()) {
		parser_data.error("unexpected string termination");
	}
	return "Correct"
}


RegisterTask({
	name: "Parser",
	functions: [base, brackets],
	caller: exec,
	
	inputs: [
		new InputString("Input string to check")
	],
	
	output: function(s) {
		return s;
	}
});
