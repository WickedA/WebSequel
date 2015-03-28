var DB, TWrite, TShowPrompt, TCurrentInput, THInsertBlock, TLastInput, DBSave, CExecuteHelperCmd; // extern

function CExecute(cmdline, prompt) {
    TLastInput = cmdline;
	if(prompt === undefined) prompt = true;
	if(cmdline[0] === ".") return CExecuteHelperCmd(cmdline);
	try {
		var res = DB.exec(cmdline);
		if(res !== []) {
			_.each(_.map(res, CHGenerateTable), function(b) { THInsertBlock(b); });
		}
	} catch(ex) {
		TWrite("<span class='error'>SQL " + _.escape(ex) + "</span>");
	}
	if(prompt) TShowPrompt();
	try {
		DBSave();
	} catch(ex) {
		TWrite("<span class='error'>" + _.escape(ex) + "</span>");
	}
}

function CIssue(cmdline) {
	TShowPrompt();
	TCurrentInput.value = cmdline;
	TCurrentInput.disabled = true;
	CExecute(cmdline);
}

function CWrapInLink(cmdline, linktext) {
	return "<a href='javascript:CIssue(\"" + cmdline + "\");'>" + linktext + "</a>";
}

function CHGenerateTable(reso) {
	var th = crel("tr", _.map(reso.columns, function(col) {
		return crel("th", col);
	}));
	var trs = _.map(reso.values, function(row) {
		return crel("tr", _.map(row, function(col) {
			return crel("td", col);
		}));
	});
	return crel("table", {"class": "sql-result"}, th, trs);
}