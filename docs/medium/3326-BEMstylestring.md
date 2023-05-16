---
title: 3326-BEMstylestring
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

The Block, Element, Modifier methodology (BEM) is a popular naming convention for classes in CSS.

For example, the block component would be represented as btn, element that depends upon the block would be represented as btn**price, modifier that changes the style of the block would be represented as btn--big or btn**price--warning.

Implement BEM<B, E, M> which generate string union from these three parameters. Where B is a string literal, E and M are string arrays (can be empty).

## 分析

这题是给定 B,E,M，取将其写成 BEM style 的格式。可能很多同学没用过 BEM，举几个例子看看就知道了

btn\_\_price--warning，就是通过下划线和短下划线连接即可。

但是题目中，E 和 M 是元组，可以看下用例：

```ts
type cases = [
  Expect<Equal<BEM<'btn', ['price'], []>, 'btn__price'>>,
  Expect<
    Equal<
      BEM<'btn', ['price'], ['warning', 'success']>,
      'btn__price--warning' | 'btn__price--success'
    >
  >,
  Expect<
    Equal<
      BEM<'btn', [], ['small', 'medium', 'large']>,
      'btn--small' | 'btn--medium' | 'btn--large'
    >
  >,
];
```

如果 E 和 M 是字符，那么写起来非常容易，只需要判断 E 和 M 是否为空进行拼接即可。但是题目给到的是元组。这里就需要提及一个特性：

```ts
// 也有点类似于联合类型的分发特性
// Case1 = 'abd' | 'acd'
type Case1 = `a${'b' | 'c'}d`;
```

根据这个特性，其实只需要把元组转成联合类型即可。只需要提前判空然后通过 `T[number]` 将元组转为联合即可达到本题的效果。

## 题解

```ts
type BEM<
  B extends string,
  E extends string[],
  M extends string[],
> = E extends []
  ? M extends []
    ? // E 为 空，M 为空，返回 B 即可
      `${B}`
    : // E 为空，M不位空，返回 B--M
      `${B}--${M[number]}`
  : M extends []
  ? `${B}__${E[number]}`
  : `${B}__${E[number]}--${M[number]}`;
```

## 知识点

1. 字符中联合类型的类似分发特性
2. 索引签名实现元组转联合
