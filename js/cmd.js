// This file contains the part of WebSequel in charge of actually executing
// commands typed in by the user.

// Declared in other files:
var DB, TWrite, TShowPrompt, TCurrentInput, TAddBlock, TLastInput, DBSave,
    TDisableInput, CExecuteHelperCmd;

// Execute a command. cmdline is the command line to be executed, and prompt
// decides whether to run TShowPrompt after execution or not.
function CExecute(cmdline, prompt) {
    if(prompt === undefined) prompt = true;
    // TLastInput is used for the primitive command history implementation.
    // See THandleInputOnKeydown in terminal.js.
    TLastInput = cmdline;
    
    // Commands that start with a period are WebSequel helper commands.
    if(cmdline[0] === ".") return CExecuteHelperCmd(cmdline);
    
    // Those that don't are SQL queries which we try to execute here.
    try {
        var res = DB.exec(cmdline);
        // If the query returns something, we'll have to display it.
        if(res !== []) {
            _.each(_.map(res, CGenerateTable), function(b) {
                TAddBlock(b);
            });
        }
    } catch(ex) {
        TWrite("<span class='error'>SQL " + _.escape(ex) + "</span>");
    }
    
    // Try to save the database after each query.
    // FIXME: this is kind of wasteful. Can we check for changes rather than
    // blindly rewrite the database after each query?
    try {
        DBSave();
    } catch(ex) {
        TWrite("<span class='error'>" + _.escape(ex) + "</span>");
    }

    if(prompt) TShowPrompt();
}

// "Issue" a command. This poorly-named function is basically just CExecute,
// but writes the command line into the current <input> so the user knows what
// it's executing.
function CIssue(cmdline) {
    TShowPrompt();
    TCurrentInput.value = cmdline;
    TDisableInput();
    CExecute(cmdline);
}

// Create a clickable link that executes the given command. Returns HTML, for
// some long-forgotten reason.
function CWrapInLink(cmdline, linktext) {
    return "<a href='javascript:CIssue(\"" + cmdline + "\");'>" + linktext +
        "</a>";
}

// Generates an HTML table from an SQL query result. Returns DOM elements.
function CGenerateTable(result) {
    var th = crel("tr", _.map(result.columns, function(col) {
        return crel("th", col);
    }));
    var trs = _.map(result.values, function(row) {
        return crel("tr", _.map(row, function(col) {
            return crel("td", col);
        }));
    });
    return crel("table", {"class": "sql-result"}, th, trs);
}
