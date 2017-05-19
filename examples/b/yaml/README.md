---
title: Using YAML definition files
---

## Rationale

JSON is great and all, but it's for machines really - not humans. YAML is usually a better format for humans (although not that 'webby', more on that later).

We don't want to have to load in a YAML parsing library in production, so this is only realistic if you are happy to use the devtoolbar in development and then bundle. When bundling/caching the YAML files will be compiled to JSON and then finally bundled as JSON, without a heavy YAML library bundled in aswell.

## Caveats

* You can only use when using the devtoolbar (but of course once you've bundled out the bundle doesn't contain any YAML at all).
* If people ever distribute further modules based on this work, right now we'd prefer not to distribute YAML container files as it forces a YAML dependency, for the moment a pre-publish to compile it down to JSON would be prefereable.
