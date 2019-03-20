'use strict'

var localise = require('./localise')

/**

 Forks multiple versions of the website (one for each locale).

 @param {Object}            options
 @param {String|String[]}   pattern             - A list of patterns to match files against.
 @param {String}            defaultLocale       - Default locale will be locale of the files in root.
 @param {String|String[]}   alternativeLocales  - Each alternative locale will be in the /XX folders.
 @param {Object}            i18n                - Instance of an i18n provider.

      Given the original path /folder/file.html and an 'en' locale, the
      following variables are available for substitution:

        :file     => /folder/file.html
        :ext      => .html
        :base     => file.html
        :dir      => /folder
        :name     => file
        :locale   => en

 Templates and layouts have access to the following helper functions:

   t(key, options)       i18next.t function with a preset locale that can be overriden in the options.
   tt(key, options)         i18next.t function with a preset locale and key prefix (see i18nPrefix above).
   tpath(path)         Prefixes an absolute path with the /:locale. Relative paths are unchanged.

*/

module.exports = function(options) {

  // ------------------------------------------------------------------------
  // Set default values on the options
  // ------------------------------------------------------------------------

  options = Object.assign({
    pattern:            '**/*',
    defaultLocale:      'en',
    alternativeLocales: false,
    i18n:               false,
  }, options || {})

  // ------------------------------------------------------------------------
  // Do some minimal validation on the options
  // ------------------------------------------------------------------------

  var pattern = options.pattern,
      defaultLocale = options.defaultLocale,
      alternativeLocales = options.alternativeLocales,
      i18n = options.i18n

  if (typeof pattern !== 'string' && !Array.isArray(pattern))
    throw new TypeError('metalsmith-i18next pattern option should be a string or an array of strings')

  if (typeof defaultLocale !== 'string')
    throw new TypeError('metalsmith-i18next path option should be a string')

  if (typeof alternativeLocales !== 'string' && !Array.isArray(alternativeLocales))
    throw new TypeError('metalsmith-i18next namespaces option should be a string or an array of strings')

  if (typeof i18n !== 'object')
    throw new TypeError('metalsmith-i18next i18n option should be an i18n object')

  if (!Array.isArray(alternativeLocales))
    alternativeLocales = [alternativeLocales]

  if (alternativeLocales.length === 0)
    throw new Error('metalsmith-i18next alternativeLocales options thould contain at least one locale')


  return localise(options)
}
