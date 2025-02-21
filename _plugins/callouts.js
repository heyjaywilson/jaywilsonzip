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
