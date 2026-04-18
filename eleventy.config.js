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
  },
  date: {
    month: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
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

  // Filters
  eleventyConfig.addFilter('date', value => {
    const date = new Date(value)

    const year = date.getFullYear()
    const month = config.date.month[date.getMonth()]
    const day = date.getDate()

    return `${month} ${day}, ${year}`
  })
  eleventyConfig.addFilter('datetime', value => {
    const date = new Date(value)

    const year = date.getFullYear()
    const month = (1 + date.getMonth()).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    const hour = date.getHours().toString().padStart(2, '0')
    const minute = date.getHours().toString().padStart(2, '0')
    const second = date.getHours().toString().padStart(2, '0')

    const tzoffsetHour = (Math.abs(date.getTimezoneOffset()) % 60).toString().padStart(2, '0')
    const tzdirection = date.getTimezoneOffset() < 0 ? '-' : '+'

    return `${year}-${month}-${day}T${hour}:${minute}:${second}${tzdirection}${tzoffsetHour}:00`
  })

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
