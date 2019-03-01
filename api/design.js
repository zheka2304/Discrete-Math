function code_to_html(code) {
	code = code.replace(new RegExp("\n", 'g'), "<br>");
	code = code.replace(new RegExp(" ", 'g'), "&nbsp");
	code = code.replace(new RegExp("\t", 'g'), "&nbsp&nbsp&nbsp&nbsp");
	return code;
}

function append_card(card) {
	var root = document.getElementById("root");
	card.append_to(root);
}

function json_to_html(json, params) {
	params = params || {};
	
	var tag = json.tag;
	if (params.callback) {
		params.callback(json, tag);
	}
	
	var inner = "";
	if (json.inner) {
		if (typeof(json.inner) == "string") {
			inner = json.inner;
		}
		else {
			if (Array.isArray(json.inner)) {
				for (var p in json.inner) {
					inner += json_to_html(json.inner[p], params);
				}
			}
			else {
				inner = json_to_html(json.inner, params);
			}
		}
	}
	
	var html = "<" + tag;
	for (var p in json) {
		if (p != "inner" && p != "tag") {
			var value = json[p];
			if (params.prefix && p == "id") {
				value = params.prefix + value;
			}
			html += " " + p + "=" + "\"" + value + "\"";
		}
	}
	
	html += ">" + inner + "</" + tag + ">" 
	return html;
}



/**
	new Card("sample-card", {
		content: {
			title: [html-json]
			body: [html-json]
		},
		
		blocks: ["id1", "id2", ...],
		
		added: function(card, blocks) {
			
		}
	})
*/

function Card(id, params) {
	this.id = id;
	this.content = {
		title: params.content.title,
		body: params.content.body
	};
	
	this.blocks = {};
	for (var i in params.blocks) {
		this.blocks[params.blocks[i]] = null;
	}
	
	this.added = params.added;
	
	var prepared_html = {
		"tag": "div",
		"class": "card mb-3 wow fadeIn",
		"inner": []
	};
	
	if (this.content.title) {
		var title = {
			"tag": "div",
			"class": "card-header",
			"id": "--card-title"
		};
		
		for (var p in this.content.title) {
			title[p] = this.content.title[p];
		}
		
		prepared_html.inner.push(title);
	}
	
	if (this.content.body) {
		var body = {
			"tag": "div",
			"class": "card-body",
			"id": "--card-body"
		};
		
		for (var p in this.content.body) {
			body[p] = this.content.body[p];
		}
		
		prepared_html.inner.push(body);
	}
	
	this.html = json_to_html(prepared_html, {prefix: id});
	
	this.append_to = function(block) {
		block.innerHTML += this.html;
		for (var block in this.blocks) {
			this.blocks[block] = document.getElementById(this.id + block);
		}
		if (this.added) {
			this.added(this, this.blocks);
		}
	}
}

