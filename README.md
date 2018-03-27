# _WebSequel_

This is an in-browser playground for exploring SQL. It embeds SQLite and gives you a command-line style interface. [Try it out.](https://xndc.github.io/websequel)

If you want some example data to play around with, the [Chinook sample database](http://chinookdatabase.codeplex.com/) is included. Just use the `.example` command to load it. You can also open any SQLite database file from your computer - use `.import` to get a file selector.

I've fully tested WebSequel in Chrome and partially tested it in Firefox, IE11, Chrome for Android and Safari for iOS; no major issues have been encountered so far. Performance is mostly acceptable for small databases, but could probably be improved - rewriting the entire database in LocalStorage after every command is hardly optimal, for example.
