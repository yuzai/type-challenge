---
title: 527-AppendToObject
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

实现一个为接口添加一个新字段的类型。该类型接收三个参数，返回带有新字段的接口类型。

例如:

```ts
type Test = { id: '1' }
type Result = AppendToObject<Test, 'value', 4> // expected to be { id: '1', value: 4 }
```

## 分析

这题操作的类型时对象，在对象上新增属性，相比较之前的 [实现 Omit](/medium/3-%E5%AE%9E%E7%8E%B0Omit.md)、[Readonly 2](/medium/8-Readonly2.md) 都简单很多。只需要根据传入的参数生成新的类型，同当前类型交叉即可得到结果。

## 题解

```ts
type Merge<T> = {
  [P in keyof T]: T[P];
}

type AppendToObject<T, U extends string, V> = Merge<T & {
  [K in U]: V
}>;
```

核心在于 `T & { [L in U]: V }`，其实到这里应该有同学提出疑惑了，为什么需要 `Merge` 包裹一层？

原因具体不清楚，但是可以直接从表现上来看：

```ts
export type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2
  ? true
  : false

type A = {
    a: number,
    b: number,
}

type B = {
    a: number
} & {
    b: number
}

type Merge<T> = {
  [P in keyof T]: T[P];
}

// false
type Case1 = Equal<A, B> extends true ? true : false;

// true
type Case2 = Equal<A, Merge<B>> extends true ? true : false;
```

这里关于 merge，本文不再探讨，记住即可

Equal 可以参考 [判断两个类型相等](/summary/%E5%88%A4%E6%96%AD%E4%B8%A4%E4%B8%AA%E7%B1%BB%E5%9E%8B%E7%9B%B8%E7%AD%89.md)

## 知识点

1. 对象交叉
2. 交叉后的对象 Merge
