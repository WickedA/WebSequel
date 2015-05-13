var DB;

// TODO: actually document these. After figuring out how they work.
function DBStorageEncode(arr) {
	var uarr = new Uint8Array(arr);
    var strings = [], chunksize = 0xffff;
    // There is a maximum stack size. We cannot call String.fromCharCode with as many arguments as we want
    for (var i=0; i*chunksize < uarr.length; i++) {
        strings.push(String.fromCharCode.apply(null, uarr.subarray(i*chunksize, (i+1)*chunksize)));
    }
    return strings.join('');
}
function DBStorageDecode(str) {
    var l = str.length,
            arr = new Uint8Array(l);
    for (var i=0; i<l; i++) arr[i] = str.charCodeAt(i);
    return arr;
}

function DBSave() {
	window.localStorage.setItem("websequel-db", DBStorageEncode(DB.export()));
}

function MainInit() {
	TInit();
	if(typeof(SQL) !== "undefined") {
		TWrite(TR.MOTD);
		var StoredDatabase = localStorage.getItem("websequel-db");
		if(StoredDatabase !== null) {
			DB = new SQL.Database(DBStorageDecode(StoredDatabase));
			CExecute("SELECT name, sql FROM sqlite_master WHERE type='table'");
		} else {
			DB = new SQL.Database();
		}
		TShowPrompt();
		console.log("All OK.");
	} else {
		TWrite("<span class='error'>" + TR.err.loadFailure + "</span>");
		console.log("sql.js failed to load.")
	}
}