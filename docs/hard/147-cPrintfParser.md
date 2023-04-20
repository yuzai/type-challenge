---
title: 147-cPrintfParser
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

There is a function in C language: `printf`. This function allows us to print something with formatting. Like this:

```c
printf("The result is %d.", 42);
```

This challenge requires you to parse the input string and extract the format placeholders like `%d` and `%f`. For example, if the input string is `"The result is %d."`, the parsed result is a tuple `['dec']`.

Here is the mapping:

```typescript
type ControlsMap = {
  c: 'char',
  s: 'string',
  d: 'dec',
  o: 'oct',
  h: 'hex',
  f: 'float',
  p: 'pointer',
}
```

## 分析

可以先看下用例：

```ts
type cases = [
  Expect<Equal<ParsePrintFormat<''>, []>>,
  Expect<Equal<ParsePrintFormat<'Any string.'>, []>>,
  Expect<Equal<ParsePrintFormat<'The result is %d.'>, ['dec']>>,
  Expect<Equal<ParsePrintFormat<'The result is %%d.'>, []>>,
  Expect<Equal<ParsePrintFormat<'The result is %%%d.'>, ['dec']>>,
  Expect<Equal<ParsePrintFormat<'The result is %f.'>, ['float']>>,
  Expect<Equal<ParsePrintFormat<'The result is %h.'>, ['hex']>>,
  Expect<Equal<ParsePrintFormat<'The result is %q.'>, []>>,
  Expect<Equal<ParsePrintFormat<'Hello %s: score is %d.'>, ['string', 'dec']>>,
  Expect<Equal<ParsePrintFormat<'The result is %'>, []>>,
]
```

其本质是匹配 %x，其中 x ，必须是 `ControlsMap` 中的属性。对于 %%x，可以判定为无效。

可以通过匹配 `${infer F}%${infer X}${infer R}` 来进行处理。也可以遍历处理。

这里仅讲解匹配处理即可。

## 题解

```ts
type ParsePrintFormat<
  T extends string,
> =
  // 匹配 % 后的 X
  T extends `${infer F}%${infer X}${infer R}`
  // X 合法
  ? X extends keyof ControlsMap
    // 像结果中增加 X，并递归剩余字符
    ? [ControlsMap[X], ...ParsePrintFormat<R>]
    // 不合法，直接递归剩余字符
    : ParsePrintFormat<R>
  // 没有匹配到则返回 []
  : [];
```

## 知识点

1. 字符匹配套路

