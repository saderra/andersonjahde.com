const eleventyNavigationPlugin = require("@11ty/eleventy-navigation")
const now = String(Date.now())
const { minify } = require('html-minifier-terser');
const { DateTime } = require("luxon");

module.exports = async function (eleventyConfig) {

  // @11ty/eleventy-plugin-rss is ESM-only; dynamic import keeps the rest of
  // this config file as plain CommonJS.
  const { default: pluginRss } = await import("@11ty/eleventy-plugin-rss");

  // PLUGINS
  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.addPlugin(pluginRss);


  // TAILWIND
  eleventyConfig.addWatchTarget('./tailwind.config.js')
  eleventyConfig.addWatchTarget('./src/assets/css/tailwind.css')

  // PASSTHROUGHS
  eleventyConfig.addPassthroughCopy("./src/assets/images");
  eleventyConfig.addPassthroughCopy("./src/assets/pdf");
  eleventyConfig.addPassthroughCopy("./src/assets/favicons");
  eleventyConfig.addPassthroughCopy("./src/site.webmanifest");
  eleventyConfig.addPassthroughCopy('./src/cms')
  eleventyConfig.addPassthroughCopy("./src/robots.txt");
  eleventyConfig.addPassthroughCopy("./src/_redirects");
  eleventyConfig.addPassthroughCopy({ "node_modules/alpinejs/dist/cdn.min.js": "assets/js/alpine.js" });

  // DATE FORMATTING
  eleventyConfig.addFilter('htmlDateString', (dateObj) => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat('yyyy-LL-dd');
  });

  eleventyConfig.addFilter("postDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED);
  });

  //My methods
  
  eleventyConfig.addFilter('articlesByCategory', function(category, articleCollection){
    
    let filter = [];

    articleCollection.forEach(article=>{
      article.data.categories.forEach(cat=>{
        if(category == cat){
          filter.push(article);
        }
      })
    })
    return filter;
  })
  eleventyConfig.addCollection("getCat", function(collectionApi) {
    let collection = collectionApi.getFilteredByTag("articles")
    let categories = [];
    collection.forEach(article=>{
      article.data.categories.forEach(cat=>{
        let find = categories.filter((item) => cat == item)
        if(find.length == 0){
          categories.push(cat)
        }
      })
    })
    return categories;
  });

  // FILTERS
  eleventyConfig.addFilter('jsonify', (obj) => JSON.stringify(obj));
  eleventyConfig.addFilter('jsonEscape', (str) => JSON.stringify(String(str)).slice(1, -1));

  // Splits rendered markdown HTML into a lead block (content before the
  // first <h2>) and an array of section chunks (each starting at an <h2>),
  // so a landing-page layout can wrap each section in its own band.
  // Also drops the first paragraph when it duplicates the page excerpt,
  // since that excerpt is shown separately in the hero.
  eleventyConfig.addFilter('splitContentSections', function (html, excerpt) {
    if (!html) return { lead: '', sections: [] };

    const normalize = (s) => s
      .replace(/<[^>]+>/g, '')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;|&apos;/g, "'")
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/[‘’]/g, "'")
      .replace(/[“”]/g, '"')
      .replace(/\s+/g, ' ')
      .trim();

    const splitSentences = (s) => (s.match(/[^.!?]+[.!?]*(\s+|$)/g) || [s]).map((x) => x.trim()).filter(Boolean);

    let working = html;
    if (excerpt) {
      const firstP = working.match(/^\s*<p>([\s\S]*?)<\/p>/i);
      if (firstP) {
        const pSentences = splitSentences(normalize(firstP[1]));
        const excerptSentences = splitSentences(normalize(excerpt));

        // Count how many leading sentences the paragraph shares with the
        // excerpt (in order), since the excerpt is sometimes a synthesized
        // summary rather than a strict prefix of the paragraph.
        let shared = 0;
        while (shared < pSentences.length && shared < excerptSentences.length && pSentences[shared] === excerptSentences[shared]) {
          shared++;
        }

        if (shared > 0) {
          const remainder = pSentences.slice(shared).join(' ').trim();
          const replacement = remainder ? `<p>${remainder}</p>` : '';
          working = replacement + working.slice(firstP.index + firstP[0].length);
        }
      }
    }

    const chunks = working.split(/(?=<h2)/i);
    const lead = /^\s*<h2/i.test(chunks[0] || '') ? '' : (chunks.shift() || '').trim();
    const sections = chunks.map((c) => c.trim()).filter(Boolean);

    return { lead, sections };
  });

  // SHORTCODES
  eleventyConfig.addShortcode('version', function () { return now  })
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  let markdownIt = require("markdown-it");
  let options = {
    html: true,
    breaks: true,
    linkify: true
  };
  
  eleventyConfig.setLibrary("md", markdownIt(options));


   /* HTML Minifiy */
    eleventyConfig.addTransform('htmlmin', async function (content, outputPath) {
        if (
          process.env.ELEVENTY_PRODUCTION &&
          outputPath &&
          outputPath.endsWith('.html')
        ) {
          return minify(content, {
            useShortDoctype: true,
            removeComments: true,
            collapseWhitespace: true,
          });
        }

        return content
    })

    return { 
        dir: { 
            input: "src",
            output: "_site",
            includes: "_includes",
            layouts: "_includes/layouts"
        },
    };
};
