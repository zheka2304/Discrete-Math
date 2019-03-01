var api_modules = load_modules({
	url: GIT_REPOSITORY_URL + API_MODULES_PATH,
	scope: __global__,
	
	exception: function(module, exception) {
		alert("error in api module: " + exception);
	}
});


/*
	{
		// name to display
		name: "name",
		// functions to display 
		functions: [], 
		
		// function to call
		caller: <function>,
		
		inputs: [
			{
				// build input field
				build: function() {
				
				},
				
				// get input value
				get: function() {
					
				}
			},
			...
		],
		
		// function to process return value
		output: function(return_value) {
			
		}
	}
*/

function _Task(params) {
	for (var param in params) {
		this[param] = params[param];
	}
	
	this.build_html = function() {
		var html = "";
		for (var i in this.functions) {
			html += code_to_html(this.functions[i] + "") + "<br><br>"
		}
		return html;
	}
	
	this.build_card = function(id) {
		
		var code = this.build_html()
		var card = new Card(id, {
			content: {
				title: {inner: "Task: " + this.name},
				body: {
					"id": "source-code",
					"class": "card-body source-code",
					"inner": code
				}
			},
			
			blocks: ["source-code"],
			
			added: function(c, blocks) {
				hljs.highlightBlock(blocks["source-code"]);
			}
		});
		
		
		return card;
	}
}

var TaskRegistry = {
	tasks: [],
	
	register: function(task) {
		this.tasks.push(task);
	},
	
	add_cards: function() {
		for (var i in this.tasks) {
			var task = this.tasks[i];
			var card = task.build_card("card" + i);
			append_card(card);
		}
	}
}

function RegisterTask(params) {
	TaskRegistry.register(new _Task(params));
}



var main_executable = new Executable({
	url: GIT_REPOSITORY_URL + SOURCE_PATH
});

/*
append_card(new Card("source-code", {
	content: {
		title: {
			"inner": "Source Code"
		},
		
		body: {
			"class": "card-body source-code",
			"inner": code_to_html(main_executable.source)
		}
	}
}));*/

main_executable.load();
if (main_executable.exception) {
	throw main_executable.exception;
}

TaskRegistry.add_cards();