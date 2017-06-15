# o

An in-browser loader, bundler and dependency injection builder (using `@gardenhq/willow`)

Currently a usable work-in-progress.

## Full Docs

<https://greenhouse.gardenhq.io/o/>

## Brief-ish overview

### Frontend development

A CLI and/or Node is entirely optional, and not required at all. You can get going with module loading with a:

```html
<script src="https://unpkg.com/@gardenhq/o@6.3.0/o.js"></script>
```

To be able to bundle (amongst other things - live reloading, transpiling and more), use the dev version. This is most
likely what you want.

```html
<script src="https://unpkg.com/@gardenhq/o@6.3.0/o.dev.js"></script>
```

[View a 'Hello World'
here](https://greenhouse.gardenhq.io/o/examples/o/development.html). Click the
[Bundle] button to bundle.

If ES6 is your thing, transpiling and minification is all done in the browser with Babel/Babili (you still don't have to use Node or install/configure anything extra).

Once you are bundled you can remove `o` and just load your bundle.

```html
<script src="bundle.min.js"></script>
```

Small bundles **will be slightly bigger than `browserify`** at least for the
moment, but bundling with `o` also gives you `resolve`, `__dirname` and `__filename`. On the other hand, in some initial comparisons we did with a larger bundle with `require("react")` and `o` bundle came out smaller than a `browserify` one. We can't quite believe this as we've not even looked at optimizations yet, once we've spent some time doing more comparisions and verifying we'll publish some results. With this same test `webpack` kills us due to tree shaking, but we've not looked at this 'yet' - plus we'd prefer to use `willow` and build/grow our tree, rather than include everything and shake it to death.

Things get far more interesting when used with `@gardenhq/willow` which is why `o` exists. The fact that `o` also works as a 'common or garden' module loader is a bit of a by-product.

### Usage with @gardenhq/willow our dependency injection builder

Essentially you can write your app something like this (you can also use json or a CommonJS module):

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
  object: "react"
react.dom:
  object: "react-dom"

```

See <https://greenhouse.gardenhq.io/o/examples/yaml/index.html> for a working example of yaml usage.

```javascript
// index.js - almost as pure as the driven snow - no yellow requires
module.exports = function(React, ReactDOM, instanceOfLogicCalculator)
{
    ///
}
```

Everything is loaded asyncronously, and your index.js file will only execute once its arguments (and their dependencies) are all available. Your arguments can be local in node_modules, on a CDN, or on the night bus home from a big night out. Your module will only execute once everything is ready (BTW things are cached, so generally during development, once you've loaded a file once its available straight away unless you edit it, see reloading)

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

