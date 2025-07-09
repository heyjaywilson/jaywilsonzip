---
title: "PocketBudget Update"
description: "Somewhat daily progress update for the PocketBudget app."
date: 2025-07-09
categories: ["shipaton", "swift", "pocketbudget"]
---

Cranked away on PocketBudget last night.

The last time I [streamed](https://www.youtube.com/live/0V_2YeVDv9c?si=NCpPrdAq5nIm5vjh) and worked on it, I ran into a data fetching issue. Turns out my dates were not the same so the comparison in the predicate didn't work. I made the predicate more flexible by making sure the `startDate` are within the same day and not specifically the exact same time and date.

Started building out the new transaction flow, which is what I'll continue on stream tonight. Make sure to drop by and say hi either on Twitch or YouTube.

Twitch: https://www.twitch.tv/heyjaywilson
YouTube: https://www.youtube.com/@heyjaycodes
