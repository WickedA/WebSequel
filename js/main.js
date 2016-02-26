// Welcome to WebSequel!
// This file just contains a few helper functions for dealing with the database
// that should probably be moved out, and the MainInit() function that gets
// called when you load the page.

// Global SQL.Database object:
var DB;

// Convert an Uint8Array to a string so it can be stored in LocalStorage.
// Probably taken from StackOverflow.
function DBStorageEncode(uarr) {
    //var uarr = new Uint8Array(arr);
    var strings = [], chunksize = 0xffff;
    // There is a maximum stack size. We cannot call String.fromCharCode with
    // as many arguments as we want
    for (var i=0; i*chunksize < uarr.length; i++) {
        strings.push(String.fromCharCode.apply(null, uarr.subarray(i*chunksize,
            (i+1)*chunksize)));
    }
    return strings.join('');
}

// Convert a string to a Uint8Array.
// Probably also taken from StackOverflow.
function DBStorageDecode(str) {
    var l = str.length,
            arr = new Uint8Array(l);
    for (var i=0; i<l; i++) arr[i] = str.charCodeAt(i);
    return arr;
}

// Save the global database to LocalStorage.
function DBSave() {
    window.localStorage.setItem("websequel-db", DBStorageEncode(DB.export()));
}

// Load the global database from LocalStorage if possible, or create a new one.
function DBLoad() {
    var StoredDatabase = localStorage.getItem("websequel-db");
    if(StoredDatabase !== null) {
        DB = new SQL.Database(DBStorageDecode(StoredDatabase));
        CExecute("SELECT name, sql FROM sqlite_master WHERE type='table'");
    } else {
        DB = new SQL.Database();
    }
}

// Initialize the fake terminal and database. Prints an error message to the
// terminal if sql.js is unavailable for some reason.
function MainInit() {
    TInit();
    if(typeof(SQL) !== "undefined") {
        TWrite(TR.MOTD);
        DBLoad();
        TShowPrompt();
        console.log("All OK.");
    } else {
        TWrite("<span class='error'>" + TR.err.loadFailure + "</span>");
        console.log("sql.js failed to load.")
    }
}