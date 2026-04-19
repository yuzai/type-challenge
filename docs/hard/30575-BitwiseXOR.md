---
title: 30575-BitwiseXOR
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

实现 `BitwiseXOR<S1, S2>`，对两个二进制字符串做按位异或，返回异或后的二进制字符串。长度不同时，短的视为前面补 `0`。

```ts
type R1 = BitwiseXOR<'0', '1'>; // '1'
type R2 = BitwiseXOR<'1', '1'>; // '0'
type R3 = BitwiseXOR<'10', '1'>; // '11'
type R4 = BitwiseXOR<'110', '1'>; // '111'
type R5 = BitwiseXOR<'101', '11'>; // '110'
```

## 分析

正常情况下二进制竖式加减都是从**最低位**开始，而 TS 模板匹配 `` `${infer A}${infer B}` `` 默认从**最高位**开始取（`A` 是第一个字符，`B` 是剩下）。

两种套路：

1. **先反转字符串，再从左（原来的最低位）开始逐位 XOR**，最后把结果再反转回来。
2. 直接对左端处理，但要保证两个字符串等长（短的前面补 `0`）。

方法一最省心——`Reverse` 本身也是经典的字符串递归，见 [类型转换大集合](/summary/基操-类型转换大集合.md)。

异或表很简单：两位相同 → `0`，不同 → `1`。用 `A extends B ? '0' : '1'` 一行搞定。

## 题解

```ts
type Reverse<
  S extends string,
  Acc extends string = '',
> = S extends `${infer C}${infer R}` ? Reverse<R, `${C}${Acc}`> : Acc;

type XORBit<A extends string, B extends string> = A extends B ? '0' : '1';

// 两个字符串都是反转后的形态，从左（原最低位）开始逐位 XOR
type XORReversed<
  S1 extends string,
  S2 extends string,
  Acc extends string = '',
> = S1 extends `${infer C1}${infer R1}`
  ? S2 extends `${infer C2}${infer R2}`
    ? XORReversed<R1, R2, `${Acc}${XORBit<C1, C2>}`>
    : XORReversed<R1, '', `${Acc}${C1}`>
  : S2 extends `${infer C2}${infer R2}`
  ? XORReversed<'', R2, `${Acc}${C2}`>
  : Acc;

type BitwiseXOR<S1 extends string, S2 extends string> = Reverse<
  XORReversed<Reverse<S1>, Reverse<S2>>
>;
```

解读：

- `Reverse<S>`：头部切一个字符，塞到累加器的**前面**，完成反转。
- `XORReversed<S1, S2, Acc>`：从两个反转后字符串的左端（原最低位）取字符：
  - 两边都有 → XOR 后拼到 `Acc` 尾部；
  - 其中一边空 → 把另一边的剩余原样拼上（相当于和 `0` 异或）；
  - 都空 → 返回 `Acc`。
- 最外面再 `Reverse` 把累加器转回来，即得 XOR 结果。

## 验证

```ts
type cases = [
  BitwiseXOR<'0', '1'>, // '1'
  BitwiseXOR<'1', '1'>, // '0'
  BitwiseXOR<'10', '1'>, // '11'
  BitwiseXOR<'110', '1'>, // '111'
  BitwiseXOR<'101', '11'>, // '110'
];
```

## 知识点

- `A extends B ? '0' : '1'`：当 `A` / `B` 是两个单字符字面量时，这个比较等价于"相等比较"，正好对应 XOR 的真值表。
- 处理任何"从最低位开始"的字符串算术：先 `Reverse` 再顺着做，是最通用的套路，见 [类型转换大集合](/summary/基操-类型转换大集合.md)。
- 累加器 `Acc` 参数做尾递归，既省思维也把最大递归深度推到 1000，见 [冷门-递归深度](/summary/冷门-递归深度.md)。
