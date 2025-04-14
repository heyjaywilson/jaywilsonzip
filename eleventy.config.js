import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import { calloutsPlugin } from "./_plugins/callouts.js";

// Configuration file for website
export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({
    "./public/fonts/": "/fonts/",
    "./public/img/": "/img/",
  });

  eleventyConfig.addPassthroughCopy("content/**/*.{jpg,jpeg,png,gif}");

  eleventyConfig.addWatchTarget("./public/css/**/*.css");
  
  // Preprocessors
  // Drafts
  eleventyConfig.addPreprocessor("drafts", "*", (data, content) => {
    if(data.draft && process.env.ELEVENTY_RUN_MODE === "build") {
      return false;
    }
  });

  // PLUGINS
  // Syntax
  eleventyConfig.addPlugin(syntaxHighlight);
  // RSS FEED
  eleventyConfig.addPlugin(feedPlugin, {
    type: "atom",
    outputPath: "/posts/atom.xml",
    collection: {
      name: "posts",
    },
    metadata: {
      language: "en",
      title: "JayWilson.zip",
      subtitle:
        "My writings, photos, and videos about anything and everything.",
      base: "https://jaywilson.zip",
      author: {
        name: "Jay Wilson",
        email: "heyjay@omg.lol",
      },
    },
  });
  eleventyConfig.addPlugin(feedPlugin, {
    type: "rss",
    outputPath: "/posts/rss.xml",
    collection: {
      name: "posts",
    },
    metadata: {
      language: "en",
      title: "JayWilson.zip",
      subtitle:
        "My writings, photos, and videos about anything and everything.",
      base: "https://jaywilson.zip",
      author: {
        name: "Jay Wilson",
        email: "heyjay@omg.lol",
      },
    },
  });
  eleventyConfig.addPlugin(feedPlugin, {
    type: "json",
    outputPath: "/posts/feed.json",
    collection: {
      name: "posts",
    },
    metadata: {
      language: "en",
      title: "JayWilson.zip",
      subtitle:
        "My writings, photos, and videos about anything and everything.",
      base: "https://jaywilson.zip",
      author: {
        name: "Jay Wilson",
        email: "heyjay@omg.lol",
      },
    },
  });
  eleventyConfig.addPlugin(calloutsPlugin);

  eleventyConfig.addShortcode("buildYear", function () {
    return new Date().getFullYear();
  });

  eleventyConfig.addFilter("workDate", function (dateObj) {
    let dateString = dateObj.toLocaleDateString();
    return "Working on it " + dateString;
  });

  eleventyConfig.addFilter("monthName", function (dateObj) {
    let dateString = dateObj.toLocaleString("default", { month: "long" });
    return dateString;
  });

  eleventyConfig.addFilter("year", function (dateObj) {
    return dateObj.getFullYear();
  });

  // Filter for converting date to something that looks good on the post
  eleventyConfig.addFilter("postDate", function (dateObj) {
    const date = dateObj instanceof Date ? dateObj : new Date(dateObj);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  });

  // Return the config object
  return {
    templateFormats: ["md", "njk", "html", "liquid", "11ty.js"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dir: {
      input: "content",
      includes: "../_includes",
      layouts: "../_layouts",
      data: "../_data",
      plugins: "../_plugins",
    },
  };
}
