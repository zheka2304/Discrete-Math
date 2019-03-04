function WrapNumber(src, base) {
	if (!base || base < 0) {
		base = src.base || 10;
	}
	
	var number = [];
	number.negative = false;
	number.base = base;
	
	var to_digit = function(c) {
		var digit;
		if (typeof(c) == "number") {
			if (c < 0 || c >= base) {
				throw Exception("failed to wrap number: " + src + " invalid digit '" + c + "' for base " + base);
			}
			return parseInt(c);
		}
		else {
			var digit = parseInt(c + "", base);
			if (isNaN(digit)) {
				throw Exception("failed to wrap number: " + src + " invalid digit '" + c  + "' for base " + base);
			}
			return digit;
		}
	}
	
	// number with a different base
	if (Array.isArray(src) && src.base > 0 && src.base != base) {
		src = src.valueOf();
	}
	
	if (Array.isArray(src)) {
		src.map(function(digit) {
			number.push(to_digit(digit));
		});
		if (src.negative) {
			number.negative = true;
		}
	}
	else if (typeof(src) == "string") {
		if (src.startsWith("-")) {
			number.negative = true;
			src = src.substr(1);
		}
		src.split("").map(function(digit) {
			number.unshift(to_digit(digit));
		});
	}
	else if (typeof(src) == "number") {
		if (src < 0) {
			src = -src;
			number.negative = true;
		}
		src = parseInt(src);
		while (src > 0) {
			number.push(src % base);
			src = parseInt(src / base);
		}
	}
	else {
		throw Exception("failed to wrap number: " + src);
	}
	
	number.validate = function() {
		while (this.length > 0 && this[this.length - 1] == 0) {
			this.pop();
		}
		for (var i = 0; i < this.length; i++) {
			var digit = this[i];
			if (digit != digit || digit < 0 || digit >= this.base) {
				throw Exception("Failed to validate number: invalid digit '" + digit + "' at position " + i);
			}
		}
	}
	
	number.validate();
	if (number.length == 0) {
		number.push(0);
	}
	
	
	var to_letter = function(digit) {
		if (digit < 10) {
			return "" + digit;
		}
		else {
			return String.fromCharCode("a".charCodeAt(0) + digit - 10);
		}
	}
	
	number.toString = function(as_array) {
		if (as_array) {
			return Array.prototype.toString(number);
		}
		var str = ""
		this.map(function(digit) {
			str = to_letter(digit) + str;
		});
		if (this.negative) {
			str = "-" + str;
		}
		return str;
	}
	
	number.valueOf = function() {
		var value = 0;
		var m = 1;
		for (var i = 0; i < this.length; i++) {
			var digit = this[i];
			value += digit * m;
			m *= number.base;
		}
		if (this.negative) {
			value = -value;
		}
		return value;
	}
	
	
	var to_wrapped = function(x, _base) {
		if (x && x.base > 0) {
			return x;
		}
		return WrapNumber(x, _base);
	}
	
	number.add = function(x, _base) {
		var x = to_wrapped(x).valueOf();
		return WrapNumber(this.valueOf() + x, this.base);
	}
	
	number.subtract = function(x, _base) {
		var x = to_wrapped(x, _base).valueOf();
		return WrapNumber(this.valueOf() - x, this.base);
	}
	
	number.multiply = function(x, _base) {
		var x = to_wrapped(x, _base).valueOf();
		return WrapNumber(this.valueOf() * x, this.base);
	}
	
	number.devide = function(x, _base) {
		var x = to_wrapped(x, _base).valueOf();
		return WrapNumber(parseInt(this.valueOf() / x), this.base);
	}
	
	number.mod = function(x, _base) {
		var x = to_wrapped(x, _base).valueOf();
		return WrapNumber(this.valueOf() % x, this.base);
	}
	
	number.opposite = function() {
		var x = WrapNumber(this);
		x.negative = !x.negative;
		return x;
	}
	
	number.abs = function() {
		var x = WrapNumber(this);
		x.negative = false;
		return x;
	}
	
	
	return number;
}
