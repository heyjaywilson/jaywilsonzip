---
title: Callout support
description: I added support for callouts to my blog.
date: 2025-02-21
categories:
  - devlog
  - markdown
---

With the help of Cursor, I think I've added support for callouts similar to [GitHub's alerts](https://github.blog/changelog/2023-12-14-new-markdown-extension-alerts-provide-distinctive-styling-for-significant-content/).

Here are examples of how mine render:

> [!NOTE]
> That has a broken line in it

> [!TIP]
> This is a tip

> [!IMPORTANT]
> This is important

> [!WARNING]
> This is a warning

> [!CAUTION]
> This is a caution


> [!NOTE]
> This is a note
>
> With a second paragraph and some inline **styles** and a [link](https://example.com).


Here's how it works under the hood:

```markdown
> [!NOTE]
> This is a note
>
> With a second paragraph and some inline **styles** and a [link](https://example.com).
```

The `> [!NOTE]` is the callout type which is picked up by a plugin that looks for the token and created the HTML structure of the callout.

That structure looks like
```html
<blockquote data-callout="note">
  <p class="callout-label"><span class="callout-icon"></span>NOTE</p>
  <p>This is a note</p>
  <p>With a second paragraph and some inline <strong>styles</strong> and a <a href="https://example.com">link</a>.</p>
</blockquote>
```

The hard part was getting the tokens and the content right underneath the callout type to render correctly.

Here's the final javascript that does the trick:

```javascript
import MarkdownIt from "markdown-it";

export function calloutsPlugin(eleventyConfig) {
  const md = eleventyConfig.markdownLibrary || new MarkdownIt({ html: true });
  eleventyConfig.setLibrary("md", md);

  md.core.ruler.after("block", "callouts", function (state) {
    const tokens = state.tokens;

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      if (token.type === "blockquote_open") {
        const text = tokens[i + 2];
        const match = text?.content?.match(
          /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/
        );

        if (match) {
          // Add data-callout attribute
          token.attrs = token.attrs || [];
          token.attrs.push(["data-callout", match[1].toLowerCase()]);

          // Add class to the first paragraph
          const para = tokens[i + 1];
          if (para && para.type === "paragraph_open") {
            para.attrs = para.attrs || [];
            para.attrs.push(["class", "callout-label"]);
          }

          // Get cleaned content
          const content = text.content.replace(match[0], "").trim();

          // Set the label
          text.content = `<span class="callout-icon"></span>${match[1]}`;

          // Add paragraph with content
          const paraOpen = new state.Token("paragraph_open", "p", 1);
          const contentToken = new state.Token("text", "", 0);
          contentToken.content = content;
          const paraClose = new state.Token("paragraph_close", "p", -1);
          tokens.splice(i + 4, 0, paraOpen, contentToken, paraClose);
        }
      }
    }
  });
}

```

This plugin is then added to my 11ty config file and runs on build.

---

This was quite the exercise to get it right even with the help of Cursor. It's hard to get Cursor to think of different ways to do the same thing if you don't prompt it first. I was stuck in a few loops of getting the same answers over and over when I should have been prompting for different ways to do the same thing. I tried going a mainly CSS route, but it wasn't working so then I had to prompt it to think about how to do it with standard HTML layout which eventually got me to the solution.