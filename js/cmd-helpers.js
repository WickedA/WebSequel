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
	".help": [CXHelp, "Shows a list of helper commands and their documentation strings."],
	".about": [CXVersionInfo, "Shows version, author info and credits."],
	".save": [CXSave, "Forces a LocalStorage save."],
	".purge": [CXPurgeStorage, "Erases the current database from LocalStorage."],
	".import": [CXImportBlob, "Lets you import an SQLite database file."],
	".export": [CXExportBlob, "Exports the database as an SQLite database file you can save."],
	".exportjs": [CXExport, "Gives you a JavaScript snippet you can use to reload the database."],
	".tables": [CXTables, "Returns the list of tables in the database."],
	".ct": [CXCreateTable, "Creates a new table. If no columns are specified, adds an id column. Syntax: .ct [table-name] [column1] [type1], ..."],
	".ac": [CXAddColumn, "Adds a column to a table. Syntax: .ac [table-name] [column] [type]"],
	".in": [CXInsertVal, "Inserts or replaces a row. Syntax: .in [table-name] [column1-value], ..."],
	".vt": [CXViewTable, "Shows you the contents of one table. Not recommended for very large tables. Syntax: .vt [table-name]"],
	".va": [CXViewAll, "Shows you the contents of all tables. Not recommended for very large tables."],
	".vc": [CXViewColumns, "Lists the columns of one table. Syntax. .vc [table-name]"],
	".cls": [CXClear, "Clears screen."]
}

function CXHelp() {
	var helpstr = "<ul>";
	_.each(Object.keys(CMDDB), function(key) {
		helpstr += "<li>" + CWrapInLink(key, key) + ": " + CMDDB[key][1]; + "</li>"
	});
	TWrite(helpstr + "</ul>");
}

function CXVersionInfo() {
	TWrite(TJoin("This is <i>WebSequel</i> 1.5.",
		"(C) 2015 Andy C. MIT-licensed.",
		"Uses the following third-party libraries:") +
	"<ul><li><a href='https://github.com/kripken/sql.js'>sql.js</a>, a JavaScript/Emscripten port of SQLite 3.8.7.4</li>" +
	"<li><a href='http://underscorejs.org/'>underscore.js</a>, a library of functional programming helpers by DocumentCloud</li>" +
	"<li><a href='https://github.com/KoryNunn/crel'>crel</a>, a DOM creation utility</li></ul>" +
	"Built for a school project.");
}

function CXPurgeStorage() {
	localStorage.removeItem("websequel-db");
	TWrite("Storage purged. Running " + CWrapInLink(".save", ".save") + " will undo this.");
}

function CXTables() {
	CExecute("SELECT name, sql FROM sqlite_master WHERE type='table'");
}

function CXCreateTable(tablename, columns) {
	if(!tablename) throw("CXCreateTable: no arguments given");
	var args = Array.prototype.slice.call(arguments);
	var colstr = _.reduce(args.slice(1), function(a, b) { return a + " " + b; });
	if(!columns) colstr = "id INTEGER PRIMARY KEY";
	CExecute("CREATE TABLE " + tablename + " (" + colstr + ")");
}

function CXAddColumn(tablename, columnname) {
	if(arguments.length < 3) throw("CXAddColumn: not enough arguments");
	var args = Array.prototype.slice.call(arguments);
	var typestr = _.reduce(args.slice(2), function(a, b) { return a + " " + b; });
	CExecute("ALTER TABLE " + tablename + " ADD COLUMN " + columnname + " " + typestr);
}

function CXInsertVal(tablename) {
	if(arguments.length < 2) throw("CXInsertVal: not enough arguments");
	var args = Array.prototype.slice.call(arguments);
	var valstr = _.reduce(args.slice(1), function(a, b) { return a + " " + b; });
	CExecute("INSERT OR REPLACE INTO " + tablename + " VALUES (" + valstr + ")");
}

function CXExport() {
	var encoded = encodeURIComponent(DBStorageEncode(DB.export()));
	var jscode = 'OldDB=DB;DB=new SQL.Database(DBStorageDecode(decodeURIComponent("' + encoded + '")));DBSave()';
	TWrite("Click anywhere to select. You can paste this code into your browser's JavaScript console to load the database at any time.");
	THInsertBlock(crel("pre", {"class": "dbexport", "onclick":
		"var sel = window.getSelection(); sel.removeAllRanges(); var range = document.createRange(); range.selectNodeContents(this); sel.addRange(range);"
	}, jscode));
}

function CXExportBlob() {
	var url = window.URL.createObjectURL(new Blob([DB.export().buffer]));
	THInsertBlock(crel("div",
		crel("span", "Right click and use the 'Save Link As' option: "),
		crel("a", {"href": url}, url)));
	TWrite("If that doesn't work, try the " + CWrapInLink(".exportjs", ".exportjs") + " command.");
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
	THInsertBlock(crel("div", {"class": "import"}, crel("div", "Load an SQLite database file: "), button));
}

function CXSave() {
	DBSave();
	TWrite("Database saved.");
}

function CXViewTable(tablename) {
	if(!tablename) throw("CXViewTable: no arguments given");
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
	if(!tablename) throw("CXViewColumns: no arguments given");
	CExecute("PRAGMA table_info(" + tablename ")");
}

function CXClear() {
	TContainer.innerHTML = "";
	TShowPrompt();
}
