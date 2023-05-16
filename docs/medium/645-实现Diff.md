---
title: 645-实现Diff
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

获取两个接口类型中的差值属性。

```ts
type Foo = {
  a: string;
  b: number;
}
type Bar = {
  a: string;
  c: boolean
}

type Result1 = Diff<Foo,Bar> // { b: number, c: boolean }
type Result2 = Diff<Bar,Foo> // { b: number, c: boolean }

```

## 分析

这道题目其实就比较宽泛了，获取只存在于 A 或 只存在于 B 中的属性，网上有很多借助 `Omit`, `Exclude`, `&` 的解法，我认为都不太直观，其实借助 `as` 非常好实现。关于 `as` 可以参考 [实现Omit](/medium/3-实现Omit.md) 中介绍的部分。

首先通过 `keyof A | keyof B` 可以获取所有的属性，接下来只需要让即存在于 A 中的属性 又存在于 B 中的属性为 never 即可去除该属性，也就是 `P extends keyof A & keyof B ? never : P`。讲到这里题解基本就出来了。

## 题解

```ts
type Diff<O, O1> = {
  // keyof O | keyof O1 拿到所有的属性中，通过 keyof O & keyof O1 判断是否是公共属性，如是公共属性，置为 never
  [P in keyof O | keyof O1 as P extends keyof O & keyof O1 ? never : P]:
    // 补充属性值即可
    P extends keyof O
      ? O[P]
      : P extends keyof O1
        ? O1[P]
        : never;
}
```

## 知识点

1. 同 [实现Omit](/medium/3-实现Omit.md)。

