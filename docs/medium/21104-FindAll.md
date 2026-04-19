---
title: 21104-FindAll
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

给定一个文本字符串 `T` 和模式串 `P`，实现 `FindAll<T, P>`，返回 `P` 在 `T` 中所有匹配的起始索引（从 0 开始）组成的元组。

```ts
type R1 = FindAll<'', ''>; // []
type R2 = FindAll<'a', ''>; // []
type R3 = FindAll<'aaa', 'aa'>; // [0, 1]
type R4 = FindAll<'aaaa', 'aa'>; // [0, 1, 2]
type R5 = FindAll<'abcabcabc', 'abc'>; // [0, 3, 6]
```

## 分析

典型的字符串遍历 + 计数题。

- 遍历 `T`，每到一个位置看"当前剩余字符串"是否以 `P` 开头。
- 命中则把当前索引塞进结果；无论命中与否，都把索引 +1（即去掉 `T` 的首字符继续）。

注意几点：

- 空模式 `P = ''` 直接返回 `[]`，否则会无限匹配。
- 匹配成功后是否跳过整段 `P`？从例子 `FindAll<'aaa', 'aa'> = [0, 1]` 可见 **不跳**，滑动窗口每次步进 1。

索引用计数元组维护（见 [加减乘除](/summary/进阶-计数-加减乘除.md)）。

## 题解

```ts
type FindAll<
  T extends string,
  P extends string,
  Idx extends any[] = [],
  Result extends number[] = [],
> = P extends ''
  ? []
  : T extends `${infer _F}${infer R}`
  ? T extends `${P}${infer _}`
    ? FindAll<R, P, [...Idx, 1], [...Result, Idx['length']]>
    : FindAll<R, P, [...Idx, 1], Result>
  : Result;
```

- `Idx` 元组长度记录"当前首字符在原串里的索引"。
- 先检查当前 `T` 能否以 `P` 开头；若能，记下 `Idx['length']`；无论如何，`T` 都向前推进一位。
- 递归出口：`T` 被吃空，返回 `Result`。

## 验证

```ts
type R1 = FindAll<'', ''>; // []
type R2 = FindAll<'a', ''>; // []
type R3 = FindAll<'aaa', 'aa'>; // [0, 1]
type R4 = FindAll<'aaaa', 'aa'>; // [0, 1, 2]
type R5 = FindAll<'abcabcabc', 'abc'>; // [0, 3, 6]
type R6 = FindAll<'xyz', 'abc'>; // []
```
