---
layout: slashpage.njk
title: /save
description: Links to save you some money
lastUpdated: 2025-01-16
---

Here are some affiliate links to save you some money for services and goods that I use and you might find useful. Since they are affiliate links, I will receive a small commission if you purchase through them.

- Warp Terminal
- You Need a Budget
- OMG.lol
- Digital Ocean
- Notion
- Point Free Co
- [Coolors.co](https://coolors.co/?ref=65972911c9fbc2000b4ce2bf) for generating color palettes like the one on this site

{% for code in referralCodes %}
## [{{ code.name }}]({{ code.link }})

{{ code.description }}

**If you use this link what happens?**

{{ code.perk }}

{% endfor %}