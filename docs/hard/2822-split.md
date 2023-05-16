---
title: 2822-split
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

The well known `split()` method splits a string into an array of substrings by looking for a separator, and returns the new array. The goal of this challenge is to split a string, by using a separator, but in the type system!

For example:

```ts
type result = Split<'Hi! How are you?', ' '>; // should be ['Hi!', 'How', 'are', 'you?']
```

## 分析

这个题目，在字符分析题里面其实算是比较简单的，字符分割之前已经做过比较多的题目了。

对于这种，一般的解法都是 `` T extends `${infer F}${SEP}${infer R}`  `` 这样的匹配即可将字符根据 SEP 进行分割。

需要注意的仅仅是边界条件而已。

## 题解

```ts
type cases = [
  Expect<Equal<Split<'Hi! How are you?', 'z'>, ['Hi! How are you?']>>,
  Expect<Equal<Split<'Hi! How are you?', ' '>, ['Hi!', 'How', 'are', 'you?']>>,
  Expect<
    Equal<
      Split<'Hi! How are you?', ''>,
      [
        'H',
        'i',
        '!',
        ' ',
        'H',
        'o',
        'w',
        ' ',
        'a',
        'r',
        'e',
        ' ',
        'y',
        'o',
        'u',
        '?',
      ]
    >
  >,
  Expect<Equal<Split<'', ''>, []>>,
  Expect<Equal<Split<'', 'z'>, ['']>>,
  Expect<Equal<Split<string, 'whatever'>, string[]>>,
];

type Split<S extends string, SEP extends string> =
  // 特殊处理 Equal<Split<string, 'whatever'>, string[]>
  string extends S
    ? string[]
    : // 分割符匹配
    S extends `${infer F}${SEP}${infer R}`
    ? // 能够匹配，判断剩余字符 R 是否为空，为空，则结束，否则，递归处理剩余字符
      [F, ...(R extends '' ? [] : Split<R, SEP>)]
    : // 由于上述已经处理了命中后，空字符的情况，所以如果还是走到这个逻辑，那么只有两种情况
    // 1. Split<'', ''>, 此时，返回空元组
    SEP extends ''
    ? []
    : // 2. Split<'xxxx', 'not x' 且不为 ''>，此时需要把字符本身返回
      [S];
```

## 知识点

1. 字符匹配套路
