const commandLineArgs = require('command-line-args')
const path = require('path')
const fs = require('fs')

const {
	scanFolder,
	filterVideos,
	exists,
	handleShortcuts,
} = require('./lib/handleFiles')

// load settings - for contributors use privateSettings.json
var settings
if (exists('./privateSettings.json')) {
	settings = JSON.parse(fs.readFileSync('./privateSettings.json', 'utf8'))
} else {
	settings = JSON.parse(fs.readFileSync('./settings.json', 'utf8'))
}

// command line types
const optionDefinitions = [
	// file name for a single file
	{ name: 'name', alias: 'n', type: String },
	// folder to scan
	{ name: 'scan', alias: 's', type: String },
	// file label
	{ name: 'label', alias: 'l', type: String },
]

// command line arguments object
const options = commandLineArgs(optionDefinitions, {
	partial: true, // include unknown args
})

if (!exists(options.scan)) {
	console.error('Path not exists')
	return
}

// destination path for shortcuts
const destination = settings.labels[options.label] || settings.labels.default

// single file torrent - in downloads foldertest-single-file
const singleFile =
	path.dirname(options.scan) === path.dirname(settings.torrentsFolder)

let files

if (singleFile) {
	// single file
	files = Promise.resolve(path.join(options.scan, options.name))
} else {
	// in folder file/s
	files = scanFolder(options.scan).then(filterVideos)
}

files
	.then(files => handleShortcuts(files, destination, options.name))
	.then(console.log)
	.catch(console.error)
