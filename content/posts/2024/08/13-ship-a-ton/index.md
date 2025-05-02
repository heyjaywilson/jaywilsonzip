---
title: FindRelief - Project Log 1
description: I started a new project. A restroom finder.
date: 2024-08-14
categories:
  - swift
  - devlog
  - findrelief
  - swiftui
  - dynamodb
  - swift-server
  - ship-a-ton
---

I'm starting this log to help hold myself accountable and to build in public. I'm a big proponent of building in public, and I started this project by being quiet about it. The reason for that was cause I needed to see if I could actually do a lot of what I wanted to, and I can so now it's time to introduce it and start a log.

## What is FindRelief?

It's a restroom finder that has an emphasis on what type of restrooms are available. Being trans, I need to find restrooms that are safe for me to use and usually that means a family or gendered neutral restroom so I decided to make an app for that. This data will be self reported by users (or just me).

## What's the tech stack?

- **iOS App**: Written in SwiftUI. When I need local storage, then I'll probably lean on SwiftData, but I might actually use [Boutique](https://github.com/mergesort/Boutique)
- **Map data** is provided by MapKit since there's web data available if I decide to expand this app.
- **User authentication** is handled with [Clerk](https://clerk.com/). I've seen this pop up in the web dev world lately and their iOS SDK is in early beta, so I figured why not try it. If it fails, I can pull in another auth platform, but so far it's been relatively easy to use.
- **Database** is a dynamodb table. I'm using a single table design. I wanted something quick and easy. Will see how that goes
- **Server** is written in Swift using the [Hummingbird framework](https://github.com/hummingbird-project/hummingbird)

## What's been done so far?

I'm building both parts of the app at the same time, so that areas of the server are built as I'm working on that area in the iOS app.

### Server side

- Created an access pattern, entity relationship diagrams, and entity charts
- Create a user
- delete a user
- get a specific user

As I mentioned, Clerk handles user auth, but I need to be able to associate a user in the database with updates and places created, so I wanted my own record of ids, dateCreated, and usernames. I also want to be able to store how many updates a user makes (future thinking here about a user's reputation on the app), so I needed a place to store that. Here's the data I think I need about a user so far:

<pre class="mermaid">
erDiagram
	User {
		string userid
		string username
		string createdAt
		string updatesAt
		int numberOfUpdates
	}
</pre>

### App Side

- Implement account creation
- Implement account deletion (requirement by apple)
- Implement account sign out
- Started searching for places

![Map with annotations](./13-images/search-map.png)

## What's next?

- Tapping on a place on the map will bring up details about that locations restroom
- The details for a location will appear in search results
- Store the locations details in DynamoDB