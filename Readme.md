#torrent-create-shortcut
Node.js script for any torrent client to execute when a download is finished.
Creating a shortcut lnk for video files to a folder by labels.

The script will create a new folder for any torrent files with multiple video files, like whole seasons, ignoring samples files.

## Installation

1.  Download and install [Node.js](https://nodejs.org/en/)
2.  [Fork](https://github.com/liorsh69/torrent-create-shortcut/fork)/[Download](https://github.com/liorsh69/torrent-create-shortcut/archive/master.zip)/[Git clone](https://help.github.com/articles/duplicating-a-repository/) this repository
3.  Run `install.bat` (just doing `npm install` to install dependencies)
4.  Edit `settings.json` (see "Folders & Labels" below)
5.  Edit Torrent client Settings

## Torrent client Settings:

1. Go to settings -> Run Program.
2. Copy and change paths to `start.bat`.

`start.exe` is the same as `start.bat`.
its only to run node hidden so it won't pop up a new console window.

```
// Notice the quotes(")
"C:\Path\To\torrent-create-shortcut\start.exe" -n %F -s %D -l %L
```

## Folders & Labels

Edit `settings.json` to add labels and there corresponding folders.

settings.json

```JavaScript
{
    // Torrent client downloads folder
	"torrentsFolder": "C:\\Torrents",

	// key: label name - Always use lower case here.
	// you can use any case in your torrent client.

    // value: full folder path
    // NOTE: escape \. use double \\.

	"labels": {
		"movies": "C:\\Path\\To\\Movies",
		"series": "C:\\Path\\To\\Series",
		"default": "C:\\Path\\To\\Downloads"
	}
}
```

## Contributing

When contributing to this repository, please **first discuss** the change you wish to make via **issue or email** with me before making a change.

-   When writing/rewriting make sure to comment with as much information as you can
-   Make sure to test as you write to prevent any errors
-   **always** Push to dev branch
-   If approved - the changes are going to get tested using dev branch
-   Create & use `privateSettings.json` for your own settings
