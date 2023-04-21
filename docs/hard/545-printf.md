---
title: 545-printf
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

Implement `Format<T extends string>` generic.

For example,

```ts
type FormatCase1 = Format<"%sabc"> // FormatCase1 : string => string
type FormatCase2 = Format<"%s%dabc"> // FormatCase2 : string => number => string
type FormatCase3 = Format<"sdabc"> // FormatCase3 :  string
type FormatCase4 = Format<"sd%abc"> // FormatCase4 :  string
```

## 分析

题目的描述不是特别清晰，可以再根据用例看下预期：

```ts
type cases = [
  Expect<Equal<Format<'abc'>, string>>,
  Expect<Equal<Format<'a%sbc'>, (s1: string) => string>>,
  Expect<Equal<Format<'a%dbc'>, (d1: number) => string>>,
  Expect<Equal<Format<'a%%dbc'>, string>>,
  Expect<Equal<Format<'a%%%dbc'>, (d1: number) => string>>,
  Expect<Equal<Format<'a%dbc%s'>, (d1: number) => (s1: string) => string>>,
]
```

可以看出来，本质是去匹配字符中 %d, %s 出现的地方，根据顺序依次作为函数入参，每次取一个(有点柯里化的意思)，返回值始终是 string。

题目本身其实不复杂，只是步骤相对多一些，但是这些步骤其实都接触过，比如 [147-cPrintfParser](/hard/147-cPrintfParser.md) 和 [柯里化](/hard/17-柯里化1)。

本题，便是该两题思路的集合。直接上题解。

## 题解

```ts
// 转换字符为元组
// '%s%d' -> [string, number]
type FormatParams<T extends string> =
  // 匹配 %
  T extends `${any}%${infer M}${infer R}`
  ? M extends 'd'
    ? [number, ...FormatParams<R>]
    : M extends 's'
      ? [string, ...FormatParams<R>]
      : FormatParams<R>
  : [];

// 转换元组为柯里化后的函数
// [string, number] -> (string) => (number) => string;
type FormatFn<T extends any[]> =
  T extends [infer F, ...infer R]
  ? (p: F) => FormatFn<R>
  // 没有元素直接返回 string
  : string;

type Format<T extends string> = FormatFn<FormatParams<T>>;
```


## 知识点

1. 玩转字符匹配 infer
2. 递归处理嵌套问题