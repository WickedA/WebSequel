var TContainer, TCurrentInput, CExecute, TLastInput; // extern

function THInsertBlock(domelement) {
	TContainer.appendChild(domelement);
	return domelement;
}

function THBuildPromptBlock() {
	return crel("form", {"class": "terminal-prompt"},
		crel("table", {"class": "layout-table"},
			crel("tr",
				crel("td", {"class": "prompt-td"},
					crel("span", {"class": "nobreak prompt"}, TPrompt)),
				crel("td", {"class": "input"},
					crel("input", {"type": "text"}))
			)
		)
	);
}

function THInputOnKeypress(ev) {
    var e = ev || window.event;
    if (e.keyCode === 13) {
        TCurrentInput.disabled = true;
        TCurrentInput.onkeypress = undefined;
        CExecute(TCurrentInput.value);
        e.preventDefault();
    }
}

function THInputOnKeydown(ev) {
    var e = ev || window.event;
	if (e.keyCode === 38 && TCurrentInput.value === "" && TLastInput) {
	    TCurrentInput.value = TLastInput;
	}
}

function THHMoveCursorToEnd(el) {
    if (typeof el.selectionStart == "") {
        el.selectionStart = el.selectionEnd = el.value.length;
    } else if (typeof el.createTextRange != "undefined") {
        el.focus();
        var range = el.createTextRange();
        range.collapse(false);
        range.select();
    }
}