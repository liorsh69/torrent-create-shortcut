#torrent-create-shortcut
Node.js script for any torrent client to execute when a download is finished. <br>
Creating a shortcut lnk for video files to a folder by labels. <br>
<br>
The script will create a new folder for any torrent files with multiple video files, like whole seasons, ignoring samples files. <br>

## Instalation

1.  Download and install [Node.js](https://nodejs.org/en/)
2.  [Fork](TODO:)/[Download](TODO:)/[Git clone](https://help.github.com/articles/duplicating-a-repository/) this repository.
3.  npm install dependencies

## Torrent client Settings:

Go to settings -> Run Program <br>
Copy and change paths to start.bat <br>
<br>
start.exe is the same as start.bat <br>
its only to run node hidden so it wont pop up a new console window <br>

```
// Notice the quotes(")
"C:\Path\To\torrent-create-shortcut\start.exe" -n %F -s %D -l %L
```

## Folders & Labels

Edit settings.json to add labels and there corresponding folders <br>
settings.json <br>

```JavaScript
{
    // Torrent client downloads folder
	"torrentsFolder": "C:\\Torrents",

	// key: label name - Always use lower case here.
	// you can use any case in your torrent client.

    // value: full folder path
    // NOTE: escape \. use double \\.

	"labels": {
		"movies": "C:\\Users\\Lior\\Desktop\\Movies",
		"series": "C:\\Users\\Lior\\Desktop\\Series",
		"default": "C:\\Users\\Lior\\Downloads"
	}
}
```
