---
title: 35045-LongestCommonPrefix
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

给定字符串元组，返回它们的最长公共前缀。没有公共前缀则返回空串。

```ts
type R1 = LongestCommonPrefix<['flower', 'flow', 'flight']>; // 'fl'
type R2 = LongestCommonPrefix<['dog', 'racecar', 'race']>;    // ''
```

## 分析

类似 LeetCode 经典题。类型层的一种思路：

- 从第一个字符串出发，把它当候选前缀 `P`；
- 对其余每个字符串做"是否以 `P` 开头"的判断；
- 不是的话，就把 `P` 最后一个字符削掉，再试；
- 直到所有字符串都以 `P` 开头，或 `P` 变空。

关键辅助：

1. **去掉字符串最后一个字符**：用模板 `${infer A}${infer B}` 配合递归"走到最后一个字符前停下"。
2. **判断数组所有项都以某前缀开头**：头递归。

## 题解

```ts
type Head<S extends string, Acc extends string = ''> =
  S extends `${infer F}${infer R}`
    ? R extends ''
      ? Acc
      : Head<R, `${Acc}${F}`>
    : Acc;

type AllStartsWith<Arr extends string[], P extends string> =
  Arr extends [infer F extends string, ...infer Rest extends string[]]
    ? F extends `${P}${string}`
      ? AllStartsWith<Rest, P>
      : false
    : true;

type LongestCommonPrefix<
  Arr extends string[],
  P extends string = Arr[0],
> = P extends ''
  ? ''
  : AllStartsWith<Arr, P> extends true
    ? P
    : LongestCommonPrefix<Arr, Head<P>>;
```

解读：

- `Head<S>` 返回去掉最后一个字符的字符串（即"前缀"）。
- `AllStartsWith` 检查所有字符串是否都以 `P` 开头。
- `LongestCommonPrefix` 用第一个元素作初始前缀，若全部匹配就返回；否则把前缀缩短一位再试。

## 验证

```ts
type R1 = LongestCommonPrefix<['flower', 'flow', 'flight']>; // 'fl'
type R2 = LongestCommonPrefix<['dog', 'racecar', 'race']>;   // ''
type R3 = LongestCommonPrefix<['abc']>;                      // 'abc'
type R4 = LongestCommonPrefix<[]>;                           // '' (初始 P = undefined)
```

## 知识点

- 用 `${infer F}${infer R}` + 递归累积能对字符串做"去掉末位""取前缀"等操作，见 [元组遍历的黑科技](/summary/基操-元组遍历的黑科技.md) 的字符串对偶思路。
- `A extends `${P}${string}`` 是"判断 A 是否以 P 开头"的标准写法。
