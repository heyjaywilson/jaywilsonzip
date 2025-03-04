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

  // Add async data fetch function for analytics
  eleventyConfig.addGlobalData("analytics", async () => {
    try {
      const response = await fetch(
        "https://assets.jaywilson.zip/analytics.json"
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching analytics:", error);
      return {
        popularPages: { thisMonth: [], rolling30Days: [], allTime: [] },
      };
    }
  });

  // Filter to get popular posts from this month or rolling 30 days
  eleventyConfig.addFilter("getPopularPosts", function (analytics, posts) {
    // Check if analytics and popularPages are defined
    if (!analytics || !analytics.popularPages) {
      console.error("Analytics data is not available or malformed:", analytics);
      return { posts: [], source: "none" }; // Return an empty array if analytics is not available
    }

    console.log("Popular Pages:", analytics.popularPages); // Log popularPages

    // Check if posts is an array before mapping
    const validPostUrls = Array.isArray(posts)
      ? posts.map((post) => post.url)
      : [];

    // Filter thisMonth to only include valid posts from our collection
    const thisMonthPosts = (analytics.popularPages.thisMonth || []).filter(
      (page) => validPostUrls.includes(page.url)
    );

    // Filter rolling30Days to only include valid posts from our collection
    const rolling30DaysPosts = (
      analytics.popularPages.rolling30Days || []
    ).filter((page) => validPostUrls.includes(page.url));

    // Determine which array to use based on filtered posts
    let popularPages = [];
    let source = "none";

    if (thisMonthPosts.length > 0) {
      popularPages = thisMonthPosts;
      source = "thisMonth";
    } else if (rolling30DaysPosts.length > 0) {
      popularPages = rolling30DaysPosts;
      source = "rolling30Days";
    }

    // Map to include post data
    const result = popularPages
      .map((page) => {
        const post = posts.find((p) => p.url === page.url);
        return post ? { ...post, views: page.pageviews } : null; // Ensure post exists
      })
      .filter(Boolean); // Remove any null values

    return { posts: result.sort((a, b) => b.views - a.views), source };
  });

  // Filter to get pageviews for a specific URL
  eleventyConfig.addFilter("getPageViews", function (analytics, url) {
    const page = analytics.popularPages.allTime.find((p) => p.url === url);
    return page ? page.pageviews : 0;
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
