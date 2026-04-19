---
title: 25747-IsNegativeNumber
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

实现 `IsNegativeNumber<N>`，判断一个数字是否为负数：

- `N` 是负数 → `true`；
- `N` 是正数或 `0` → `false`；
- `N` 是 `number` 本身 → `never`；
- `N` 是联合 → `never`。

```ts
type R1 = IsNegativeNumber<-1>; // true
type R2 = IsNegativeNumber<0>; // false
type R3 = IsNegativeNumber<1.9>; // false
type R4 = IsNegativeNumber<number>; // never
type R5 = IsNegativeNumber<-1 | -2>; // never
```

## 分析

分三步：

1. **识别 `number` 自身**：用 `number extends N` 卡住——只有 `N = number`（或 `any`）时该条件才成立。
2. **识别联合**：套 [战斗基-联合类型的分发特性](/summary/战斗基-联合类型的分发特性.md) 里的 `IsUnion` 套路。
3. **判正负**：把 `N` 转成字符串，看是不是以 `-` 开头——这是处理数字末位/前缀最稳的办法，见 [冷门-字面量类型和基础类型](/summary/冷门-字面量类型和基础类型.md)。

## 题解

```ts
type IsUnion<T, U = T> = T extends any
  ? [U] extends [T]
    ? false
    : true
  : false;

type IsNegativeNumber<N extends number> = number extends N
  ? never
  : IsUnion<N> extends true
  ? never
  : `${N}` extends `-${string}`
  ? true
  : false;
```

解读：

- `number extends N`：反方向判断"N 等于 number"——具体数字字面量不会被 `number` 覆盖，只有 `N` 自己就是 `number`（或 `any`）时此式为真。
- `IsUnion<N>`：靠内外 `T = U` 自比的差异侦测联合。
- `` `${N}` extends `-${string}` ``：把数字转成字符串模板，负数永远以 `-` 开头（正数和 0 都不会）。
- 先判 `number` 再判联合：避免 `number extends -1 | -2` 被错误识别。

## 验证

```ts
type cases = [
  IsNegativeNumber<0>, // false
  IsNegativeNumber<-1>, // true
  IsNegativeNumber<-1.9>, // true
  IsNegativeNumber<-100_000_000>, // true
  IsNegativeNumber<1>, // false
  IsNegativeNumber<1.9>, // false
  IsNegativeNumber<number>, // never
  IsNegativeNumber<-1 | -2>, // never
];
```

## 知识点

- "`number extends N`" 反向判断是不是 `number` 本身，比 `N extends number` 稳得多；对于 `any` 也能顺便过滤。
- `IsUnion` 模板见 [战斗基-联合类型的分发特性](/summary/战斗基-联合类型的分发特性.md)。
- 数字 → 字符串模板匹配是处理"大数字/符号位/末位"的通用手段，见 [冷门-字面量类型和基础类型](/summary/冷门-字面量类型和基础类型.md)。
