---
title: "Waiting for Review: A Camp Notes Update"
description: "Camp Notes is still in review and here's why."
date: 2025-09-03
categories: ["shipaton", "swift", "campnotes"]
---

It's been 6 App Store submissions, and I still have not gotten past the review process. I have been rejected for the following reasons:

- Login and Signup views are not usable on an iPad.
- Legal links in the paywalls didn't work
- Login is not working properly (3 times)

The first 2 submissions were easy mistakes that I should've seen coming, but the last one has been like hell trying to debug. I figured out I wasn't clearing the auth token between login and signup attempts so it would go stale and not allow any logins. I also had TestFligth feedback about the keyboard not showing on the Login view from settings, so I made sure to submit that fix as well. Hopefully 6th time is the charm and I can release on September 15th.

I still have the waitlist open, so if you're interested in trying out Camp Notes before it's released, please sign up [here](https://campnotes.app/).

I'm starting to work on v1.1.0 which will include the following:
- Ability to add a visit without a campground or site
- Notifications to allow for trial ending and subscription notifications
- What's new system
