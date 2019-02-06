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

		  Return a files path. See fileParts for details.

		  @param {String} file  			- relative file
		  @param {String} [lang]            - optional locale override

		*/
		function filePath(file, lang) {
			return fileParts(file, lang)["file"]
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
			return (path[0] !== '/')? path : '/' + filePath(path.slice(1), lang)
		}

		return {fileParts:fileParts, filePath:filePath, t:t, tt:tt, tpath:tpath}
	}

	if (typeof module === 'object' && module.exports)
		module.exports = i18nHelpers
	else if (typeof window === 'object' && window.Object)
		window.i18nHelpers = i18nHelpers
})()
