const fs = require('fs')
const path = require('path')
const ws = require('windows-shortcuts')

const exists = fullPath => {
	return fs.existsSync(fullPath)
}

// allowed video file extensions
const movieExtAllowed = ['.mkv', '.mp4', '.avi']

// return fullPath of any file under folderPath recursvly
const scanFolder = folderPath => {
	// store all paths to return
	let items = []

	// function promise
	return new Promise((resolveFunc, reject) => {
		/* +++++ Errors check +++++ */
		if (!folderPath) {
			reject(`No path provided`)
		}
		if (!fs.existsSync(folderPath)) {
			reject(`${folderPath} - Path not exists`)
		}
		/* ----- Errors check ----- */

		// scan folderPath and return all paths
		fs.readdir(folderPath, (err, paths) => {
			if (err) {
				reject(err)
			}

			// save each path promise to know when map is done
			// file == path (cant use path name)
			const promises = paths.map(file => {
				return new Promise(resolveFile => {
					const fullPath = path.join(folderPath, file)

					// if path is folder
					if (fs.lstatSync(fullPath).isDirectory()) {
						// scan folder within the main folder path
						scanFolder(fullPath).then(dirItems => {
							// marge dirItems with items array
							items = items.concat(dirItems)
							resolveFile()
						})
					} else {
						// add path
						items.push(fullPath)
						resolveFile()
					}
				})
			})

			// resolve the function with items when map all promises are done
			Promise.all(promises).then(() => {
				resolveFunc(items)
			})
		})
	})
}

// filter video files only
const filterVideos = files => {
	return new Promise((resolve, reject) => {
		// Errors check
		if (!files) {
			reject('No files provided')
		}
		if (!Array.isArray(files)) {
			reject('Files have to be an Array')
		}

		const videoFiles = files.filter(file => {
			const ext = path.extname(file)
			const fileName = path.basename(file, ext)

			// filter out any sample files
			if (fileName.includes('sample')) {
				return false
			}

			return movieExtAllowed.indexOf(ext) !== -1
		})

		resolve(videoFiles)
	})
}

// create a file shortcut
const createShortcut = (filePath, destinationPath) => {
	return new Promise((resolve, reject) => {
		const ext = path.extname(filePath)
		const fileName = path.basename(filePath, ext)
		const linkPath = path.join(destinationPath, `${fileName}.lnk`)

		// single item shortcut
		ws.create(linkPath, filePath, error => {
			if (error) {
				reject(error)
			} else {
				resolve(linkPath)
			}
		})
	})
}

// Create a shortcut to files
const handleShortcuts = (files, destinationPath, folderName) => {
	const isArray = Array.isArray(files)

	return new Promise((resolve, reject) => {
		if (isArray) {
			// new destination
			const newDestinationPath = path.join(destinationPath, folderName)
			console.log(newDestinationPath)

			// create folder
			fs.mkdirSync(newDestinationPath)

			// create folder and shortcut for each item
			let promises = files.map(file => {
				return createShortcut(file, newDestinationPath)
			})

			Promise.all(promises).then(resolve)
		} else {
			createShortcut(files, destinationPath).then(resolve)
		}
	})
}

module.exports = { scanFolder, filterVideos, exists, handleShortcuts }
