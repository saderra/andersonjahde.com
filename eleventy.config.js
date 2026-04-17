import dotenv from 'dotenv'
import eleventyNavigation from '@11ty/eleventy-navigation'
import MarkdownIt from 'markdown-it'
import path from 'path'
import postcss from 'postcss'
import tailwindcss from '@tailwindcss/postcss'

dotenv.config()

const outDir = path.resolve('./_site')

const config = {
  css: {
    inputFile: path.resolve('./src/assets/styles/main.css'),
    outputFile: path.join(outDir, 'assets/styles/main.css')
  }
}

const cssProcessor = postcss([tailwindcss()])

export default async function (eleventyConfig) {
  // Additional files to watch
  eleventyConfig.addWatchTarget('.env')

  // Plugins
  eleventyConfig.addPlugin(eleventyNavigation)

  // Process Markdown into HTML
  eleventyConfig.setLibrary('md', MarkdownIt({ html: true, breaks: true, linkify: true }))

  // Process Tailwind CSS through PostCSS
  eleventyConfig.addExtension('css', {
    outputFileExtension: 'css',
    useLayouts: false,
    compile: async (content, file) => {
      const from = path.resolve(file)
      const result = await cssProcessor.process(content, { from })
      return async () => result.css
    }
  })
  eleventyConfig.addTemplateFormats('css')

  // Passthrough files
  eleventyConfig.addPassthroughCopy('./src/assets/images');
  eleventyConfig.addPassthroughCopy('./src/assets/pdf');
  eleventyConfig.addPassthroughCopy('./src/assets/favicons');

  // Shortcodes
  eleventyConfig.addShortcode('mastfile', function () {
    if (this.ctx.mast) return `masts/${this.ctx.mast}.njk`
    throw new Error(`unknown mast "${this.ctx.mast}"`)
  })
  eleventyConfig.addShortcode('phone', () => process.env.AJ_PHONE)
  eleventyConfig.addShortcode('version', () => process.env.AJ_VERSION || Date.now().toString())
  eleventyConfig.addShortcode('year', () => new Date().getFullYear().toString())

  return {
    dir: {
      input: 'src',
      output: outDir,
      includes: '_includes',
      layouts: '_includes/layouts'
    }
  }
}
