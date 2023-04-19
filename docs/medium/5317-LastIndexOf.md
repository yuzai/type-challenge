---
title: 5317-LastIndexOf
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

实现类型版本的 ```Array.lastIndexOf```, ```LastIndexOf<T, U>```  接受数组 ```T```, any 类型 ```U```, 如果 ```U``` 存在于 ```T``` 中, 返回 ```U``` 在数组 ```T``` 中最后一个位置的索引, 不存在则返回 ```-1```

For example:

```typescript
type Res1 = LastIndexOf<[1, 2, 3, 2, 1], 2> // 3
type Res2 = LastIndexOf<[0, 0, 0], 2> // -1
```

## 分析

看到这题不免想到 [5153](/medium/5153-IndexOf.md)，只不过本题变成了最后一个元素出现的位置。

思路有好几种，先看第一种，从后往前遍历，这种最巧妙，也最简单

```ts
// 标准 Equal 判断逻辑，具体原因看 Equal判断 章节
type MyEqual<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false;

type LastIndexOf<T extends any[], U> =
  T extends [...infer F, infer R]
  ? Equal<R, U> extends true
    // 此时，剩余元组的长度就是要求的 index
    ? F['length']
    // 否则，递归剩余元素
    : LastIndexOf<F, U>
  : -1;
```

也可以从前往后遍历，遇到相同的记下当前 index,后续再遇到了进行覆盖即可。

```ts
type LastIndexOf<
  T extends any[],
  U,
  // 记录当前 index
  Arr extends any[] = [],
  // 记录匹配到的 index
  L extends number = -1> =
  T extends [infer F, ...infer R]
  ? Equal<F, U> extends true
    // 继续遍历，并把当前 index 存储在 L 中
    ? LastIndexOf<R, U, [...Arr, 1], Arr['length']>
    // 不相等也继续遍历，因为不知道后面有没有相等的
    : LastIndexOf<R, U, [...Arr, 1], L>
  // 遍历完返回 L 即可
  : L;
```

## 题解

```ts
// 标准 Equal 判断逻辑，具体原因看 Equal判断 章节
type MyEqual<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false;

type LastIndexOf<T extends any[], U> =
  T extends [...infer F, infer R]
  ? MyEqual<R, U> extends true
    // 此时，剩余元组的长度就是要求的 index
    ? F['length']
    // 否则，递归剩余元素
    : LastIndexOf<F, U>
  : -1;
```

## 知识点

1. 元组遍历套路