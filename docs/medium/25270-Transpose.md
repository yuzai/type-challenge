---
title: 25270-Transpose
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

矩阵转置：翻转对角线，把行索引和列索引互换。

```ts
type A = Transpose<[[1]]>; // [[1]]
type B = Transpose<[[1, 2], [3, 4]]>; // [[1, 3], [2, 4]]
type C = Transpose<[[1, 2, 3], [4, 5, 6]]>; // [[1, 4], [2, 5], [3, 6]]
```

## 分析

转置的直观定义：新矩阵的第 `j` 列就是原矩阵第 `j` 行的每个元素排起来。

在 TS 类型层面换一种思路更优雅：**借助 mapped type 配合元组索引**。新矩阵第 `i` 行第 `j` 列的值就是 `M[j][i]`，所以可以：

1. 用 `M[0]`（第一行）的长度作为新矩阵的行数模板；
2. 对新矩阵的每一行（即原矩阵的每一列索引 `i`），用 `M[number][i]` 的形式取出那一列 —— 但 `M[number][i]` 会丢失顺序，需要对每一原行 map。

## 题解

```ts
type Transpose<
  M extends any[][],
  H = M[0],
> = H extends []
  ? []
  : {
      [I in keyof H]: {
        [J in keyof M]: J extends `${number}`
          ? I extends keyof M[J & keyof M]
            ? M[J & keyof M][I & keyof M[J & keyof M]]
            : never
          : never;
      };
    };
```

写简单些，推荐用递归 + 首列提取：

```ts
type Head<M extends any[][]> = {
  [K in keyof M]: M[K] extends [infer F, ...any] ? F : never;
};

type Tail<M extends any[][]> = {
  [K in keyof M]: M[K] extends [any, ...infer R] ? R : [];
};

type Transpose<M extends any[][]> =
  M[0] extends []
    ? []
    : [Head<M>, ...Transpose<Tail<M>>];
```

解读：

- `Head<M>`：对每一行取第一项，组成新矩阵的第一行。
- `Tail<M>`：对每一行丢掉第一项，继续递归。
- 出口：当第一行是 `[]` 时（即所有行都已被削空），返回 `[]`。

## 验证

```ts
type R1 = Transpose<[[1]]>;               // [[1]]
type R2 = Transpose<[[1, 2], [3, 4]]>;    // [[1, 3], [2, 4]]
type R3 = Transpose<[[1, 2, 3], [4, 5, 6]]>;
// [[1, 4], [2, 5], [3, 6]]
```

## 知识点

- `[K in keyof T]` 对元组的映射会保留元组形态，是本题 `Head` / `Tail` 辅助的基础，见 [元组遍历的黑科技](/summary/基操-元组遍历的黑科技.md)。
