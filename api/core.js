function InputString(label) {
	this.build  = function(block, card, prefix) {
		var html = json_to_html({
			"tag": "div",
			inner: [{
				"tag": "form",
				"inner": [
				{"tag": "label", "for": "input_field", "inner": label, "class": "grey-text"},
				{
					"tag": "input",
					"type": "text",
					"id": "input_field",
					"class": "form-control"
				}
				]
			}]
		}, {prefix: prefix});
		
		this.block_id = prefix + "input_field"
		block.innerHTML = html;
	}
	
	this.process = function(value) {
		return value;
	}
	
	this.get = function() {
		return this.process(document.getElementById(this.block_id).value);
	}
}

function InputNumber(label, base) {
	InputString.call(this, label);
	
	this.process = function(x) {
		return WrapNumber(x, base);
	}
}
