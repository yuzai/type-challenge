---
title: 472-元组转EnumObject
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

枚举是 TypeScript 的一种原生语法（在 JavaScript 中不存在）。因此在 JavaScript 中枚举会被转成如下形式的代码：

```js
let OperatingSystem
;(function (OperatingSystem) {
  OperatingSystem[(OperatingSystem['MacOS'] = 0)] = 'MacOS'
  OperatingSystem[(OperatingSystem['Windows'] = 1)] = 'Windows'
  OperatingSystem[(OperatingSystem['Linux'] = 2)] = 'Linux'
})(OperatingSystem || (OperatingSystem = {}))
```

在这个问题中，你实现的类型应当将给定的字符串元组转成一个行为类似枚举的对象。此外，枚举的属性一般是 `pascal-case` 的。

```ts
Enum<['macOS', 'Windows', 'Linux']>
// -> { readonly MacOS: "macOS", readonly Windows: "Windows", readonly Linux: "Linux" }
```

如果传递了第二个泛型参数，且值为 `true`，那么返回值应当是一个 `number` 字面量。

```ts
Enum<['macOS', 'Windows', 'Linux'], true>
// -> { readonly MacOS: 0, readonly Windows: 1, readonly Linux: 2 }
```

## 分析

这个题目做起来还是很有意思的。

本质就是将输入的元组类型，转换成一个对象类型，只不过不像之前的题目 [11-元组转换为对象](/easy/11-元组转换为对象.md) 这么简单了。

可以根据入参的不同拆成两种情况：

为 false 时，此时要生成一个对象，并且属性需要首字母大写，只需要在[11-元组转换为对象](/easy/11-元组转换为对象.md) 的基础上通过 as 转换属性为大写即可。

```ts
type TupleToReadonlyObject<T extends readonly string[]> = {
  readonly [P in T[number] as Capitalize<P>]: P  
}
```

为 true 时，相对麻烦一点，因为需要保留属性原本在元组中的位置，想要保留位置，思路有不少种，可以先取出来元素，再查找在元组中的位置，这种方法虽然耗性能(查找元素在元组中的位置需要递归)，但是好处是可以直接借助 `T[number]` 遍历元组。

而其他的思路则是，不借助 `T[number]` 进行遍历，通过 `T extends [infer F, ...infer R]` 的方式遍历。

这里我通过从后往前遍历，因为此时 `T['length']` 就是要求的索引值，否则的话还需要单开一个辅助元素进行计数。

```ts
type TupleToObjectWithIndex<T extends readonly string[]> =
  // 遍历元组
  T extends readonly [...infer F extends string[], infer R extends string]
    ? {
      // 大写首字母，F['length'] 就是目标索引值
      readonly [P in R as Capitalize<P>]: F['length']
    } & TupleToObjectWithIndex<F>
    : {}
```

将二者合并，就是最终的结果了。

## 题解

```ts
type TupleToReadonlyObject<T extends readonly string[]> = {
  readonly [P in T[number] as Capitalize<P>]: P  
}

type TupleToObjectWithIndex<T extends readonly string[]> =
  T extends readonly [...infer F extends string[], infer R extends string]
    ? {
      readonly [P in R as Capitalize<P>]: F['length']
    } & TupleToObjectWithIndex<F>
    : {}

type Merge<T> = {
  [P in keyof T]: T[P]
};

type Enum<T extends readonly string[], N extends boolean = false> =
  N extends false
  ? TupleToReadonlyObject<T>
  : Merge<TupleToObjectWithIndex<T>>;
```

为什么需要 merge 可以查看 [Equals](/summary/判断两个类型相等.md) 中终极版的讨论。

## 知识点

1. 元组遍历的方法
2. as 操作修改属性名
