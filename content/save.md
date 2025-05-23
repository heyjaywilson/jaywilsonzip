---
layout: slashpage.njk
title: /save
description: Links to save you some money
lastUpdated: 2025-01-16
---

Here are some affiliate links that might save you money for services and goods that I use and you might find useful. Since they are affiliate links, I will receive a small commission if you purchase through them.

{% for code in referralCodes %}
## [{{ code.name }}]({{ code.link }})

{{ code.description }}

{% if code.perk %}
**If you use this link what happens?**

{{ code.perk }}

{% endif %}
[Visit {{ code.name }}]({{ code.link }})
{% endfor %}
