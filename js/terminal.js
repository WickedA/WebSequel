var THInsertBlock, THBuildPromptBlock, THInputOnKeypress, THInputOnKeydown, CExecute; // extern
var TContainer, TCurrentInput, TLastInput;
var TPrompt = ">";

function TInit() {
	TContainer = document.getElementById("terminal-container");
}

function TShowPrompt() {
	if(TCurrentInput) if(!TCurrentInput.disabled) return;
	var block = THBuildPromptBlock();
	THInsertBlock(block);
	TCurrentInput = block.getElementsByTagName("input")[0];
	TCurrentInput.onkeypress = THInputOnKeypress;
	TCurrentInput.onkeydown = THInputOnKeydown;
	TCurrentInput.focus();
}

function TWrite(html) {
	var block = crel("div", {"class": "terminal-block"});
	block.innerHTML = html;
	THInsertBlock(block);
}

function TWriteLine() {
	TWrite("<br />");
}

function TJoin() {
	return _.reduce(arguments, function(a, b) { return a + "<br/>" + b; });
}