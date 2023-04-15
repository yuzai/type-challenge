---
title: 2757-实现PartialByKeys
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

实现一个通用的`PartialByKeys<T, K>`，它接收两个类型参数`T`和`K`。

`K`指定应设置为可选的`T`的属性集。当没有提供`K`时，它就和普通的`Partial<T>`一样使所有属性都是可选的。

例如:

```ts
interface User {
  name: string
  age: number
  address: string
}

type UserPartialName = PartialByKeys<User, 'name'> // { name?:string; age:number; address:string }
```

## 分析

这题其实和 [实现 readonly2](/docs/medium/8-Readonly2.md) 类似，均是遍历属性后，对目标属性添加修饰符即可。只需注意增加可选属性的方法即可。不再赘述。

## 题解

```ts
type Merge<T> = {
  [P in keyof T]: T[P]
}

type PartialByKeys<T, K extends keyof T = keyof T> = Merge<{
  [P in K]?: T[P]
} & {
  [P in keyof T as P extends K ? never : P]: T[P]
}>
```

这里，省略部分属性，也可以通过 `Pick<T, Exclude<T, K>>` 实现，反正就一行代码，自己实现来的又快又简单就没必要使用库工具了。

这里和 readonly 2 不同的是需要 merge 一下，关于为什么需要 merge，可以参考 [527-AppendToObject](/docs/medium/527-AppendToObject.md) 一节的描述（记住即可）。而 readonly 2 不需要 merge，是因为测试用例中，用的是 ALike 而不是 Equal，看其定义就明白了。

```ts
export type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2
  ? true
  : false

export type MergeInsertions<T> = T extends object ? { [K in keyof T]: MergeInsertions<T[K]> } : T

export type Alike<X, Y> = Equal<MergeInsertions<X>, MergeInsertions<Y>>
```

## 知识点

1. 同 [readonly 2](/docs/medium/8-Readonly2.md)
2. 同 [527-AppendToObject](/docs/medium/527-AppendToObject.md)，交叉元素 merge 后 equal 结果才正确

