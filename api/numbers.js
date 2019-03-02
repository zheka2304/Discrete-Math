function InputNumber(label) {
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
	
	this.get = function() {
		var str_number = document.getElementById(this.block_id).value;
		var number = []
		for (var i in str_number) {
			number.unshift(parseInt(str_number[i]))
		}
		return number;
	}
}
