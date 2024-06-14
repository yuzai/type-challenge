module.exports = (options, ctx) => {
    return {
        name: 'vuepress-plugin-image',
        extendMarkdown: md => {
            md.use(require('markdown-it-imsize'))
        }
    }
}