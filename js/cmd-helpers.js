// This file contains the code for WebSequel's helper commands.

// Note that a lot of these will construct SQL queries the same way the average
// PHP coder would, with reckless string-concatenating abandon. Before you
// bring out the pitchforks, note that this is all client-side code and SQL
// injection is utterly irrelevant.

// Also, even ignoring the above, the way these commands get their arguments is
// nothing short of awful and should probably be fixed so I don't have to go
// insane if I ever want to add a command.

// Declared in other files:
var TContainer, TWrite, TAddBlock, TShowPrompt, CExecute, CIssue, DBSave, TR;

// The list of commands with their corresponding functions and help strings:
var CMDDB = {
    ".help":     [CXHelp,         TR.cmdhelp["help"]],
    ".about":    [CXVersionInfo,  TR.cmdhelp["about"]],
    ".save":     [CXSave,         TR.cmdhelp["save"]],
    ".purge":    [CXPurgeStorage, TR.cmdhelp["purge"]],
    ".import":   [CXImportBlob,   TR.cmdhelp["import"]],
    ".export":   [CXExportBlob,   TR.cmdhelp["export"]],
    ".exportjs": [CXExport,       TR.cmdhelp["exportjs"]],
    ".tables":   [CXTables,       TR.cmdhelp["tables"]],
    ".ct":       [CXCreateTable,  TR.cmdhelp["ct"]],
    ".ac":       [CXAddColumn,    TR.cmdhelp["ac"]],
    ".in":       [CXInsertVal,    TR.cmdhelp["in"]],
    ".vt":       [CXViewTable,    TR.cmdhelp["vt"]],
    ".va":       [CXViewAll,      TR.cmdhelp["va"]],
    ".vc":       [CXViewColumns,  TR.cmdhelp["vc"]],
    ".cls":      [CXClear,        TR.cmdhelp["cls"]],
    ".example":  [CXLoadExample,  TR.cmdhelp["example"]],
}

// Execute a helper command. The passed cmdline is assumed to be unmodified,
// and the initial dot should be there.
function CExecuteHelperCmd(cmdline) {
    // Grab the relevant parts of the command line.
    var tokens = cmdline.trim().split(" ");
    var cmd    = tokens[0];
    var argv   = tokens.slice(1);
    // Find the helper function and try to execute it.
    if(cmd in CMDDB) {
        try {
            CMDDB[cmd][0].apply(this, argv);
        } catch(ex) {
            TWrite("<span class='error'>" + _.escape(ex) + "</span>");
        }
    } else {
        TWrite("<span class='error'>Helper command " + _.escape(cmd) +
            " not found.</span>");
    }
    // Show the prompt after we're done.
    TShowPrompt();
}

// .help: show help for each command.
function CXHelp() {
    var helpstr = "<ul>";
    _.each(Object.keys(CMDDB), function(key) {
        helpstr += "<li>" + CWrapInLink(key, key) + ": " + CMDDB[key][1]; +
            "</li>";
    });
    TWrite(helpstr + "</ul>");
}

// .about: show version information and credits.
function CXVersionInfo() {
    TWrite(TR.VersionInfo);
}

// .purge: erases the database from LocalStorage (but not from memory).
function CXPurgeStorage() {
    localStorage.removeItem("websequel-db");
    TWrite(TR.msg.storagePurged);
}

// .tables: shows all the tables currently in the database.
function CXTables() {
    CExecute("SELECT name, sql FROM sqlite_master WHERE type='table'");
}

// .ct: create a table with the specified columns. Adds a single "id" column if
// none are specified. The columns argument is there for clarity and not
// actually used, as it would only contain the first column name.
function CXCreateTable(tablename, columns) {
    if(!tablename) throw(TR.err.noarg);
    var args = Array.prototype.slice.call(arguments);
    var colstr = _.reduce(args.slice(1), function(a, b) {
        return a + " " + b;
    });
    if(!columns) colstr = "id INTEGER PRIMARY KEY";
    CExecute("CREATE TABLE " + tablename + " (" + colstr + ")");
}

// .ac: add a column to a table.
function CXAddColumn(tablename, columnname) {
    if(arguments.length < 3) throw(TR.err.noargs);
    var args = Array.prototype.slice.call(arguments);
    var typestr = _.reduce(args.slice(2), function(a, b) {
        return a + " " + b;
    });
    CExecute("ALTER TABLE " + tablename + " ADD COLUMN " + columnname + " " +
        typestr);
}

// .in: insert/replace a row.
function CXInsertVal(tablename) {
    if(arguments.length < 2) throw(TR.err.noargs);
    var args = Array.prototype.slice.call(arguments);
    var valstr = _.reduce(args.slice(1), function(a, b) {
        return a + " " + b;
    });
    CExecute("INSERT OR REPLACE INTO " + tablename + " VALUES (" + valstr +
        ")");
}

// .exportjs: export the database as a JS string to paste into a console.
// Probably useless now that .export exists, but I'm keeping it.
function CXExport() {
    var encoded = encodeURIComponent(DBStorageEncode(DB.export()));
    var jscode = 'OldDB=DB;DB=new SQL.Database(DBStorageDecode(' +
        'decodeURIComponent("' + encoded + '")));DBSave()';
    TWrite(TR.msg.cxExport);
    TAddBlock(crel("pre", {"class": "dbexport", "onclick":
        "var sel = window.getSelection(); sel.removeAllRanges();" +
        "var range = document.createRange(); range.selectNodeContents(this);" +
        " sel.addRange(range);"
    }, jscode));
}

// .export: export the database as an SQLite database file.
function CXExportBlob() {
    var url = window.URL.createObjectURL(new Blob([DB.export().buffer]));
    TAddBlock(crel("div",
        crel("span", TR.msg.useSaveLinkAs),
        crel("a", {"href": url}, url)));
    TWrite(TR.msg.useExportjs);
}

// .import: import an SQLite database file.
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
    TAddBlock(crel("div", {"class": "import"},
        crel("div", TR.msg.loadDBFile),
        button));
}

// .save: save the in-memory database to LocalStorage.
function CXSave() {
    DBSave();
    TWrite(TR.msg.dbSaved);
}

// .vt: show the contents of a table. Would not recommend for big tables.
function CXViewTable(tablename) {
    if(!tablename) throw(TR.err.noarg);
    CExecute("SELECT * FROM " + tablename);
}

// .va: show the contents of all tables. Would not recommend for big DBs.
function CXViewAll() {
    var tables = _.map(DB.exec(
            "SELECT name FROM sqlite_master WHERE type='table'"
        )[0].values, function(a) { return a[0]; });
    _.each(tables, function(tn) {
        TWrite("<h3>" + tn + "</h3>");
        CExecute("SELECT * FROM " + tn, false);
    });
    TShowPrompt();
}

// .vc: view the columns of a specific database.
function CXViewColumns(tablename) {
    if(!tablename) throw(TR.err.noarg);
    CExecute("PRAGMA table_info(" + tablename + ")");
}

// .cls: clear the fake terminal.
function CXClear() {
    TContainer.innerHTML = "";
    TShowPrompt();
}

// .example: loads the Chinook example database from js/exampledb.js
function CXLoadExample() {
    var scriptTag = document.createElement("script");
    scriptTag.src = "js/exampledb.js";
    document.body.appendChild(scriptTag);
}