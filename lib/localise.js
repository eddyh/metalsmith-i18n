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
      const locales = options.alternativeLocales.concat(options.defaultLocale)

      // Loop on each locale
      locales.forEach(function(locale) {
        const h = helpers(Object.assign({lng: locale}, options))

        // Process only the ones that match our pattern
        if (fileMatchesPattern(file, options.pattern)) {
            // Copy the original file object, determine its new path.
            const locFile = Object.assign({}, files[file]),
                  locPath = h.localisedFilePath(file, locale)

            // Add the current locale and helpers
            locFile.locale = locale
            locFile.t      = h.t
            locFile.tt     = h.tt
            locFile.tpath  = h.tpath

            files[locPath] = locFile
        } else {
          // Simply copy the file
          const locFile = Object.assign({}, files[file]),
                locPath = h.localisedFilePath(file, locale)

          files[locPath] = locFile
        }
      })
    })

    done()
  }
}
