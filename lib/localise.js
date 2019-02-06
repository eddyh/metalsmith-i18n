'use strict'

var helpers     = require('./helpers'),
    multimatch  = require('multimatch')

function fileMatchesPattern(file, pattern) {
  return !!(multimatch([file], pattern).length)
}

module.exports = function(options) {
  return function(files, metalsmith, done) {
    // Loop through all of the files
    Object.keys(files).forEach(function(file) {

      // Process only the ones that match our pattern
      if (fileMatchesPattern(file, options.pattern)) {
        // Copy the original file object, determine its new path.
        const h = helpers(Object.assign({lng: options.buildLocale}, options))
        const locFile = Object.assign({}, files[file]),
              locPath = h.filePath(file, options.buildLocale)

        // Add the current locale and helpers
        locFile.locale = options.buildLocale
        locFile.t      = h.t
        locFile.tt     = h.tt
        locFile.tpath  = h.tpath
        files[locPath] = locFile
      }
    })

    done()
  }
}
