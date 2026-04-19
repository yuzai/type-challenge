---
title: 31797-SudokuSolved
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

判定一个数独是否已解出。输入的结构略特别——它是一个 9 行 × 3 组 × 3 格的嵌套元组：

```ts
type Rows = [
  [[1, 2, 3], [5, 6, 7], [4, 8, 9]], // 第 1 行，按 3 个 pillar 拆开
  [[4, 8, 9], [1, 2, 3], [5, 6, 7]], // 第 2 行
  ...[[6, 4, 5], [9, 7, 8], [2, 3, 1]], // 第 9 行
];

type R = SudokuSolved<Rows>; // 全部合法时返回 true
```

合法意味着：**每一行、每一列、每一个 3×3 盒**都恰好包含 `1..9`。

## 分析

输入结构非常配合人类视角：

- 一行中，三个 pillar（列块）天然被分开了——这意味着 **3×3 盒的组合**可以直接"band 3 行 × 同 pillar"提取，不用做二次切分。

整体拆成三类检查：

1. **行**：把每一行的 3 组拼成 9 格，元素集合应等于 `Digits = 1|2|3|4|5|6|7|8|9`。
2. **3×3 盒**：每 3 行为一个 band。对每个 band 的 3 个 pillar 分别取出、拼成 9 格，同样检查集合。
3. **列**：这个结构不便直接读列，所以先把每行展平到 9 格、再做转置，最后把每列当作"一行"用同一套方法检查。

单个 9 元素集合是否恰好 `Digits` 用**双向 `extends`** 判断：`[A] extends [B] && [B] extends [A]`。关了分发（`[...]` 包裹），两边互为子集即等价于集合相等。

## 题解

```ts
type Digits = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

type SameSet<T> = [Digits] extends [T]
  ? [T] extends [Digits]
    ? true
    : false
  : false;

// 一行的 3 组拼成 9 格
type FlatRow<R> = R extends readonly [
  readonly [...infer A],
  readonly [...infer B],
  readonly [...infer C],
]
  ? [...A, ...B, ...C]
  : never;

// 行校验
type CheckRows<Rows> = Rows extends readonly [infer R, ...infer Rest]
  ? FlatRow<R> extends infer F extends readonly number[]
    ? SameSet<F[number]> extends true
      ? CheckRows<Rest>
      : false
    : false
  : true;

// 3×3 盒：band 里三个 pillar 各自拼起来
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

// 列校验：先全部展平，再转置
type FlattenAll<Rows, Acc extends any[] = []> = Rows extends readonly [
  infer R,
  ...infer Rest,
]
  ? FlattenAll<Rest, [...Acc, FlatRow<R>]>
  : Acc;

type Transpose<M, H = M[0 & keyof M]> = H extends readonly any[]
  ? {
      [I in keyof H]: {
        [J in keyof M]: M[J] extends readonly any[]
          ? M[J][I & keyof M[J]]
          : never;
      };
    }
  : [];

type CheckFlatRows<Rows> = Rows extends readonly [
  infer R extends readonly number[],
  ...infer Rest,
]
  ? SameSet<R[number]> extends true
    ? CheckFlatRows<Rest>
    : false
  : true;

type SudokuSolved<Rows> = CheckRows<Rows> extends true
  ? CheckBoxes<Rows> extends true
    ? FlattenAll<Rows> extends infer Flat extends readonly any[]
      ? Transpose<Flat> extends infer TR extends readonly (readonly number[])[]
        ? CheckFlatRows<TR> extends true
          ? true
          : false
        : false
      : false
    : false
  : false;
```

解读：

- **`FlatRow<R>`**：用 `readonly [...infer A]` 这种带 `readonly` 和 spread 的模式把三个组各自拆出来再拼起来，兼容 `as const` 元组。
- **`CheckBand`**：把一个 band 的 3 行一次性解构成 9 个小元组（`A1`/`A2`/`A3`/`B1`/`.../C3`），分别对三个 pillar 做拼接 + `SameSet` 校验。`[number & keyof X]` 是在 `[spread1, spread2, spread3]` 这种类型上取"所有数字索引的值"，等价于元组的 `[number]`，但兼容 spread 结果还没完全坍成元组的中间状态。
- **`CheckBoxes`** 递归：每次一次消掉 3 行，对这 3 行组成的 band 校验。最后元组走空即为全部合法。
- **列校验**：先 `FlattenAll` 把嵌套结构全部展平成 9×9 的二维数组；再 `Transpose` 转置；最后复用 `CheckFlatRows` 对每一列扫一遍。

## 验证

```ts
type T1 = SudokuSolved<
  [
    [[1, 2, 3], [5, 6, 7], [4, 8, 9]],
    [[4, 8, 9], [1, 2, 3], [5, 6, 7]],
    [[5, 6, 7], [4, 8, 9], [1, 2, 3]],
    [[3, 1, 2], [8, 5, 6], [9, 7, 4]],
    [[7, 9, 4], [3, 1, 2], [8, 5, 6]],
    [[8, 5, 6], [7, 9, 4], [3, 1, 2]],
    [[2, 3, 1], [6, 4, 5], [7, 9, 8]],
    [[9, 7, 8], [2, 3, 1], [6, 4, 5]],
    [[6, 4, 5], [9, 7, 8], [2, 3, 1]],
  ]
>;
// true
```

## 知识点

- **集合相等**靠双向子集：`[A] extends [B] ? [B] extends [A] ? ...`，`[...]` 关分发是必须的，不然联合会逐支分发把结果碾成 boolean。
- 输入的嵌套结构能少拆就少拆——3×3 盒的"band 3 行 × 同 pillar"本身就被分组好了，正面利用这个结构比先展平再按坐标切片省得多。
- 元组转置见 [medium/25270 Transpose](/medium/25270-Transpose.md) 和 [基操-元组遍历的黑科技](/summary/基操-元组遍历的黑科技.md)。数独题的列校验本质就是转置 + 复用行校验。
