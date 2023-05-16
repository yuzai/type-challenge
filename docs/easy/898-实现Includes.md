---
title: 898-实现Includes
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

在类型系统里实现 JavaScript 的 `Array.includes` 方法，这个类型接受两个参数，返回的类型要么是 `true` 要么是 `false`。

例如：

```ts
type isPillarMen = Includes<['Kars', 'Esidisi', 'Wamuu', 'Santana'], 'Dio'>; // expected to be `false`
```

## 分析

这个题目其实不免想到 [Exclude](/easy/43-实现Exclude.md)，在 `Exclude` 题目中，借助 将元组转换为联合类型，并借助分发特性依次判断每个元素是否在是要排除掉的，从而解决了该问题。

在这个题目中，虽然题目看起来有相似之处，但是解法并不相同。

用 js 的正常思路来看，需要遍历元组的每一项，判断每一项和目标是否相同，如果有一项相同，那么返回 true，如果都不相同，则返回 false。

但是 ts 还有一个特性，就是 `A extends A | B` 是 true，借助这一条件，可以直接判断 目标项是否 `extends` 元组转成的联合即可。

基于此，可以非常简单的写下如下解法：

```ts
type Includes<T extends any[], U> = U extends T[number] ? true : false;
```

也能顺利通过部分题目的一部分 Case，但是对于一些 Case，表示无能无力。

```ts
type Case1 = Includes<[{}], { a: 1 }>;
```

由于 `{ a: 1 } extends {}` 为 true，所以导致判定失效。

所以这道题的核心，就变成了如何精准的判断两个类型是否相等，关于这一点，单独查看 [通用技巧总结: 判断两个类型是否相等](/summary/基操-判断两个类型相等.md)。

了解了如何严格判断两个类型是否严格相等，下一步就是一步一步遍历这个元组，每一次比较当前类型和目标类型是否相等，有一次相等，就返回 true，否则递归继续比较剩余的元素。

但是由于之前的解法，严格比较是发生在 ts 内部的，所以并不能利用上述解法，故只能自行实现元组的遍历。

元组的遍历，除了通过 索引签名 `T[number]` 的方式，还可以通过对象遍历的方式(有点反直觉，但是在 ts 中，元组属于对象， 即 `[] extends {} ? true : false;` 返回 true)，以及 匹配推断的方式。

这里对象遍历的方式先不做过多讲解，此处仅说明匹配推断的方式，范式如下：

```ts
type Traverse<T extends any[]> = T extends [infer F, ...infer R]
  ? [F, ...Traverse<R>]
  : [];

// Case1 = [1, 2, 3];
type Case1 = Traverse<[1, 2, 3]>;
```

本质是利用 `T extends [infer F, ...infer R]`，推断出第一个元素的类型，对该元素执行相应操作后(此处没有，仅仅是又组合成了新元组)，继续 `Traverse<R>` 处理剩余元组，如果元组数量为 0，那么此时走 false 的逻辑，此处返回空元组。

## 题解

了解了元组的遍历后，结合 `Equal` 函数，本题的题解基本清晰，通过遍历每一个元组是否和目标类型相等，如不相等，继续判断剩余元素，相等，则返回 true。

```ts
// 标准 Equal 判断逻辑，具体原因看 Equal判断 章节
type MyEqual<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B
  ? 1
  : 2
  ? true
  : false;

type Includes<T extends readonly any[], U> = T extends [infer F, ...infer R]
  ? MyEqual<F, U> extends true
    ? true
    : // 递归判断剩余元素
      Includes<R, U>
  : false;
```

## 知识点

1. 元组遍历的第二种方式：`T extends [infer F, ...infer R]`
2. 元组遍历的第一种方式：`T[number]`
3. 递归处理剩余元素
4. Equal 的判断

ps: 这道题的难度应该放到 medium 中，毕竟涉及到了递归、`A extends infer F` 的写法。
