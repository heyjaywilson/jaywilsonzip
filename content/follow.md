---
layout: slashpage.njk
title: /follow
description: Other places to find me on the internet
lastUpdated: 2025-01-16
---

- Mastodon: [@heyjaywilson]({% for social in socials %}{% if social.name == "Mastodon" %}{{ social.url }}{% endif %}{% endfor %})
- Vlog YouTube: [@heyjaywilson]({% for social in socials %}{% if social.name == "YouTube" %}{{ social.url }}{% endif %}{% endfor %})
- Coding YouTube: [@heyjaycodes](https://www.youtube.com/@heyjaycodes) (I'll be honest I haven't posted on here in like a year though)
- Instagram: [@heyjaywilson]({% for social in socials %}{% if social.name == "Instagram" %}{{ social.url }}{% endif %}{% endfor %})
- Threads: [@heyjaywilson]({% for social in socials %}{% if social.name == "Threads" %}{{ social.url }}{% endif %}{% endfor %})
- BlueSky: [@hey.jaywilson.zip]({% for social in socials %}{% if social.name == "Bluesky" %}{{ social.url }}{% endif %}{% endfor %})
- Here via [RSS](https://jaywilson.zip/subscribe/)