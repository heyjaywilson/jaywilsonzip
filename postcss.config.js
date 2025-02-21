import postcssImport from "postcss-import";
import fs from "fs/promises";

export default {
  plugins: [
    postcssImport({
      root: ".",
      load: async function (filename) {
        try {
          const content = await fs.readFile(filename, "utf8");
          return content;
        } catch (err) {
          console.error("Error loading file:", filename, err);
          throw err;
        }
      },
    }),
  ],
};
