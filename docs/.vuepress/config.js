module.exports = {
    title: 'TS 类型挑战解题手册',
    description: '刷题吧少年',
    base: '/type-challenge/dist/',
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
              '/medium/116-实现Replace',
              '/medium/119-实现ReplaceAll',
              '/medium/191-追加参数',
              '/medium/296-实现全排列',
              '/medium/298-计算字符的长度',
              '/medium/459-实现Flatten',
              '/medium/527-AppendToObject',
              '/medium/529-实现Absolute',
              '/medium/531-字符转联合',
              '/medium/599-实现Merge',
              '/medium/612-实现KebabCase',
              '/medium/645-实现Diff',
              '/medium/949-AnyOf',
              '/medium/1042-isNever',
              '/medium/1097-isUnion',
              '/medium/1130-实现ReplaceKeys',
              '/medium/1367-移除索引签名',
              '/medium/1978-百分比解析器',
              '/medium/2070-从字符串中剔除指定字符',
              '/medium/休息下',
              '/medium/2257-减一',
              '/medium/2595-实现PickByType',
              '/medium/2688-实现StartWith',
              '/medium/2693-实现EndsWith',
              '/medium/2757-实现PartialByKeys',
              '/medium/2759-实现RequiredByKeys',
              '/medium/2793-实现Mutable',
              '/medium/2852-实现OmitByType',
              '/medium/2946-实现ObjectEntries',
              '/medium/3062-实现Shift',
              '/medium/3188-元组转nested对象',
              '/medium/3192-实现Reverse',
              '/medium/3196-反转入参',
              '/medium/3242-实现FlattenDepth',
              '/medium/3326-BEMstylestring',
              '/medium/3376-实现中序遍历',
              '/medium/4179-实现Flip',
              '/medium/4182-实现斐波那契序列',
              '/medium/4260-实现所有组合',
              '/medium/4425-实现比较',
              '/medium/4471-实现Zip',
              '/medium/4484-isUnion',
              '/medium/再休息下吧',
              '/medium/4499-Chunk',
              '/medium/4518-fill',
              '/medium/4803-TrimRight',
              '/medium/5117-去除数组指定元素',
              '/medium/5140-Trunc',
              '/medium/5153-IndexOf',
              '/medium/5310-Join',
              '/medium/5317-LastIndexOf',
              '/medium/5360-unique',
              '/medium/5821-MapTypes',
              '/medium/7544-构造一个给定长度的元组',
              '/medium/8640-生成一定范围内的数字',
              '/medium/8767-Combination',
              '/medium/8987-Subsequence',
              '/medium/9142-CheckRepeatedChars',
              '/medium/9896-获取数组的中间元素',
              '/medium/10969-整数',
              '/medium/16259-转换为基本类型',
              '/medium/17973-DeepMutatable',
              '/medium/18142-all',
              '/medium/18220-filter',
              '/medium/中等难度题目刷完总结',
            ],
            // initialOpenGroupIndex: 1 // 可选的, 默认值是 0
          },
          {
            title: '困难',   // 必要的
            // path: '/hard/',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
            sidebarDepth: 1,    // 可选的, 默认值是 1
            children: [
              '/hard/todo'
            ],
            // initialOpenGroupIndex: 1 // 可选的, 默认值是 0
          },
          {
            title: '通用技巧总结',   // 必要的
            // path: '/hard/',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
            sidebarDepth: 1,    // 可选的, 默认值是 1
            children: [
              '/summary/判断两个类型相等',
              '/summary/todo',
            ],
            // initialOpenGroupIndex: 1 // 可选的, 默认值是 0
          },
        ],
        lastUpdated: 'Last Updated', // string | boolean
    }
}