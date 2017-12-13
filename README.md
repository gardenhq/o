# o

An in-browser loader, bundler and dependency injection builder (using `@gardenhq/willow`)

Currently a usable work-in-progress.

## Full Docs

<https://greenhouse.gardenhq.io/o/>

## Features

### Loader

* Promised/Asynchronous true dynamic-import loading (via TC39 `import` or `System.import` like syntax)
* Synchronous static loading (via CommonJS/NodeJS like `require` syntax)
* Local and remote/CDN include paths - `/node_modules/` (or other local path) or `unpkg.com`
* Node-like `__dirname`, `__filename` for both synchronous and asynchronous modules.
* ES6 module support (only during development, bundling required for your final build as per other bundlers)

### Bundler / development

* True dynamic-imports `import("a/" + path + "/" + here + "/module.js").then()`
* Super fast file-watching/live-reloading (file watcher configuration required)
* ES6 transpiling (via Babel), including ES6 modules
* ES6 scope-hoisting/tree shaking (via Rollup)
* Traditional static `require` bundling
* Minification (via UglifyJS)
* Sourcemaps (only required for ES6 transpiling)
* 'Safe', in-browser execution and support for environments where no CLI is available (sensitive environments, iOS)

### Other

* Zero installation (just use a single script tag, but you can also use the traditional `npm` route if you like)
* Almost zero configuration (apart from scope-hoisting which currently requires the addition of a single HTML attribute to your script tag, and file watching set up)
* 'Install size'
	* Loader only: ~3kb (can be made smaller by omitting static/synchronous Node-like loading support)
	* Bundler (needed during development only): ~400kb, half of which is babel. For comparison, `webpack`/`browserify`/`requirejs` are ~10MB
* 100% Bundled runtime size:
    * `o` ~424 bytes
    * `browserify` ~415 bytes
    * `webpack` ~243 bytes

Here's a green 5x5 pixel jpeg saved at 50% quality, to give us a 628 byte jpeg.

![628 byte jpg](https://raw.githubusercontent.com/gardenhq/o/master/examples/628-bytes.jpg)



## Brief-ish overview

### Frontend development

A CLI with Node is entirely optional, and not required at all. You can get going with module loading with a:

```html
<script src="https://unpkg.com/@gardenhq/o@8.0.1/o.js"></script>

OR (if you want to use npm/yarn)

<script src="/node_modules/@gardenhq/o/o.js"></script>
```

To be able to bundle (amongst other things - live reloading, transpiling and more), use the dev version. This is most
likely what you want.

```html
<script src="https://unpkg.com/@gardenhq/o@8.0.1/o.dev.js"></script>

OR (if you want to use npm/yarn)

<script src="/node_modules/@gardenhq/o/o.dev.js"></script>
```

[View a 'Hello World' here](https://greenhouse.gardenhq.io/o/examples/o/development.html). Click the [Bundle] button to bundle.

For ES6, transpiling and minification is all done in the browser with Babel and/or Rollup and UglifyJS. You still don't have to use Node or install/configure anything extra, apart from a single HTML attribute on your script tag if you want to switch to Rollup for ES6 imports.

Once you are bundled you can remove `o` completely and just load your bundle.

```html
<script src="bundle.js"></script>
```

Small CommonJS-only bundles with less than ~50 modules **will be slightly bigger than `browserify` (a couple of hundred bytes)** at least for the moment, but bundling with `o` also gives you `resolve`, `__dirname` and `__filename`, dynamic-imports etc etc, and of course the ability to write javascript without installing/configuring anything. On the other hand, in some initial comparisons we did with a larger bundle with `require("react")` an `o` bundle came out smaller than a `browserify` one. Roughly it seems, once you get over ~50 `requires`, `o` becomes smaller than `browserify`.

ES6 transpiling sizes are similar to `webpack` and `rollup` as we use `rollup` for scope-hoisting and tree-shaking.

### Usage with node `require`-like scripts

`o` can be used to load traditional CommonJS/node `require` based scripts using the synchronous runner `s.js`. [`s.js` simply contains the `o` wrapper](https://github.com/gardenhq/o/blob/master/src/s.js) and an empty `process` for scripts that assume its available. You can change this functionality by simply creating your own 'runner'. This is the equivalent of `browserify ./your-entry-script.js` etc.


```html
<script src="https://unpkg.com/@gardenhq/o@8.0.1/o.dev.js"
   data-src="https://unpkg.com/@gardenhq/o@8.0.1/s.js#./your-entry-script.js"
></script>
```

```javascript
// your-entry-script.js

const required = require("./module");

// etc etc

```



### Usage with @gardenhq/willow our dependency injection builder

Things get far more interesting when used with `@gardenhq/willow` which is why `o` exists. The fact that `o` also works as a 'common or garden' module loader is a bit of a by-product.

`o` has another 'runner' for loading and building javascript container configuration files, `b.js`.

Essentially you can write your app something like this (here in yaml, but you can also use json or a javascript module):

```html
<script src="https://unpkg.com/@gardenhq/o@8.0.1/o.dev.js"
   data-src="https://unpkg.com/@gardenhq/o@8.0.1/b.js#./container.yaml:main"
></script>
```

```yaml
# container.yaml
app.main:
  callable: "./index"
  arguments:
    - "@react"
    - "@react.dom"
    - "@app.some.nice.logic"
app.some.nice.logic:
  class: "./LogicCalculator"
  arguments:
   - "@app.data:property.a"
   - "@app.data:property.b"
app.data:
  object: "./someJsonMaybe"
react:
  object: "react/dist/react.min.js"
react.dom:
  requires: 
    react: "@react" # inject our @react service when we encounter require("react")
  object: "react-dom/dist/react-dom.min.js"

```

```javascript
// index.js - ES6. As pure as the driven snow - no yellow imports
export default (React, ReactDOM, instanceOfLogicCalculator) => {
    ///
}
```

```javascript
// index.js - CommonJS. Almost as pure as the driven snow - no yellow requires
module.exports = function(React, ReactDOM, instanceOfLogicCalculator)
{
    ///
}
```

See <https://greenhouse.gardenhq.io/o/examples/yaml/index.html> for a working example of yaml usage.

Everything is loaded asynchronously, and your index.js file will only execute once its arguments (and their dependencies) are all available. Your arguments can be local in node_modules, on a CDN, or on the night bus home from a big night out. Your module will only execute once everything is ready. During development, things are cached, so once you've loaded a file once its available straight away unless you edit it (see reloading). Once you are finished you can bundle, meaning everything is available instantly as you would imagine.

Building your app like this, not only frees you up from a load of plumbing, but also makes everything much easier to **test** and mock. But if you are here reading this, you probably know that :)

[View a Hello World here](https://greenhouse.gardenhq.io/o/examples/b/development.html) 

The fact that the container container/injection configuration is completely separate from your code (none of our code is in your code) means you aren't tying your code to anything, apart from a loosely coupled architecture, which has to be a good thing :)



## Node Installation

If you don't want to use unpkg.com as your 'node_modules' you can of course install `o` locally and use it as you would think (change your script tag to point to your local file in `node_modules/`.

```
npm install --save[-dev] @gardenhq/o

```

You can also use it for backend javascript work, again where the 'unobtrusive', no lock in dependency injection builder shines.

See the docs for more info, or have a look here <https://github.com/gardenhq/o/tree/master/bin/o> for a quick example.

## What to know more?

Please take some time to read the docs (also a work in progress :) ), and don't be scared to ask!

## License

ISC License

Copyright (c) 2017-present, GardenHQ <gardener@gardenhq.io>

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE
OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.

