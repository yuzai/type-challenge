---
title: 21220-PermutationsOfTuple
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

给定元组 `T`，返回它的所有全排列组成的联合。

```ts
type R = PermutationsOfTuple<[1, number, unknown]>;
// | [1, number, unknown]
// | [1, unknown, number]
// | [number, 1, unknown]
// | [number, unknown, 1]
// | [unknown, 1, number]
// | [unknown, number, 1]
```

## 分析

与 [medium/296-实现全排列](/medium/296-实现全排列.md) 类似，区别是输入从联合换成了元组，输出从字符串换成了元组。

套路：

1. 从元组中"抽一个"作为当前位；
2. 剩下的元素递归排列；
3. 把当前位与递归结果拼起来。

关键点是"抽任意一个"。TS 里对元组做这个操作，可以把元组先转成联合（`T[number]`），利用联合分发"每支选一次"，然后再从元组里把这个选中的值删掉（用 `Remove` 辅助）。

## 题解

```ts
type Remove<T extends any[], U, R extends any[] = []> = T extends [
  infer F,
  ...infer Rest,
]
  ? Equal<F, U> extends true
    ? [...R, ...Rest]
    : Remove<Rest, U, [...R, F]>
  : R;

type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y
  ? 1
  : 2
  ? true
  : false;

type PermutationsOfTuple<T extends unknown[]> = T extends []
  ? []
  : T[number] extends infer U
  ? U extends any
    ? [U, ...PermutationsOfTuple<Remove<T, U>>]
    : never
  : never;
```

分三步：

1. **空元组 → `[]`**：递归出口。
2. **`T[number]` 拿到所有元素的联合 `U`**，配合 `U extends any` 触发分发，让每支单独继续。
3. **`Remove<T, U>` 从原元组里去掉"这次选的"元素**，对剩余部分递归，再把 `U` 头插。

`Remove` 使用 `Equal` 精确判等（避免 `unknown`、`number` 等一般类型互相吸收）。

## 验证

```ts
type R1 = PermutationsOfTuple<[]>; // []
type R2 = PermutationsOfTuple<[1]>; // [1]
type R3 = PermutationsOfTuple<[1, 2]>; // [1, 2] | [2, 1]
type R4 = PermutationsOfTuple<[1, number, unknown]>;
// 6 支排列
```

## 知识点

- `T[number]` 把元组转成元素的联合，见 [类型转换大集合](/summary/基操-类型转换大集合.md)。
- 分发 + 递归是排列题的套路，见 [排列组合大乱炖](/summary/算法-排列组合大乱炖.md)。
- 判等使用 `Equal` 终极版，见 [判断两个类型相等](/summary/基操-判断两个类型相等.md)。
