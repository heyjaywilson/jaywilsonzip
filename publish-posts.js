const fs = require("fs");
const path = require("path");

function publishScheduledPosts() {
  const postsDir = "src/blog";
  const now = new Date();
  let hasNewPosts = false;

  const directoriesToScan = [postsDir];

  while (directoriesToScan.length > 0) {
    const currentDir = directoriesToScan.shift();
    if (!fs.existsSync(currentDir)) continue;

    const items = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const item of items) {
      const fullPath = path.join(currentDir, item.name);

      if (item.isDirectory()) {
        directoriesToScan.push(fullPath);
      } else if (item.name.endsWith(".md")) {
        try {
          const content = fs.readFileSync(fullPath, "utf8");

          // Parse date using regex
          const dateMatch = content.match(/^date:\s*(.+)$/m);
          if (!dateMatch) continue;

          const postDate = new Date(dateMatch[1]);

          // Parse isPosted using regex
          const isPostedMatch = content.match(/^posted:\s*(.+)$/m);
          const isPosted = isPostedMatch
            ? isPostedMatch[1].trim() === "true"
            : false;
          // Only update posts that are ready AND not already posted
          if (postDate <= now && !isPosted) {
            hasNewPosts = true;

            let updatedContent = content;

            // Replace date line while preserving exact formatting
            updatedContent = updatedContent.replace(
              /^date:.*$/m,
              `date: ${now.toISOString()}`,
            );

            // Add or update isPosted line
            if (content.includes("posted:")) {
              updatedContent = updatedContent.replace(
                /^posted:.*$/m,
                "posted: true",
              );
            } else {
              // Insert after date line
              updatedContent = updatedContent.replace(
                /^date:.*$/m,
                `$&\nposted: true`,
              );
            }

            fs.writeFileSync(fullPath, updatedContent);
          }
        } catch (error) {
          // Skip files with errors
        }
      }
    }
  }

  return hasNewPosts;
}

publishScheduledPosts();
