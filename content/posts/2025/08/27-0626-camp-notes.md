---
title: "I finally submitted a side project"
description: "I'm not the best at finishing side projects, and this one isn't finished but it's going to the App Store."
date: 2025-08-27T06:41:00Z
categories: ["shipaton", "swift", "campnotes"]
---

As you can tell from my [YouTube](https://www.youtube.com/@heyjaycodes) channel or post here, I like to start lots of projects, but I am not the best at finishing them. This year [Shipaton](https://shipaton.com) was announced and I had big plans to finish [PocketBudget](/posts/2025/07/10/0110-pbupdate/) for it, but I'll be honest that was way too much work to rush through and finish, so I pivoted to a new project, [Camp Notes](https://campnotes.app).

Camp Notes started because my wife and I got into camping this year. We wanted to track the campsites we've been to, what amenities they had, that kind of stuff. Everyone in the PNW seems to camp so we figured we'd try it out. We could have just used a shared Apple Note, but that would be messy and unstructured. I wanted to capture specific things like ratings and photos showing how much space there is for tents. So I thought "let me see what I can build in 2 weeks."

Within those two weeks, I was able to get a basic version of the app done where I could add a campground, a site, and record a visit. I figured I could take it a couple steps further after that to include photos and sharing of a card about the visit. After a few more weeks of development, I had a v1.0.0 release.

## What Made This Different

One thing that really helped me throughout this process was using Claude Code. I leaned on it for designing and architecting features, and it helped me stay focused and move faster.

The external deadline from Shipaton also really helped me figure out what was and wasn't necessary. For example, I wanted to add Sign in with Apple support, but I didn't want to waste time on that since users can use email and password just fine. I made a note to add it later when I implement collaboration features, but it wasn't needed for v1.

## Staying Focused on Shipping

Something that really helped was not getting derailed by feedback right before shipping. A couple of days ago I got TestFlight feedback asking why a site number was necessary for logging visits. Instead of completely rethinking and redesigning the add visit flow right before shipping, I just kept the current approach and made a note to work on it later. I didn't want to rethink entire flows when I was so close to getting something out the door.

This is something I definitely want to improve since right now the add visit flow can be a bit clunky because you have to create or select the campground and site first before you can log a visit. Recognizing that this could wait for v1.1 instead of blocking my v1.0 launch was really important.

## What's Next

It's still missing the ability to collaborate on a visit, but that's the next feature I'll work on after Apple approves the app. I also want to separate site ratings from visit ratings since right now they're combined. There's a bunch of other stuff I want to add like some type of dashboard with stats, trip planning features, the ability to favorite campgrounds, and some nice to haves like campground list sorting and searching.

For the add visit flow improvements, I'm planning to A/B test a new approach that's just a form without requiring a campground or site first. I won't have enough users to get statistically significant results, but I like the idea of practicing this skill for future job interviews.

## The Big Picture

Having what I feel is enough to submit the app to the App Store is a big deal for completing side projects for me. I am a master at starting but never finishing or getting them out the door. I felt proud when I hit submit, and I'm really proud that I have actually submitted it to the App Store and hopefully others will find it useful.

The key lessons that helped me actually ship this time: build small versions and get them out, don't get distracted by things that might not matter, and use external deadlines to help prioritize what's truly necessary versus nice to have.
