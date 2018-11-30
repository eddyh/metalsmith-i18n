# Introduction

Metalsmith plugin that creates multiple localised branches of your static site and
provides helpers for translations.

The plugin does not rely on any i18n package. Instead it requires to specify an
i18n instance as param. This has been tested with [i18next](https://www.i18next.com).

# Quick start

## Installation

    npm i --save metalsmith-i18n


## Example

Given the following code and input folder structure, here is the output structure.

```js
Metalsmith(__dirname)
	.use(i18next(
		pattern: '**/*.hbs',
		defaultLocale: 'en',
		alternativeLocales: ['nl'],
		i18n: i18next
	))
	.build(function(err, files){
		if (err) console.error(err.stack)
	})

Input                                                   Output
-----                                                   ------
.                                                       .
|                                                       |
+- index.js                                             +- en
|                                                       |   |
+- locales                                              |   +-- index.hamlc
|   |                                                   |
|   +-- en                                              +- nl
|   |    |                                              |   |
|   |    +-- public.json                                |   +-- index.hamlc
|   |                                                   |
|   +-- nl                                              +- images
|        |                                                  |
|        +-- public.json                                    +-- smile.png
|
+- src
    |
    +-- index.hamlc
    |
    +-- images
         |
         +-- smile.png
```

## i18n Helper Functions

Once initialized, all files that match the pattern are given three helper function accessible from
templates and downstream functions:

#### `function t(String key, [Object options])`

translates the key. The key and options are passed on to the i18n instance. The
target locale is added to the options.

Example with i18next:
Given the default options and namespaces `['common','public']`
```
t('public:home.title')		// => Looks in ./locales/<locale>/public.json for home['title']
t('home.title')		        // => Looks in ./locales/<locale>/common.json for home['title']
t('title')                // => Looks in ./locales/<locale>/common.json for title
```
<hr>

#### `function tt(String key, [Object options])`

return the key if the current locale is the default locale. Translates the key
if it's not the default locale. The key and options are passed on to the i18n
instance. The target locale is added to the options.

Can be used for keeping the source translations inline.

Example with i18next:
Given the default options and namespaces `['common','public']`
```
tt('public:Welcome')		  // Returns 'Welcome' for the default locale
tt('public:Welcome')		  // Looks in ./locales/<locale>/public.json for the 'Welcome' translation
```
<hr>

#### `function tpath(String file)`
translates the path of a file without locale information to one with

Examples:
```
// Given the default path option of ':locale/:file'
tpath('/signup.html')            // => /<locale>/signup.html
tpath('/products/widget.html')   // => /<locale>/products/widget.html

// Given a path option of ':dir/:name-:locale:ext'
tpath('/signup.html')            // => /signup-<locale>.html
tpath('/products/widget.html')   // => /products/widget--<locale>.html

```
<hr>

#### Interpolation with i18next
You can use variables in the locale files:

```
{
	"hello": "Hello {{name}}"
}
```

then pass variable values to the helper:

(hamlc)
```
= @tt('hello', {"name": 'John Doe'})
```

(handlebars)
```
{{{t "hello" name="John Doe"}}}
```


# License

The MIT License (MIT)

Copyright (c) 2015 Eric Methot

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
