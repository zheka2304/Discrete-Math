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
				build: function(block) {
				
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

var __task_counter = 0;

function _Task(params) {
	for (var param in params) {
		this[param] = params[param];
	}
	
	this.unique_id = __task_counter++;
	
	this.build_html = function() {
		var html = "";
		for (var i in this.functions) {
			html += code_to_html(this.functions[i] + "") + "<br><br>"
		}
		return html;
	}
	
	this.build_card = function(id) {
		var self = this;
		var code = this.build_html()
		
		var card = new Card(id, {
			content: {
				title: {inner: "Task: " + this.name},
				body: {inner: [
					{
						"tag": "div",
						"id": "source-code",
						"inner": code
					},
					{
						"tag": "div",
						"id": "io",
						"inner": []
					}
				]}
			},
			
			blocks: ["source-code", "io"],
			
			added: function(c, blocks) {
				var code_block = blocks["source-code"];
				if (code_block) {
					hljs.highlightBlock(code_block);
					code_block.className = "source-code";
				}

				var io_block = blocks["io"];
				if (io_block) {
					for (var i in self.inputs) {
						var input = self.inputs[i];
						var input_block = document.createElement('div');
						io_block.appendChild(input_block);
						input.build(input_block, self, id + "-" + i);
						if (i != self.inputs.length - 1) {
							io_block.appendChild(document.createElement('br'));
						}
					}			

					var on_click_id = "__clicker" + self.unique_id;
					var btn_id = id + "-exec"
					var btn_html = json_to_html({
						"tag": "div",
						"class": "text-center mt-4",
						"inner": [{
							"tag": "button",
							"class": "btn btn-info btn-md",
							"id": btn_id,
							"onclick": on_click_id + "()",
							"inner": "Execute"
						}]
					});
					
					var result_id = id + "-res";
					io_block.innerHTML += btn_html;
					io_block.innerHTML += json_to_html({
						"tag": "div",
						"class": "mt-4",
						"id": result_id
					});
					
					__global__[on_click_id] = function() {
						try {
							var result_block = document.getElementById(result_id);
							
							var args = [];
							for (var i in self.inputs) {
								args.push(self.inputs[i].get());
							}
						
							result_block.className = "source-code";
							var res = self.caller.apply(self, args);
							if (self.output) {
								res = self.output(res, args);
							}
							result_block.innerHTML = "" + res;
						} catch (err) {
							result_block.className = "error-text"
							result_block.innerHTML = code_to_html("Error: " + err.stack);
						}
					};
					
				}
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

main_executable.load();

function ErrorCard(id, err) {
	var code = code_to_html(err.stack);
	
	this.parent = Card;
	this.parent(id, {
		content: {
			title: {"inner": err},
			body: {
				"tag": "div",
				"class": "error-text",
				"inner": code
			}
		}
	});
}

if (main_executable.exception) {
	append_card(new ErrorCard("exception", main_executable.exception));
}

TaskRegistry.add_cards();