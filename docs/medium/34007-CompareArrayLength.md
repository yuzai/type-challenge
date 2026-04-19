---
title: 34007-CompareArrayLength
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

比较两个元组长度：

- `T` 比 `U` 长 → 返回 `1`；
- `T` 比 `U` 短 → 返回 `-1`；
- 两者相等 → 返回 `0`。

```ts
type R1 = CompareArrayLength<[1, 2, 3], [1, 2]>; // 1
type R2 = CompareArrayLength<[1], [1, 2, 3]>; // -1
type R3 = CompareArrayLength<[1, 2], [1, 2]>; // 0
```

## 分析

与其先把 length 拿出来再比数字（要做 [减法](/summary/进阶-计数-加减乘除.md)），不如**两个元组同步剥首元素**：

- 谁先变空 → 谁短；
- 同时变空 → 一样长。

单次递归就能决定胜负，且不受 tuple 长度的数值大小限制。

## 题解

```ts
type CompareArrayLength<T extends any[], U extends any[]> = T extends [
  any,
  ...infer TR,
]
  ? U extends [any, ...infer UR]
    ? CompareArrayLength<TR, UR>
    : 1 // U 先空，T 长
  : U extends [any, ...any]
  ? -1 // T 先空，T 短
  : 0; // 同时空
```

每轮从两边各 pop 一个元素，直到至少一方耗尽。

## 验证

```ts
type R1 = CompareArrayLength<[], []>; // 0
type R2 = CompareArrayLength<[1, 2, 3], [1, 2]>; // 1
type R3 = CompareArrayLength<[1], [1, 2, 3]>; // -1
type R4 = CompareArrayLength<[1, 2, 3], [4, 5, 6]>; // 0
type R5 = CompareArrayLength<[any, any], [any, any, any]>; // -1
```

## 知识点

- 这种"**双元组同步消耗**"的比较，比"先算 length，再比数字"省一大截递归深度，是元组长度相关题的重要优化手段。
