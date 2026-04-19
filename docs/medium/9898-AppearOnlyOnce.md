---
title: 9898-找出目标数组中只出现过一次的元素
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

找出目标数组中只出现过一次的元素。例如：输入 `[1,2,2,3,3,4,5,6,6,6]`，输出 `[1,4,5]`。

```ts
type R = FindEles<[1, 2, 2, 3, 3, 4, 5, 6, 6, 6]>; // [1, 4, 5]
```

## 分析

典型的元组递归题目。对每一项，检查它在整个数组中是否只出现了一次；如果是，把它加入结果；否则跳过。

"在元组里判断某项是否出现"用一个辅助类型 `Includes` 或者手写即可。但是本题要求"只出现一次"，所以需要的辅助类型是"**出现次数为 1**"。

考虑：

- 用一个计数辅助，逐项遍历整个元组，把出现次数统计出来再过滤。对类型层而言，`Equal` 比较成本高，这种做法麻烦。
- 更简单：对每一项 `F`，判断"剩余部分（除当前项外的所有项）"中是否还包含 `F`。如果不包含，说明它只出现一次。

第二种思路直接，参照 [元组遍历的黑科技](/summary/基操-元组遍历的黑科技.md)。

## 题解

```ts
type Includes<T extends any[], U> = T extends [infer F, ...infer R]
  ? Equal<F, U> extends true
    ? true
    : Includes<R, U>
  : false;

type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y
  ? 1
  : 2
  ? true
  : false;

type FindEles<T extends any[], All extends any[] = T> = T extends [
  infer F,
  ...infer R,
]
  ? CountEquals<F, All> extends 1
    ? [F, ...FindEles<R, All>]
    : FindEles<R, All>
  : [];

type CountEquals<U, T extends any[], C extends any[] = []> = T extends [
  infer F,
  ...infer R,
]
  ? Equal<F, U> extends true
    ? CountEquals<U, R, [...C, 1]>
    : CountEquals<U, R, C>
  : C['length'];
```

思路：

1. `Equal` 选用官方级判断，见 [判断两个类型相等](/summary/基操-判断两个类型相等.md)。
2. `CountEquals<U, T>` 用计数元组统计 `U` 在 `T` 中出现次数。
3. `FindEles` 拆头递归，当前项出现次数为 1 则保留，否则跳过；为了计数需要保留原始完整元组 `All`。

## 验证

```ts
type R1 = FindEles<[1, 2, 2, 3, 3, 4, 5, 6, 6, 6]>; // [1, 4, 5]
type R2 = FindEles<[]>; // []
type R3 = FindEles<[1, 1, 1]>; // []
type R4 = FindEles<['a', 'b', 'a', 'c']>; // ['b', 'c']
```
