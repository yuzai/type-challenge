---
title: 35314-ValidSudoku
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

验证一个 9×9 矩阵是否是有效的数独解。合法条件依旧是"每行、每列、每个 3×3 盒都恰好包含 `1..9`"，但输入这次是**扁平的** 9×9 矩阵，没有按盒分组：

```ts
type M = [
  [9, 5, 7, 8, 4, 6, 1, 3, 2],
  [2, 3, 4, 5, 9, 1, 6, 7, 8],
  // ...共 9 行 9 列
];
type R = ValidSudoku<M>; // true / false
```

## 分析

和 [31797 SudokuSolved](/hard/31797-SudokuSolved.md) 解同一类问题，只是输入结构没有了 3×3 盒的自然切分。行和列的校验没变，**3×3 盒校验**需要我们自己从扁平矩阵里把盒切出来。

最直接的做法：**给每一行按 3 个一组切**，就把矩阵从 `9×9` 变成 `9×3×3` —— 正是 31797 的输入形态。这样 box 校验的代码可以完全复用那边的套路。

## 题解

```ts
type Digits = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

type SameSet<T> = [Digits] extends [T]
  ? [T] extends [Digits]
    ? true
    : false
  : false;

// 每行校验
type CheckRows<M> = M extends readonly [
  infer R extends readonly number[],
  ...infer Rest,
]
  ? SameSet<R[number]> extends true
    ? CheckRows<Rest>
    : false
  : true;

type Transpose<M, H = M[0 & keyof M]> = H extends readonly any[]
  ? {
      [I in keyof H]: {
        [J in keyof M]: M[J] extends readonly any[]
          ? M[J][I & keyof M[J]]
          : never;
      };
    }
  : [];

// 把一行按 3 个一组切
type GroupOf3<R, Acc extends any[][] = []> = R extends readonly [
  infer A,
  infer B,
  infer C,
  ...infer Rest,
]
  ? GroupOf3<Rest, [...Acc, [A, B, C]]>
  : Acc;

// 对每行应用 GroupOf3，把 9×9 变成 9×3×3
type GroupAll<M> = {
  [I in keyof M]: GroupOf3<M[I]>;
};

// 与 31797 相同的盒校验
type CheckBand<Band> = Band extends readonly [
  readonly [
    readonly [...infer A1],
    readonly [...infer A2],
    readonly [...infer A3],
  ],
  readonly [
    readonly [...infer B1],
    readonly [...infer B2],
    readonly [...infer B3],
  ],
  readonly [
    readonly [...infer C1],
    readonly [...infer C2],
    readonly [...infer C3],
  ],
]
  ? SameSet<
      [...A1, ...B1, ...C1][number & keyof [...A1, ...B1, ...C1]]
    > extends true
    ? SameSet<
        [...A2, ...B2, ...C2][number & keyof [...A2, ...B2, ...C2]]
      > extends true
      ? SameSet<
          [...A3, ...B3, ...C3][number & keyof [...A3, ...B3, ...C3]]
        > extends true
        ? true
        : false
      : false
    : false
  : false;

type CheckBoxes<Rows> = Rows extends readonly [
  infer R0,
  infer R1,
  infer R2,
  ...infer Rest,
]
  ? CheckBand<[R0, R1, R2]> extends true
    ? CheckBoxes<Rest>
    : false
  : true;

type ValidSudoku<M extends number[][]> = CheckRows<M> extends true
  ? Transpose<M> extends infer TR extends readonly (readonly number[])[]
    ? CheckRows<TR> extends true
      ? GroupAll<M> extends infer GM
        ? CheckBoxes<GM> extends true
          ? true
          : false
        : false
      : false
    : false
  : false;
```

解读：

- `GroupOf3<R>`：递归地从行里切下 3 个元素拼成小元组，整行走完就得到三个 3-cell 组。
- `GroupAll<M>`：用 mapped type 对 9 行同时施加 `GroupOf3`，一步到位把 9×9 变成 9×3×3。
- 把结果喂给 `CheckBoxes` 就等价于调用 31797 的主逻辑——两题共享几乎全部代码。
- 行 / 列校验只需对 9 行各自和转置后的 9 行做 `SameSet` 检测。

## 验证

```ts
type cases = [
  ValidSudoku<
    [
      [9, 5, 7, 8, 4, 6, 1, 3, 2],
      [2, 3, 4, 5, 9, 1, 6, 7, 8],
      [1, 8, 6, 7, 3, 2, 5, 4, 9],
      [8, 9, 1, 6, 2, 3, 4, 5, 7],
      [3, 4, 5, 9, 7, 8, 2, 6, 1],
      [6, 7, 2, 1, 5, 4, 8, 9, 3],
      [4, 6, 8, 3, 1, 9, 7, 2, 5],
      [5, 2, 3, 4, 8, 7, 9, 1, 6],
      [7, 1, 9, 2, 6, 5, 3, 8, 4],
    ]
  >, // true
];
```

## 知识点

- **"把已知数量切成 N 个一组"是元组操作里非常常用的子步骤**，`GroupOf3` 是它固化到 3 的版本；推广成 `GroupOfN` 也是类似的 `[first N items, ...rest]` 递归。
- 只要输入结构和已有解法能对齐，**转换结构往往比重写逻辑划算**。这里把 9×9 升到 9×3×3 就直接复用了 31797 的 `CheckBoxes`。
- 双向子集判断集合相等、转置后复用行校验做列校验，这些都是 [31797 SudokuSolved](/hard/31797-SudokuSolved.md) 里用过的同一套套路。
