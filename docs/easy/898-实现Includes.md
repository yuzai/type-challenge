---
title: 898-实现Includes
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

在类型系统里实现 JavaScript 的 `Array.includes` 方法，这个类型接受两个参数，返回的类型要么是 `true` 要么是 `false`。

例如：

```ts
type isPillarMen = Includes<['Kars', 'Esidisi', 'Wamuu', 'Santana'], 'Dio'> // expected to be `false`
```

## 分析

这个题目其实不免想到 [Exclude](/docs//easy//43-%E5%AE%9E%E7%8E%B0Exclude.md)，在 `Exclude` 题目中，借助 将元组转换为联合类型，并借助分发特性依次判断每个元素是否在是要排除掉的，从而解决了该问题。

在这个题目中，虽然题目看起来有相似之处，但是解法并不相同。

用 js 的正常思路来看，需要遍历元组的每一项，判断每一项和目标是否相同，如果有一项相同，那么返回 true，如果都不相同，则返回 false。

但是 ts 还有一个特性，就是 `A extends A | B` 是 true，借助这一条件，可以直接判断 目标项是否 `extends` 元组转成的联合即可。

基于此，可以非常简单的写下如下解法：

```ts
type Includes<T extends any[], U> = U extends T[number] ? true: false;
```

也能顺利通过部分题目的一部分 Case，但是对于一些 Case，表示无能无力。

```ts
type Case1 = Includes<[{}], { a: 1 }>
```

由于 `{ a: 1 } extends {}` 为 true，所以导致判定失效。

所以这道题的核心，就变成了如何精准的判断两个类型是否相等，关于这一点，单独查看 [此文章: todo](todo)。

了解了如何判断


