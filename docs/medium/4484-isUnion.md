---
title: 4484-isUnion
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

Implement a type ```IsTuple```, which takes an input type ```T``` and returns whether ```T``` is tuple type.

For example:

```typescript
type case1 = IsTuple<[number]> // true
type case2 = IsTuple<readonly [number]> // true
type case3 = IsTuple<number[]> // false
```

## 分析

判断是否是元组，其实 `T extends []` 即可，但是实际总是存在一些意外的情况：

1. readonly 修饰符，`readonly [] extends [] ? true : false` 是 false
2. never，可以参考 [isNever](/docs/medium/1042-isNever.md)。
3. number[]，表示数组，而非元组

对于1，可以看看例子：

```ts
// false
type Case1 = readonly [] extends [] ? true : false

// true
type Case2 = readonly [] extends readonly any[] ? true : false;
// true
type Case3 = [] extends readonly any[] ? true : false;
```

只需要把 `any[]` 调整为 `readonly any[]` 即可满足 `[]` 和 `readonly []`。

而 never 可以单独伶出来做判断。

剩下的就是数组的判断。

数组和元组核心的区别，就在于，元组的长度是固定的，而数组的长度是 number，故可以通过 `T['length']` 是否是 number 加以区分即可：

```ts
// true
type Case1 = number extends any[]['length'] ? true : false;
// false
type Case2 = number extends [1, 2, 3]['length'] ? true : false;
```

## 题解

```ts
type IsUnion<T> =
  // 排除 never
  [T] extends [never]
  ? false
  // 判断是否是元组
  : T extends readonly any[]
    // 排除数组的影响
    ? number extends T['length']
      ? false
      : true
    : false;
```

## 知识点

1. readonly 修饰符对元组的影响
2. 元组的长度是固定的，而数组的长度是 number，故可以通过 `T['length']` 是否是 number 加以区分

