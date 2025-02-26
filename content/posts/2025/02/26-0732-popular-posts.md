---
title: How I added Popular Pages and Posts
description: A guide on how my Popular Pages and Posts work on this site.
categories:
  - aws
  - eleventy
  - swift
  - dynamodb
---

This also serves as documentation for me when I forget how something works because I'm sure it'll happen.

## Overview of how it works

Stack:
- GitHub: GitHub is used to host my code and triggers Netlify to build when there's new content or style changes
- Netlify: Netlify can have builds triggered outside of GitHub, which is what I'll use to get popular post values updated
- Plausible: Analytics platform to get the pageviews and unique users from. This could honestly be any analytics platform, but this is the one I chose due to privacy, cost, and ease of API access. I was also considering [Fathom](https://usefathom.com/ref/A1E51R) (Affiliate link) but the cost was a little higher than I wanted it to be and the API was a bit clunky for me.
- AWS Lambda: I need 2 functions to run 3 times a day
- AWS EventBridge: Scheduling service
- AWS S3: JSON Storage for the stats. Using S3 here because I'll use the same bucket for my Open Graph images.
- AWS DynamoDB: Permanent analytics storage. This was chosen so that I could swap out analytic platforms if I want and continue to have my previous data.

Cost:
- Analytics: $20/month
- AWS: $0.00
- Netlify: $0.00
- GitHub: $0.00

The most expensive part of this system is analytics, which is $20/month. AWS services so far total $0.00, this might change as data increases but for now it costs nothing.

Key pieces:
- AWS Lambda for storing analytics from plausible into a DynamoDB table
- AWS Lambda for getting data from Dynamodb, massaging it, and writing to a JSON file
- JSON File on S3 for 11ty look up data during the build process

### Analytics flow

This is the sequence in getting analytics from Plausible. This is ran every 8 hours. It's a bit too much for my site's traffic, but since it's free right now I don't see a need to decrease it.

<pre class="mermaid">
sequenceDiagram
	participant G as EventBridge
	participant A as Analytics Lambda
	participant B as Plausible
	participant E as DynamoDB table
	
	G-->>A: It's time to do your job
	A-->>B: What's the data for today?
	B-->>A: Data for all urls visited
	A-->>E: Here's the info sorted by URL and date
</pre>

### Update JSON file

Keeps the JSON file in sync with the dynamodb table. 

<pre class="mermaid">
sequenceDiagram
	participant G as EventBridge
	participant C as JSON Lambda
	participant D as S3 bucket
	participant E as DynamoDB table
	
	G-->>C: It's time to do your job
	C-->>E: Give me all your data
	E-->>C: Sure here you go.
	C-->>D: Here's the updated JSON file
</pre>

### Build new site

I'm 90% sure this will be ran by EventBridge and just run 1 time a day. My numbers aren't changing too much during the Analytics Flow, so I think just once a day is fine. If my numbers need more updating, then I can change this one scheduler.

<pre class="mermaid">
sequenceDiagram
	participant G as EventBridge
	participant F as Netlify
	participant D as S3 bucket
	
	G-->>F: It's time to build the site
	F-->>D: Can I have the JSON file?
	D-->>F: Yup. Here it is
</pre>

### DynamoDB Setup

I have a DynamoDB table that stores the URL, Date, last updated, pageviews, and visitors. It is updated 3 times a day to keep it closer to real time. I don't need truly real time based on how low my traffic is currently.

- `pageviews` are how many views the url received even if they are the same people
- `visitors` are how many unique visitors the url has

Sample table:

| url (Partition Key) | date (Sort Key)| last_updated_date | pageviews | visitors |
| --- | --- | --- | --- | --- |
| / | 2025-02-11 | 2025-02-11T16:04:49Z | 2 | 1 |
| / | 2025-02-12 | 2025-02-12T16:04:49Z | 4 | 4 |
| /posts/2025/02/21-0746-callout-support/ | 2025-02-22 | 2025-02-22T00:04:50Z | 6 | 6 |

### JSON File

```json
{
  "last_updated": "2025-02-26T12:00:00Z",
  "popular_pages": {
	"rolling_7_days": [
	  { "url": "/", "pageviews": 50, "visitors": 30 },
	  { "url": "/about", "pageviews": 45, "visitors": 25 }
	],
	"rolling_30_days": [
	  { "url": "/", "pageviews": 200, "visitors": 100 },
	  { "url": "/about", "pageviews": 180, "visitors": 90 }
	],
	"this_week": [
	  { "url": "/", "pageviews": 50, "visitors": 30 },
	  { "url": "/about", "pageviews": 45, "visitors": 25 }
	],
	"this_month": [
	  { "url": "/", "pageviews": 220, "visitors": 110 },
	  { "url": "/about", "pageviews": 200, "visitors": 95 }
	],
	"all_time": [
	  { "url": "/", "pageviews": 5000, "visitors": 2500 },
	  { "url": "/about", "pageviews": 4000, "visitors": 2000 }
	]
  }
}
```