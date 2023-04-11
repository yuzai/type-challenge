module.exports = {
    title: 'TS类型体操',
    description: '刷题吧少年',
    base: '',
    configureWebpack: {
        resolve: {
          alias: {
            '@alias': 'path/to/some/dir'
          }
        }
    },
    markdown: {
        lineNumbers: true
    },
    themeConfig: {
        sidebar: [
          '/',
          {
            title: '简单',   // 必要的
            // path: '/easy/',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
            sidebarDepth: 1,    // 可选的, 默认值是 1
            children: [
              '/easy/4-实现Pick',
              '/easy/7-实现Readonly',
              '/easy/11-元组转换为对象',
              '/easy/14-第一个元素',
              '/easy/18-获取元组长度'
            ],
            // initialOpenGroupIndex: 1 // 可选的, 默认值是 0
          },
        ],
        lastUpdated: 'Last Updated', // string | boolean
    }
}