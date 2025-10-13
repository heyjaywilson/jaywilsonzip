---
posted: true
title: How to get the current MKCoordinateRegion from a MapCameraPosition
description: Struggled with this a bit, so figured I would write how I did this.
date: 2024-08-15
categories:
  - swift
  - swiftui
---

Goal to achieve: Get the `MKCoordinateRegion` of the map I'm looking at.

What I tried and did not work:
``` swift
struct MapSearchView: View {
	@State private var position = MapCameraPosition.automatic
	@State private var mapRegion: MKCoordinateRegion = .init()

	var body: some View {
		Map(position: $position)
		.onChange(of: position) {
			print(position.region)
		}
  }
}
```

This would always print `nil` even though it's supposed to be the current region.

What I ended up getting to work:

```swift
struct MapSearchView: View {
	@State private var position = MapCameraPosition.automatic
	@State private var mapRegion: MKCoordinateRegion = .init()

	var body: some View {
		Map(position: $position)
		.onMapCameraChange { mapCameraUpdateContext in
			mapRegion = mapCameraUpdateContext.region
		}
  }
}
```

I had to use the specific `onMapCameraChange` to get the region and then update a state variable. I can then use that however I want.