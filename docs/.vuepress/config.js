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
              '/easy/18-获取元组长度',
              '/easy/43-实现Exclude',
              '/easy/189-实现Awaited',
              '/easy/268-实现If',
              '/easy/533-实现Concat',
              '/easy/898-实现Includes',
              '/easy/3057-实现Push',
              '/easy/3060-实现Unshift',
              '/easy/3312-实现Parameters',
            ],
            // initialOpenGroupIndex: 1 // 可选的, 默认值是 0
          },
          {
            title: '中等',   // 必要的
            // path: '/easy/',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
            sidebarDepth: 1,    // 可选的, 默认值是 1
            children: [
              '/medium/2-获取函数返回类型',
              '/medium/3-实现Omit',
              '/medium/8-Readonly2',
              '/medium/9-实现DeepReadonly',
              '/medium/10-元组转联合',
              '/medium/12-可串联构造器',
              '/medium/15-最后一个元素',
              '/medium/16-实现Pop',
              '/medium/20-实现Promise.all',
              '/medium/62-实现TypeLookup',
              '/medium/106-实现TrimLeft',
              '/medium/108-实现Trim',
              '/medium/110-实现Capitalize',
            ],
            // initialOpenGroupIndex: 1 // 可选的, 默认值是 0
          },
        ],
        lastUpdated: 'Last Updated', // string | boolean
    }
}