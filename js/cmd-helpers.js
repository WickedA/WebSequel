var TContainer, TWrite, THInsertBlock, TShowPrompt, CExecute, CIssue, DBSave; // extern

function CExecuteHelperCmd(cmdline) {
	var tokens = cmdline.trim().split(" ");
	var cmd    = tokens[0];
	var argv   = tokens.slice(1);
	if(cmd in CMDDB) {
		try {
			CMDDB[cmd][0].apply(this, argv);
		} catch(ex) {
			TWrite("<span class='error'>" + _.escape(ex) + "</span>");
		}
	} else {
		TWrite("<span class='error'>Helper command " + _.escape(cmd) + " not found.</span>");
	}
	TShowPrompt();
}

var CMDDB = {
	".help": [CXHelp, TR.cmdhelp.help],
	".about": [CXVersionInfo, TR.cmdhelp.about],
	".save": [CXSave, TR.cmdhelp.save],
	".purge": [CXPurgeStorage, TR.cmdhelp.purge],
	".import": [CXImportBlob, TR.cmdhelp["import"]],
	".export": [CXExportBlob, TR.cmdhelp["export"]],
	".exportjs": [CXExport, TR.cmdhelp.exportjs],
	".tables": [CXTables, TR.cmdhelp.tables],
	".ct": [CXCreateTable, TR.cmdhelp.ct],
	".ac": [CXAddColumn, TR.cmdhelp.ac],
	".in": [CXInsertVal, TR.cmdhelp["in"]],
	".vt": [CXViewTable, TR.cmdhelp.vt],
	".va": [CXViewAll, TR.cmdhelp.va],
	".vc": [CXViewColumns, TR.cmdhelp.vc],
	".cls": [CXClear, TR.cmdhelp.cls]
}

function CXHelp() {
	var helpstr = "<ul>";
	_.each(Object.keys(CMDDB), function(key) {
		helpstr += "<li>" + CWrapInLink(key, key) + ": " + CMDDB[key][1]; + "</li>"
	});
	TWrite(helpstr + "</ul>");
}

function CXVersionInfo() {
	TWrite(TR.VersionInfo);
}

function CXPurgeStorage() {
	localStorage.removeItem("websequel-db");
	TWrite(TR.msg.storagePurged);
}

function CXTables() {
	CExecute("SELECT name, sql FROM sqlite_master WHERE type='table'");
}

function CXCreateTable(tablename, columns) {
	if(!tablename) throw(TR.err.noarg);
	var args = Array.prototype.slice.call(arguments);
	var colstr = _.reduce(args.slice(1), function(a, b) { return a + " " + b; });
	if(!columns) colstr = "id INTEGER PRIMARY KEY";
	CExecute("CREATE TABLE " + tablename + " (" + colstr + ")");
}

function CXAddColumn(tablename, columnname) {
	if(arguments.length < 3) throw(TR.err.noargs);
	var args = Array.prototype.slice.call(arguments);
	var typestr = _.reduce(args.slice(2), function(a, b) { return a + " " + b; });
	CExecute("ALTER TABLE " + tablename + " ADD COLUMN " + columnname + " " + typestr);
}

function CXInsertVal(tablename) {
	if(arguments.length < 2) throw(TR.err.noargs);
	var args = Array.prototype.slice.call(arguments);
	var valstr = _.reduce(args.slice(1), function(a, b) { return a + " " + b; });
	CExecute("INSERT OR REPLACE INTO " + tablename + " VALUES (" + valstr + ")");
}

function CXExport() {
	var encoded = encodeURIComponent(DBStorageEncode(DB.export()));
	var jscode = 'OldDB=DB;DB=new SQL.Database(DBStorageDecode(decodeURIComponent("' + encoded + '")));DBSave()';
	TWrite(TR.msg.cxExport);
	THInsertBlock(crel("pre", {"class": "dbexport", "onclick":
		"var sel = window.getSelection(); sel.removeAllRanges(); var range = document.createRange(); range.selectNodeContents(this); sel.addRange(range);"
	}, jscode));
}

function CXExportBlob() {
	var url = window.URL.createObjectURL(new Blob([DB.export().buffer]));
	THInsertBlock(crel("div",
		crel("span", TR.msg.useSaveLinkAs),
		crel("a", {"href": url}, url)));
	TWrite(TR.msg.useExportjs);
}

function CXImportBlob() {
	var button = crel("input", {"type": "file"});
	button.onchange = function() {
		var f = button.files[0];
		var reader = new FileReader();
		reader.onload = function() {
			var data = new Uint8Array(reader.result);
			DB = new SQL.Database(data);
			DBSave();
			window.location.reload(true);
		}
		reader.readAsArrayBuffer(f);
	}
	THInsertBlock(crel("div", {"class": "import"}, crel("div", TR.msg.loadDBFile), button));
}

function CXSave() {
	DBSave();
	TWrite(TR.msg.dbSaved);
}

function CXViewTable(tablename) {
	if(!tablename) throw(TR.err.noarg);
	CExecute("SELECT * FROM " + tablename);
}

function CXViewAll() {
	var tables = _.map(DB.exec("SELECT name FROM sqlite_master WHERE type='table'")[0].values, function(a) { return a[0]; });
	_.each(tables, function(tn) {
		TWrite("<h3>" + tn + "</h3>");
		CExecute("SELECT * FROM " + tn, false);
	});
	TShowPrompt();
}

function CXViewColumns(tablename) {
	if(!tablename) throw(TR.err.noarg);
	CExecute("PRAGMA table_info(" + tablename + ")");
}

function CXClear() {
	TContainer.innerHTML = "";
	TShowPrompt();
}
