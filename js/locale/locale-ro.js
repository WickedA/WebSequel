var TJoin, CWrapInLink; // extern

TR = {
	ver: "1.6",
	cmdhelp: {
		help:     "Afișează o listă de comenzi ajutătoare și documentația lor.",
		about:    "Afișează versiunea, detaliile despre autor și librăriile utilizate.",
		save:     "Forțează salvarea bazei de date în LocalStorage.",
		purge:    "Șterge baza de date salvată în LocalStorage.",
		"import": "Permite importarea unui fișier SQLite.",
		"export": "Exportă baza de date ca un fișier SQLite.",
		exportjs: "Exportă baza de date sub formă de cod JavaScript care poate fi rulat în consola browserului.",
		tables:   "Afișează o listă a tabelelor din baza de date.",
		ct:       "Creează o tabelă nouă. Dacă nu se specifică nicio coloană, una pentru id este adăugată. Sintaxă: .ct [table-name] [column1] [type1], ...",
		ac:       "Adaugă o coloană unei tabele existente. Sintaxă: .ac [table-name] [column] [type]",
		"in":     "Inserează sau înlocuiește un rând într-o tabelă. Sintaxă: .in [table-name] [column1-value], ...",
		vt:       "Afișează conținutul unei tabele. Nu se recomandă pentru tabele mari. Sintaxă: .vt [table-name]",
		va:       "Afișează conținutul tuturor tabelelor. Nu se recomandă pentru baze de date mari.",
		vc:       "Afișează coloanele unei tabele. Sintaxă: .vc [table-name]",
		cls:      "Șterge ecranul.",
	},
	msg: {
		storagePurged: "LocalStorage golit. Folosiți " + CWrapInLink(".save", ".save") + " pentru a anula.",
		cxExport: "Click oriunde pentru selectare. Puteți copia acest cod în consola browserului pentru a încărca baza de date oricând.",
		useSaveLinkAs: "Folosiți opțiunea 'Save Link As' din meniul de click dreapta: ",
		useExportjs: "Dacă nu funcționează, folosiți comanda " + CWrapInLink(".exportjs", ".exportjs") + ".",
		loadDBFile: "Încărcați un fișier de bază de date SQLite: ",
		dbSaved: "Bază de date salvată.",
	},
	err: {
		noarg: "Un parametru necesar nu a fost introdus.",
		noargs: "Unul sau mai mulți parametri necesari nu au fost introduși.",
		loadFailure: "sql.js nu s-a încărcat - browserul dvs. s-ar putea să nu fie suportat. Încercați <a href='https://www.google.com/chrome/'>Chrome</a> sau <a href='https://www.mozilla.org/firefox/'>Firefox</a>.",
	}
}

TR.MOTD = TJoin("Bun venit la <i>WebSequel</i> " + TR.ver + "! Acesta este un mediu pentru experimentarea cu SQL, folosind baza de date SQLite.",
	"Vine cu câteva comenzi ajutătoare - încercați " + CWrapInLink(".help", ".help") + " pentru început.");

TR.VersionInfo = TJoin("Acesta este <i>WebSequel</i> " + TR.ver + ".",
	"(C) 2015 Andy C. Licențiat sub MIT.",
	"Folosește următoarele librării:") +
	"<ul><li><a href='https://github.com/kripken/sql.js'>sql.js</a>, un port al SQLite 3.8.7.4 pentru JavaScript</li>" +
	"<li><a href='http://underscorejs.org/'>underscore.js</a>, o librărie ajutătoare pentru programare funcțională</li>" +
	"<li><a href='https://github.com/KoryNunn/crel'>crel</a>, o librărie pentru lucrul cu DOM</li></ul>" +
	"Construit pentru un proiect școlar.";