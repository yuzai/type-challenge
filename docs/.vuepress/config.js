module.exports = {
    title: 'TS 类型挑战通关手册',
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
        lineNumbers: false
    },
    themeConfig: {
        nav: [
          { text: '关于本文档', link: '/' },
          { text: 'Github', link: 'https://github.com/yuzai/type-challenge' },
        ],
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
              'hard/写在hard开始前',
              '/hard/6-SimpleVue',
              '/hard/17-柯里化1',
              'hard/55-UnionToIntersection',
              'hard/57-获取必填属性',
              'hard/58-获取可选属性',
              'hard/89-获取必填属性键值',
              'hard/90-获取可选属性键值',
              'hard/112-大写首字母',
              'hard/114-CamelCase',
              'hard/147-cPrintfParser',
              'hard/213-VueBasicProps',
              'hard/223-isAny',
              'hard/270-get',
              'hard/300-stringToNumber',
              'hard/399-元组过滤器',
              'hard/472-元组转EnumObject',
              'hard/545-printf',
              'hard/553-DeepObjectToUnique',
              'hard/651-字符长度2',
              'hard/730-联合转元组',
              'hard/847-StringJoin',
              'hard/956-DeepPick',
              'hard/1290-pinia',
              'hard/1383-Camelize',
              'hard/2070-DropString',
              'hard/2822-split',
              'hard/2828-ClassPublicKeys',
              'hard/2857-IsRequiredKey',
              'hard/2949-ObjectFromEntries',
              'hard/4037-判断波兰数',
              'hard/5181-mutablekeys',
              'hard/5423-intersection',
              'hard/6141-二进制转十进制',
              'hard/7258-ObjectKeyPaths',
              'hard/8804-两数之和',
              'hard/9155-判断日期有效性',
              'hard/9160-Assign',
              'hard/9384-Maximum',
              'hard/9775-大写keys',
              'hard/13580-Replaceunions',
              'hard/14080-FizzBuzz',
              'hard/14188-Run-lengthEncoding',
              'hard/15260-TreePathArray',
              'hard/19458-Snakecase',
              'hard/写在hard结束后',
            ],
            // initialOpenGroupIndex: 1 // 可选的, 默认值是 0
          },
          {
            title: '地狱级',   // 必要的
            // path: '/hard/',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
            sidebarDepth: 1,    // 可选的, 默认值是 1
            children: [
              '/extreme/5-GetReadOnlyKeys',
              '/extreme/151-QueryStringParser',
              '/extreme/todo',
            ],
            // initialOpenGroupIndex: 1 // 可选的, 默认值是 0
          },
          {
            title: '通用技巧总结',   // 必要的
            // path: '/hard/',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
            sidebarDepth: 1,    // 可选的, 默认值是 1
            children: [
              '/summary/基操-判断两个类型相等',
              '/summary/冷门-递归深度',
              '/summary/基操-箭头函数重载',
              '/summary/基操-对象遍历的as和索引访问',
              '/summary/基操-类型推断的边界条件',
              '/summary/基操-类型转换大集合',
              '/summary/基操-元组遍历的黑科技',
              '/summary/进阶-计数-加减乘除',
              '/summary/进阶-逆变顺变协变',
              '/summary/冷门-字面量类型和基础类型',
              '/summary/算法-排列组合大乱炖',
              '/summary/战斗基-联合类型的分发特性',
            ],
            // initialOpenGroupIndex: 1 // 可选的, 默认值是 0
          },
          '/Contactme.md',
        ],
        lastUpdated: 'Last Updated', // string | boolean
    }
}