var api_module_list = [];

get_module_list(GIT_REPOSITORY_URL + API_MODULES_PATH).map(function(path) {
	api_module_list[api_module_list.length] = new Executable({
		url: GIT_REPOSITORY_URL + path
	});
});

api_module_list.map(function(module) {
	module.load();
	if (module.exception != null) {
		alert("error in module: " + module.exception);
	}
});

var main_executable = new Executable({
	url: GIT_REPOSITORY_URL + SOURCE_PATH
});

main_executable.load();