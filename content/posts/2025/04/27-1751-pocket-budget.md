---
posted: true
title: "PocketBudget Stream #2 Recap"
description: I wanted to complete 4 tasks this stream, but I eneded up only doing 2 since I didn't account for any troubleshooting time.
date: 2025-04-27
categories:
  - swift
  - devlog
  - pocketbudget
  - hummingbird
  - postgresnio
  - postgres
  - serversideswift
---

<iframe width="560" height="315" src="https://www.youtube.com/embed/IBWIWOzYGFQ?si=EUI52IhtaJ0sSUDD" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

This was the second stream of me building [**PocketBudget**](/posts/2025/04/24-0704-pocket-budget).  
I set out to do four things, but only ended up finishing two. Honestly, that's fine — I learned a lot more about how [PostgresNIO](https://github.com/vapor/postgres-nio) works, so still a win.

## What happened this stream?

After last stream, I decided I want to tackle all backend needs first before moving on to the client (an iOS app in my case). So this stream, I started working on basic CRUD operations for a `User`, since almost all data in the app will eventually relate back to a user.

> [!NOTE]
> 
> **CRUD** stands for **C**reate, **R**ead, **U**pdate, and **D**elete.

I wanted to complete full CRUD support for users, but only got `Create` fully working and started a stub for `Read` (fetching all users). Realistically, fetching *all* users is only useful for me during development — it doesn’t actually move the app forward much yet.

One thing I spent time on was learning how to catch a specific error from PostgresNIO. It took some digging, but I found that I needed to check the `sqlState` field and match it against the code `23505` to detect a unique constraint violation (basically, when trying to insert a user that already exists based on unique fields). Here's the code I ended up with:

```swift
// Inside a do-catch block
catch let error as PSQLError {
    if let sqlState = error.serverInfo?[.sqlState] as? String, sqlState == "23505" {
        logger.error("🚨 User already exists with the same auth_provider_id and auth_provider")
        throw HTTPError(.badRequest, message: "User with this auth_provider_id and auth_provider already exists.")
    }
    logger.error("🚨 \(String(reflecting: error))")
    throw error
}
// Rest of catch
```

## What's next?

I’ll be continuing some work off stream — mainly converting existing tests from XCTest to Swift Testing and writing new tests for the work done so far. I also plan to finish the `Delete` and `Update` operations for users offline.

I want to set up [swift-format](https://github.com/swiftlang/swift-format) on the project too, so the codebase stays clean and consistent as it grows.

For the next stream:

- Set up the `subscription` table
- Update `ResponseUser` to include whether the user is currently subscribed

Keeping the goals small on this stream so that I can hopefully get them all done. If I end up getting them done, then I'll head on to budgets next.