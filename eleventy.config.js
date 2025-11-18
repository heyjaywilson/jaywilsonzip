import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import { calloutsPlugin } from "./_plugins/callouts.js";
import { IdAttributePlugin } from "@11ty/eleventy";

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
    if (data.draft && process.env.ELEVENTY_RUN_MODE === "build") {
      return false;
    }
  });

  // Scheduled posts - only include posts marked as posted during build
  // In dev mode, show all posts
  // If 'posted' field is missing, treat it as false
  // The workflow handles setting posted: true when the date arrives
  eleventyConfig.addPreprocessor("scheduled", "posts/*", (data, content) => {
    if (process.env.ELEVENTY_RUN_MODE === "build" && data.posted !== true) {
      return false;
    }
  });

  // PLUGINS
  // Syntax
  eleventyConfig.addPlugin(syntaxHighlight);
  // ID Attribute
  eleventyConfig.addPlugin(IdAttributePlugin);
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
    let dateString = dateObj.toLocaleDateString("en-US", { timeZone: "UTC" });
    return "Working on it " + dateString;
  });

  eleventyConfig.addFilter("monthName", function (dateObj) {
    const date = dateObj instanceof Date ? dateObj : new Date(dateObj);
    let dateString = date.toLocaleString("default", {
      month: "long",
      timeZone: "UTC",
    });
    return dateString;
  });

  eleventyConfig.addFilter("year", function (dateObj) {
    const date = dateObj instanceof Date ? dateObj : new Date(dateObj);
    return date.getUTCFullYear();
  });

  // Filter for converting date to something that looks good on the post
  eleventyConfig.addFilter("postDate", function (dateObj) {
    const date = dateObj instanceof Date ? dateObj : new Date(dateObj);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    });
  });

  // Get all unique categories from the posts
  eleventyConfig.addFilter("getCategories", function (posts) {
    const categories = new Map();

    posts.forEach((post) => {
      if (post.data.categories) {
        post.data.categories.forEach((category) => {
          categories.set(category, (categories.get(category) || 0) + 1);
        });
      }
    });

    // Convert to array of objects with category name and count
    return Array.from(categories.entries())
      .map(([category, count]) => ({
        name: category,
        count: count,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  });

  eleventyConfig.addFilter("filterByCategory", function (posts, category) {
    return posts.filter((post) => {
      return post.data.categories && post.data.categories.includes(category);
    });
  });

  // Transform work data from resume.json to match template expectations
  eleventyConfig.addFilter("transformWorkData", function (workArray) {
    const resume = this.ctx.resume;
    const awardMappings = resume.meta?.awardMappings || {};
    const awards = resume.awards || [];

    const transformed = workArray.map((work) => {
      const achievements = [];
      const responsibilities = [];
      const achievementHighlightIndices = new Set();

      // Find awards that map to this work entry
      Object.entries(awardMappings).forEach(([awardId, mapping]) => {
        if (mapping.workName === work.name) {
          const award = awards.find((a) => a.id === awardId);
          if (award && mapping.highlightIndex !== undefined) {
            const year = new Date(award.date).getUTCFullYear();
            achievements.push(`${year}: ${award.title} awarded by ${award.awarder}`);
            achievementHighlightIndices.add(mapping.highlightIndex);
          }
        }
      });

      // Add highlights as responsibilities, excluding those that are achievements
      if (work.highlights) {
        work.highlights.forEach((highlight, index) => {
          if (!achievementHighlightIndices.has(index)) {
            responsibilities.push(highlight);
          }
        });
      }

      return {
        ...work,
        achievements: achievements.length > 0 ? achievements : null,
        responsibilities: responsibilities.length > 0 ? responsibilities : null,
      };
    });

    // Sort: Current jobs (no endDate) by startDate desc, then past jobs by endDate desc
    return transformed.sort((a, b) => {
      const aIsCurrent = !a.endDate;
      const bIsCurrent = !b.endDate;

      if (aIsCurrent && bIsCurrent) {
        // Both current: sort by startDate descending (newest first)
        return new Date(b.startDate) - new Date(a.startDate);
      } else if (aIsCurrent) {
        // a is current, b is not: a comes first
        return -1;
      } else if (bIsCurrent) {
        // b is current, a is not: b comes first
        return 1;
      } else {
        // Both past: sort by endDate descending (most recently ended first)
        return new Date(b.endDate) - new Date(a.endDate);
      }
    });
  });

  // Create a collection for each unique category defined in the postss
  eleventyConfig.addCollection("categoryPages", function (collectionApi) {
    const categories = new Set();
    const posts = collectionApi.getFilteredByTag("posts");

    posts.forEach((post) => {
      if (post.data.categories) {
        post.data.categories.forEach((category) => categories.add(category));
      }
    });

    return Array.from(categories).map((category) => ({
      category: category,
      slug: category.toLowerCase().replace(/\s+/g, "-"),
      posts: posts
        .filter(
          (post) =>
            post.data.categories && post.data.categories.includes(category),
        )
        .sort((a, b) => b.date - a.date),
    }));
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
