'use strict'

;(function(){

	function i18nHelpers(options) {
		/**

		  @param {String} file  			- relative file
		  @param {String} [lang]            - optional locale override

		  Given the relative file path folder/file.html and an 'en' lang, the
	      following variables are available for substitution:

	        :file     => folder/file.html
	        :ext      => .html
	        :base     => file.html
	        :dir      => folder
	        :name     => file
	        :locale   => en

		*/
		function fileParts(file, lang) {

			var i, j, q, h, x, base, name, ext, dir, query, hash

			if (!file) file = ''

			function slice(i, j, debug) {
				return file.slice(i, j >= 0? j : undefined)
			}

			i = file.lastIndexOf('/') + 1
			j = file.lastIndexOf('.')
			q = file.lastIndexOf('?')
			h = file.lastIndexOf('#')
			x = (q >= 0 && h >= 0)? Math.min(q, h) : Math.max(q, h)

			lang  = lang || options.lng
			base  = slice(i,x)
			name  = ''
			dir   = ''
			ext   = ''
			query = ''
			hash  = ''

			if (i > 0)
				dir = slice(0,i-1)

			if (j > i) {
				ext  = slice(j,x)
				name = slice(i,j)
			}

			if (q >= 0)
				query = slice(q,h)

			if (h >= 0)
				hash = slice(h)

			return {file:file, base:base, dir:dir, name:name, ext:ext, query:query, hash:hash, locale:lang}
		}

		/**

		  Using the path template, substitute the files parts and return
		  a localised file path. See fileParts for details.

		  @param {String} file  			- relative file
		  @param {String} [lang]            - optional locale override

		*/
		function localisedFilePath(file, lang) {
			const path = ':locale/:file'

			var parts = fileParts(file, lang),
				orig  = file

			if (parts.locale === options.defaultLocale) {
				parts.locale = ''
			}

			// Substitute file parts in the path template
			file = path.replace(/:(\w+)/g, function(match){
				var subst = parts[match.slice(1)]
				return (subst !== undefined)? subst : match
			})

			// Remove leading / or ./ and trailing /
			file = file.replace(/^\.?\//, '').replace(/\/$/, '')

			// Add the trailing / back if there was one
			if (orig && orig.slice(-1) === '/')
				file = file + '/'

			return file
		}

		function t(key, params) {
			params = params || {}
			params.lng = params.lng || options.lng
			return options.i18n.t(key, params)
		}

		function tt(key, params) {
			params = params || {}
			params.lng = params.lng || options.lng
			if (params.lng == options.defaultLocale) {
				/* Split 'namespace:Translation text'. If translation is empty, no
					 namespace was provided and ns is the translation text */
				const [ns, ...translation] = key.split(":")
				return translation.length ? translation.join(":") : ns
			} else {
				/* Disable nested keys for inline translations */
				params.keySeparator = ''
				return options.i18n.t(key, params)
			}
		}

		function tpath(path, lang) {
			return (path[0] !== '/')? path : '/' + localisedFilePath(path.slice(1), lang)
		}

		return {fileParts:fileParts, localisedFilePath:localisedFilePath, t:t, tt:tt, tpath:tpath}
	}

	if (typeof module === 'object' && module.exports)
		module.exports = i18nHelpers
	else if (typeof window === 'object' && window.Object)
		window.i18nHelpers = i18nHelpers
})()
