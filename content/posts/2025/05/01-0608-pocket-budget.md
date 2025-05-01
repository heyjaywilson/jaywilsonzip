---
title: "PocketBudget Stream #3: Swift Testing and Foreign Keys"
description: Not only is this a recap, but you'll find tidbits around PostgreSQL and Swift Testing.
date: 2025-05-01
categories:
  - swift
  - devlog
  - pocketbudget
  - hummingbird
  - postgresnio
  - postgres
  - serversideswift
  - swifttesting
---

<iframe width="560" height="315" src="https://www.youtube.com/embed/j1VlHVkFy8A?si=mbVqUgnRJCKVfjjM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

This was a long one tonight. Just shy of 3 hours and starting off I didn't even want to do testing 😬. I also deviated from what I said I was going to do [last time](/posts/2025/04/27-1751-pocket-budget/#whats-next) which was working on a subscriptions table and only worked on what would propel functionality forward, meaning I started working on creating and fetching budgets. 

### Creating the budget table

Since I had the `users` table and repository done, it was actually pretty easy to get the `budgets` table created. The tricky part was getting the foreign key relationship right - the `budgets` table needs to reference the `users` table to maintain data integrity.

Cursor helped me build the initial statement, but something felt off about it. After some mid-stream googling and checking the PostgreSQL [documentation](https://www.postgresql.org/docs/17/ddl-constraints.html#DDL-CONSTRAINTS-FK), I found out that PostgreSQL has specific requirements for foreign key constraints. Here's what worked:

```swift
func createTable() async throws {
  try await self.client.query(
    """
    CREATE TABLE IF NOT EXISTS "budgets" (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES "users" (id),
        budget_name TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
    )
    """,
    logger: self.logger
  )
}
```

The `REFERENCES "users" (id)` part tells PostgreSQL to make sure any `user_id` we try to insert actually exists in the `users` table. If we try to create a budget with a non-existent user_id, PostgreSQL will reject it.

### Testing budget postgres actions

Testing repositories is usually straightforward with in-memory storage. You just construct the object and pass it into the init. Then you can perform actions, like creating a new one or getting a specific one. Where I ran into issues was testing the Postgres repository. 

I had already implemented tests on the User Repository and knew I needed it to run serialized since all the tests share the same database. What I wasn't prepared for was how Swift Testing handles multiple test suites. By default, it runs everything in parallel, which means:

1. First test suite starts and creates a user
2. Second test suite starts simultaneously and tries to create a user when the table is supposed to be empty
3. Both tests try to modify the database at the same time, causing failures

To solve this, I first tried marking both suites with `@Suite("Budget Repository Tests", .serialized)`. But that only serializes tests within each suite. The suites themselves were still running in parallel. The [docs](https://developer.apple.com/documentation/testing/parallelizationtrait) don't really cover this case, so I turned to Cursor and the YouTube chat for ideas.

The solution was to create one parent test suite that controls everything. Here's what it looks like:

```swift
import Testing

@testable import App

@Suite("Database Tests", .serialized)
struct DatabaseTests {
  var userTests: UserPostgresRepositoryTests
  var budgetTests: BudgetPostgresRepositoryTests

  init() async throws {
    self.userTests = try await UserPostgresRepositoryTests()
    self.budgetTests = try await BudgetPostgresRepositoryTests()
  }

  @Test("Create tables successfully")
  func testCreateTable() async throws {
    try await userTests.testCreateTable()
    try await budgetTests.testCreateTable()
  }

  @Test("Create user successfully")
  func testCreateUser() async throws {
    try await userTests.testCreateUser()
  }

  @Test("Create budget successfully")
  func testCreateBudget() async throws {
    try await budgetTests.testCreateBudget()
  }

  @Test("Fetch budget successfully")
  func testFetchBudget() async throws {
    try await budgetTests.testFetchBudget()
  }
}
```

I took out all the `@Test` and `@Suite` from the individual repository test files but kept all the actual test logic there. This way, the parent suite controls when tests run, but each repository keeps its own test code organized. I didn't think this would work at first since I hadn't seen this pattern in any examples, but it effectively solved the test parallelization issues.

## What's Next and When

I'm not too sure when I'll be back - at most it'll be about 2 weeks away. I have some personal stuff coming up and it's causing a delay, but the latest I'll be back is May 14th at 8pm PST.

Off stream, I want to get more of the Pockets (AKA categories) figured out, but that will take some time so I'll more than likely still be doing some of that on stream. If you're really curious about what I'll be doing next, you can join the [discord](https://discord.gg/HD3KjkMPgh) or [follow](/follow) me on socials.