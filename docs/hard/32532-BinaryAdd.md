---
title: 32532-BinaryAdd
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

实现 `BinaryAdd<A, B>`：对两个**等长的二进制元组**做加法，返回结果二进制元组。全程不得转成十进制再算。

```ts
type R1 = BinaryAdd<[1], [1]>; // [1, 0]
type R2 = BinaryAdd<[0], [1]>; // [1]
type R3 = BinaryAdd<[1, 1, 0], [0, 0, 1]>; // [1, 1, 1]
```

## 分析

标准竖式加法：

1. 两个输入从**末位**对齐（题目保证同长度，不需要补齐）；
2. 每一位：`A_i + B_i + 进位`，计算出这一位的结果和下一位的进位；
3. 加到头如果还有进位，往最前头再摆一个 `1`。

在类型层：

- 末位拆分用 `T extends [...infer Init, infer Last]`；
- 加法表写死 8 种情况（2×2×2 = 8）即可；
- 结果用累加器从**低位**往高位一路 push 到前面。

## 题解

```ts
// A + B + Carry → [本位, 新进位]
type AddBit<A, B, C> = [A, B, C] extends [0, 0, 0]
  ? [0, 0]
  : [A, B, C] extends [0, 0, 1]
  ? [1, 0]
  : [A, B, C] extends [0, 1, 0]
  ? [1, 0]
  : [A, B, C] extends [0, 1, 1]
  ? [0, 1]
  : [A, B, C] extends [1, 0, 0]
  ? [1, 0]
  : [A, B, C] extends [1, 0, 1]
  ? [0, 1]
  : [A, B, C] extends [1, 1, 0]
  ? [0, 1]
  : [A, B, C] extends [1, 1, 1]
  ? [1, 1]
  : never;

type BinaryAdd<
  A extends any[],
  B extends any[],
  Carry = 0,
  Acc extends any[] = [],
> = A extends [...infer AInit, infer ALast]
  ? B extends [...infer BInit, infer BLast]
    ? AddBit<ALast, BLast, Carry> extends [infer Digit, infer NewCarry]
      ? BinaryAdd<AInit, BInit, NewCarry, [Digit, ...Acc]>
      : never
    : never
  : Carry extends 1
  ? [1, ...Acc]
  : Acc;
```

解读：

- `AddBit<A, B, C>`：八种组合硬编码，返回 `[本位, 新进位]`。比起递推计数，直接写死反而最稳。
- `BinaryAdd`：递归拆两个元组的末位，每轮产出一位结果并把它**插入累加器最前头**（保持从低位到高位的顺序反转过来）。
- 出口：两个元组都空时，若还有进位就把 `1` 接到最前面，否则直接返回 `Acc`。

## 验证

```ts
type cases = [
  BinaryAdd<[1], [1]>, // [1, 0]
  BinaryAdd<[0], [1]>, // [1]
  BinaryAdd<[1, 1, 0], [0, 0, 1]>, // [1, 1, 1]
  BinaryAdd<[1, 0, 1, 0, 1, 1, 1, 0], [1, 0, 0, 0, 1, 1, 0, 0]>,
  // [1, 0, 0, 1, 1, 1, 0, 1, 0]
];
```

## 知识点

- 末位拆分 `[...infer Init, infer Last]` 是元组反向遍历的基础手段，见 [基操-元组遍历的黑科技](/summary/基操-元组遍历的黑科技.md)。
- 加法表硬编码 8 种情况在类型层没有成本，比起拼元组长度算进位反而更省递归深度。
- `[Digit, ...Acc]` 把每位结果**头插**到累加器——得到的天然就是正确顺序（高位在前）。
