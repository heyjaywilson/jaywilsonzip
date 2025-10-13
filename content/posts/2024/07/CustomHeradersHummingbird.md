---
posted: true
title: "How to access custom headers in Hummingbird 2"
description: A quick example of how to access custom headers in the Swift Server platform Hummingbird.
date: 2024-07-08
type: article
categories:
  - swift
  - hummingbird
  - swift-server
---

[Hummingbird](https://github.com/hummingbird-project/hummingbird?tab=readme-ov-file) is a server framework written in Swift. I'm using it at work and for a few personal projects. It's small and quick to build, so it checks the boxes for what I'm trying to do.

The Hummingbird project is quickly moving to v2.0 (as of writing this RC 2 is out 🎉), and that brought a change with accessing custom headers.
In v1 it looked something like `request.headers["custom-header-name"]`. In v2 it now requires a bit more work thanks to the reliance on [`Swift-HTTP-Types`](https://github.com/apple/swift-http-types), but ultimately I think it's a cleaner call site.

First, you need to extend `HTTPField.name` and add the new header name in there.

```swift
// don't forget to import HTTPTypes
import HTTPTypes

extension HTTPField.Name {
  // if you don't force unwrap here, you'll need to account for the optional in the next step
	static let customHeaderName = Self("custom-header-name")!
}
```

Then you can call it in a very similar way to v1.

```swift
let headerValue = request.headers[.customHeaderName]
```