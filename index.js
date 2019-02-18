const winston = require('winston')
const commandLineArgs = require('command-line-args')
const path = require('path')
const fs = require('fs')

// log to file
const logger = initLogger()

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

logger.info(`--- Start ---`)
logger.info(`options:`)
logger.info(JSON.stringify(options))

// check if path to scan exists
if (!exists(options.scan)) {
	logger.error(`Path not exists: ${options.scan}`)
	return
}

// destination path for shortcuts
const destination =
	settings.labels[options.label.toLowerCase()] || settings.labels.default

// single file torrent - in torrent downloads folder
const isSingleFile =
	path.dirname(options.scan) === path.dirname(settings.torrentsFolder)

let files
let folderName

if (isSingleFile) {
	// single file
	files = Promise.resolve(path.join(options.scan, options.name))
} else {
	// get folder name
	folderName = path.basename(options.scan)

	// in folder file/s
	files = scanFolder(options.scan)
		.then(filterVideos)
		.catch(error => logger.error(`In folder files error: ${error}`))
}

files
	.then(files =>
		handleShortcuts(files, destination, folderName || options.name)
	)
	.then(result => {
		logger.info(result)
		logger.info(`-- Done --`)
	})
	.catch(error => logger.error(`files - handleShortcuts error: ${error}`))

// log to file
function initLogger() {
	const jsonTimestampFormat = winston.format.printf(
		({ level, message, timestamp }) => {
			return `${timestamp} [${level}]: ${message}`
		}
	)
	return winston.createLogger({
		format: winston.format.combine(
			winston.format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
			jsonTimestampFormat
		),
		transports: [
			new winston.transports.Console(),
			new winston.transports.File({
				filename: 'console.log',
			}),
		],
	})
}
