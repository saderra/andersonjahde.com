const fs = require("fs");
require('dotenv').config();
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation")
const pluginRss = require("@11ty/eleventy-plugin-rss");
const now = String(Date.now())
const htmlmin = require('html-minifier')
const { DateTime } = require("luxon");
const embedEverything = require("eleventy-plugin-embed-everything");
const metagen = require('eleventy-plugin-metagen');
const Image = require("@11ty/eleventy-img");
const lodash = require("lodash");
const slugify = require("slugify");



/**
 * Get all unique key values from a collection
 *
 * @param {Array} collectionArray - collection to loop through
 * @param {String} key - key to get values from
 */
 function getAllKeyValues(collectionArray, key) {
  // get all values from collection
  let allValues = collectionArray.map((item) => {
    let values = item.data[key] ? item.data[key] : [];
    return values;
  });

  // flatten values array
  allValues = lodash.flattenDeep(allValues);
  // to lowercase
  allValues = allValues.map((item) => item.toLowerCase());
  // remove duplicates
  allValues = [...new Set(allValues)];
  // order alphabetically
  allValues = allValues.sort(function (a, b) {
    return a.localeCompare(b, "en", { sensitivity: "base" });
  });
  // return
  return allValues;
}

/**
 * Transform a string into a slug
 * Uses slugify package
 *
 * @param {String} str - string to slugify
 */
function strToSlug(str) {
  const options = {
    replacement: "-",
    remove: /[&,+()$~%.'":*?<>{}]/g,
    lower: true,
  };

  return slugify(str, options);
}





module.exports = function (eleventyConfig) { 

  // PLUGINS
  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.addPlugin(embedEverything);
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(metagen);


  // TAILWIND
  eleventyConfig.addWatchTarget('./tailwind.config.js')
  eleventyConfig.addWatchTarget('./src/assets/css/tailwind.css')

  // PASSTHROUGHS
  eleventyConfig.addPassthroughCopy("./src/assets/images");
  eleventyConfig.addPassthroughCopy("./src/assets/pdf");
  eleventyConfig.addPassthroughCopy("./src/assets/favicons");
  eleventyConfig.addPassthroughCopy("./src/site.webmanifest");
  eleventyConfig.addPassthroughCopy('./src/cms')
  eleventyConfig.addPassthroughCopy("./src/_redirects");
  eleventyConfig.addPassthroughCopy("./src/robots.txt");

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
  eleventyConfig.addFilter('categoriesByArticle', function(article){

    let find = false;
    article.data.tags.forEach(tag=>{
      if( tag == 'articles'){
        find = true;
      }
    })

    if(find){
      return article.data.tags.map(tag=>{
        var tag = slug.split('-');

        for (var i = 0; i < tag.length; i++) {
          var word = tag[i];
          tag[i] = word.charAt(0).toUpperCase() + word.slice(1);
        }

        return tag.join(' ');
      })
    }

    return [];
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

  eleventyConfig.addFilter('checkArtile', function(slug){
    if(slug.includes('articles')){
      return true;
    }else{
      return false;
    }
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
    eleventyConfig.addTransform('htmlmin', function (content, outputPath) {
        if (
          process.env.ELEVENTY_PRODUCTION &&
          outputPath &&
          outputPath.endsWith('.html')
        ) {
          let minified = htmlmin.minify(content, {
            useShortDoctype: true,
            removeComments: true,
            collapseWhitespace: true,
          });
          return minified
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
