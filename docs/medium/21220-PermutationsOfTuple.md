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

关键点是"抽任意一个"。天然的想法是 `T[number]` 把元组拍成联合再分发。但这里有坑：测试包含 `any`、`unknown`、`never` 这些"特殊"类型——`[any, unknown]` 的 `T[number]` 会被吸收成 `unknown`，直接丢失第一个元素；`never` 则会让某一支整个短路成 `never`。

正确做法是**按下标抽**：对元组的每一个位置都做一次"抽出这个位、剩下的递归"，用联合把所有结果并起来。

## 题解

```ts
// 按下标抽出一个元素，返回 [抽出的元素, 剩下的元组] 的联合
type PickEach<T extends unknown[], Acc extends unknown[] = []> = T extends [
  infer F,
  ...infer Rest,
]
  ? [F, [...Acc, ...Rest]] | PickEach<Rest, [...Acc, F]>
  : never;

type PermutationsOfTuple<T extends unknown[]> = T extends []
  ? []
  : PickEach<T> extends infer P
  ? P extends [infer F, infer Rest extends unknown[]]
    ? [F, ...PermutationsOfTuple<Rest>]
    : never
  : never;
```

分两步：

1. **`PickEach<T>` 产出"抽一个 + 剩下"的联合**：把 `T` 依次劈开，左边累积已经跨过的，右边拿到当前位；对每一位都产出一对 `[F, [...Acc, ...Rest]]`。按位置抽取不依赖类型相等，`any` / `unknown` / `never` 都能正确位置区分。
2. **对每一对递归**：用 `P extends [F, Rest]` 把每一支解构出来，递归得到 `Rest` 的所有排列，再把 `F` 头插。

## 验证

```ts
type R1 = PermutationsOfTuple<[]>; // []
type R2 = PermutationsOfTuple<[1]>; // [1]
type R3 = PermutationsOfTuple<[1, 2]>; // [1, 2] | [2, 1]
type R4 = PermutationsOfTuple<[1, number, unknown]>;
// 6 支排列
```

## 知识点

- 元组里混有 `any` / `unknown` / `never` 时，尽量**按下标**工作，不要走 `T[number]`——否则会被这些"吸收型"类型坑。
- "累加器 + 剩余"分头劈开元组是 `PickEach` 这类"挑一个走一个"的通用套路，见 [元组遍历的黑科技](/summary/基操-元组遍历的黑科技.md)。
- 分发 + 递归是排列题的套路，见 [排列组合大乱炖](/summary/算法-排列组合大乱炖.md)。
