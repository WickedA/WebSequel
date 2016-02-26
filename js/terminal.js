// WebSequel uses a terminal-style user interface - a fake terminal, if you
// will. This file contains the functions required to use it. It's pretty much
// built using <div> and <input> elements, and probably has a bunch of bugs.

// Declared in other files:
var CExecute;
// Library functions:
var crel;
// Global objects:
var TContainer, TCurrentInput, TLastInput;
var TPrompt = ">";

// Initialize the fake terminal.
function TInit() {
    TContainer = document.getElementById("terminal-container");
}

// Append a DOM element to the terminal.
function TAddBlock(elem) {
    TContainer.appendChild(elem);
    return elem;
}

// Append some arbitrary HTML to the terminal.
function TWrite(html) {
    var block = crel("div", {"class": "terminal-block"});
    block.innerHTML = html;
    TAddBlock(block);
    return block;
}

// Joins any arbitrary number of HTML fragments.
// FIXME: is this actually used by anything?
function TJoin() {
    return _.reduce(arguments, function(a, b) { return a + "<br/>" + b; });
}

// Construct and show the terminal "prompt".
function TShowPrompt() {
    // TCurrentInput is the <input> element the user is going to type commands
    // into. If it already exists and isn't disabled, we ignore the TShowPrompt
    // call entirely.
    if(TCurrentInput)
        if(!TCurrentInput.disabled)
            return;
    // Build up the <form> that will actually be interacted with.
    var block = crel("form", {"class": "terminal-prompt"},
        crel("table", {"class": "layout-table"},
            crel("tr",
                crel("td", {"class": "prompt-td"},
                    crel("span", {"class": "nobreak prompt"}, TPrompt)),
                crel("td", {"class": "input"},
                    crel("input", {"type": "text"}))
            )
        )
    );
    // Add the constructed <form> to the terminal.
    TAddBlock(block);
    // Grab the <input> element and attach the appropriate event handlers.
    TCurrentInput = block.getElementsByTagName("input")[0];
    TCurrentInput.onkeypress = THandleInputOnKeypress;
    TCurrentInput.onkeydown = THandleInputOnKeydown;
    // Focus the prompt.
    TCurrentInput.focus();
}

// Disables the current <input>.
function TDisableInput() {
    TCurrentInput.disabled = true;
    TCurrentInput.onkeypress = undefined;
    TCurrentInput.onkeydown = undefined;
}

// Executes the typed command.
function THandleInputOnKeypress(ev) {
    var e = ev || window.event;
    if (e.keyCode === 13) {
        TDisableInput();
        CExecute(TCurrentInput.value);
        e.preventDefault();
    }
}

// Lets you use the Up key to get the last-typed command.
// TODO: actual command history.
function THandleInputOnKeydown(ev) {
    var e = ev || window.event;
    if (e.keyCode === 38 && TCurrentInput.value === "" && TLastInput) {
        TCurrentInput.value = TLastInput;
    }
}