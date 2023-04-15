---
title: 9286-FirstUniqueCharIndex
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

Given a string s, find the first non-repeating character in it and return its index. If it does not exist, return -1. (Inspired by [leetcode 387](https://leetcode.com/problems/first-unique-character-in-a-string/))

## 分析

给定一个字符，找到第一个没有重复的字符的 index。

先说思路：遍历字符，对每一个字符判断出了它之外的字符是否包含这个字符，如果不包含，就是它了，否则一直遍历，直到为空，返回 -1。

这里有几个问题，如果简单的获取除了当前字符的剩余字符？如何判断当前的索引。

索引简单，之前也处理过多次了，通过辅助元组的长度控制即可。

而其他字符，最简单的方案也是通过辅助的参数来进行记录。

## 题解

```ts
// 这个 has 可以参考 easy 级别中的 Includes，这里因为是字符，简化了 equal 的逻辑
type Has<T extends string, U> =
  T extends `${infer F}${infer R}`
  ? F extends U
    ? true
    : Has<R, U>
  : false;

type FirstUniqueCharIndex<
    T extends string,
    // 辅助元组记录索引
    Arr extends any[] = [],
    // 辅助字符记录在当前字符前的其他字符
    U extends string = ''
> =
    // 遍历得到第一个字符和剩余字符
    T extends `${infer F}${infer R}`
    // 如果其他字符：剩余字符 + 在其之前的字符 中包含了 F
    ? Has<`${R}${U}`, F> extends true
        // 继续遍历，增加索引，并在之前的字符中加入 F
        ? FirstUniqueCharIndex<`${R}`, [...Arr, 1], `${U}${F}`>
        // 返回索引
        : Arr['length']
    // 没有
    : -1
```

## 知识点

1. 字符遍历套路
2. 辅助参数的合理利用，这一题中用来记录当前字符前面的字符，并不断更新
3. 元组长度来存储索引