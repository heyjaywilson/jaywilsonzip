---
posted: true
title: PocketBudget Stream Recap
description: PocketBudget app has been started. Here's a recap of the first stream.
date: 2025-04-24
categories:
  - swift
  - devlog
  - pocketbudget
  - hummingbird
  - postgresnio
  - postgres
  - serversideswift
---

<iframe width="560" height="315" src="https://www.youtube.com/embed/sfkcgzpVoNE?si=SEsF7gJ9sMMG2Hr9" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## What is PocketBudget

PocketBudget is an envelope budgeting app. It's philosphy is to budget every dollar into a pocket (aka category) to be spent.

### Why?

I want to build a budgeting app. I also want to replace my current budgeting app with the one I'm building.

### What's the stack?

Backend

- Swift
- PostgreSQL

iOS App

- SwiftUI

More apps to be decided later... I need to finish the app first.

## Goals from the stream

- Create backend repo
- Get 1st build of Hummingbird working
- Add Postgresql
- Configure docker to run the database and server

## What happened

- Created the backend GitHub repo using the Hummingbird [template](https://github.com/hummingbird-project/template) 
- Was able to build and run the server after running configure
- Started to implement [Fluent](https://github.com/vapor/fluent) then completely over thought what an "in memory" database meant so pivoted to [PostgresNIO](https://github.com/vapor/postgres-nio) to follow the tutorial/guides more on Hummingbird's website
- Added a `docker-compose` file to run the server and database at the same time and was able to see my table in [TablePlus](https://tableplus.com/), the app I use to inspect databases.

> [!NOTE]
>
> TablePlus is part of SetApp, which I've found worth the subscription. You can get [SetApp here](https://lnk.heyjay.coffee/setapp) and if you sign up we both get a month free.

## What's next?

When: April 27 2024 at 2pm PST
Where: [YouTube](https://youtube.com/live/IBWIWOzYGFQ?feature=share) or [Twitch](https://lnk.heyjay.coffee/twitch) 

Goals:

- Create a user
- Delete a user
- Update a user's display name

Stretch goals

- Budget model 
- Add a budget table
- Create a budget related to a user