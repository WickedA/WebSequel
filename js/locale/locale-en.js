var TJoin, CWrapInLink; // extern

TR = {
	ver: "1.6",
	cmdhelp: {
		help:     "Shows a list of helper commands and their documentation strings.",
		about:    "Shows version, author info and credits.",
		save:     "Forces a LocalStorage save.",
		purge:    "Erases the current database from LocalStorage.",
		"import": "Lets you import an SQLite database file.",
		"export": "Exports the database as an SQLite database file you can save.",
		exportjs: "Gives you a JavaScript snippet you can use to reload the database.",
		tables:   "Returns the list of tables in the database.",
		ct:       "Creates a new table. If no columns are specified, adds an id column. Syntax: .ct [table-name] [column1] [type1], ...",
		ac:       "Adds a column to a table. Syntax: .ac [table-name] [column] [type]",
		"in":     "Inserts or replaces a row. Syntax: .in [table-name] [column1-value], ...",
		vt:       "Shows you the contents of one table. Not recommended for very large tables. Syntax: .vt [table-name]",
		va:       "Shows you the contents of all tables. Not recommended for very large tables.",
		vc:       "Lists the columns of one table. Syntax: .vc [table-name]",
		cls:      "Clears screen.",
	},
	msg: {
		storagePurged: "Storage purged. Running " + CWrapInLink(".save", ".save") + " will undo this.",
		cxExport: "Click anywhere to select. You can paste this code into your browser's JavaScript console to load the database at any time.",
		useSaveLinkAs: "Right click and use the 'Save Link As' option: ",
		useExportjs: "If that doesn't work, try the " + CWrapInLink(".exportjs", ".exportjs") + " command.",
		loadDBFile: "Load an SQLite database file: ",
		dbSaved: "Database saved.",
	},
	err: {
		noarg: "Required argument not given.",
		noargs: "Insufficient arguments given.",
		loadFailure: "sql.js failed to load - your browser may not be supported. Try the latest <a href='https://www.google.com/chrome/'>Chrome</a> or <a href='https://www.mozilla.org/firefox/'>Firefox</a>.",
	}
}

TR.MOTD = TJoin("Welcome to <i>WebSequel</i> " + TR.ver + "! This is an SQL playground based on SQLite.",
	"It comes with several helper commands - try " + CWrapInLink(".help", ".help") + " for starters.");

TR.VersionInfo = TJoin("This is <i>WebSequel</i> " + TR.ver + ".",
	"(C) 2015 Andy C. MIT-licensed.",
	"Uses the following third-party libraries:") +
	"<ul><li><a href='https://github.com/kripken/sql.js'>sql.js</a>, a JavaScript/Emscripten port of SQLite 3.8.7.4</li>" +
	"<li><a href='http://underscorejs.org/'>underscore.js</a>, a library of functional programming helpers by DocumentCloud</li>" +
	"<li><a href='https://github.com/KoryNunn/crel'>crel</a>, a DOM creation utility</li></ul>" +
	"Built for a school project.";