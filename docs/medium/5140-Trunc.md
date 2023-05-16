---
title: 5140-Trunc
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

Implement the type version of `Math.trunc`, which takes string or number and returns the integer part of a number by removing any fractional digits.

For example:

```typescript
type A = Trunc<12.34>; // 12
```

## 分析

为了这一题，特意看了下 Math.trunc 的定义，确实不太常用，其就是移除小数部分，那这就好办了，用字符匹配下小数点前面的数据，即可达到目标。

## 题解

```ts
type Trunc<T extends number | string> = `${T}` extends `${infer F}.${infer R}`
  ? F
  : `${T}`;
```

要注意其中的 `` `${T}` ``，将数字转成了字符，不然 T extends xxx 始终走的 false 逻辑。

## 知识点

1. 字符推断匹配套路
2. 数字转字符 `` `${T}` ``
