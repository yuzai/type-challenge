---
title: 8987-Subsequence
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

Given an array of unique elements, return all possible subsequences.

A subsequence is a sequence that can be derived from an array by deleting some or no elements without changing the order of the remaining elements.

For example:

```typescript
type A = Subsequence<[1, 2]>; // [] | [1] | [2] | [1, 2]
```

## 分析

看着这个题目，不知道同学有没有同感，似曾相识。

其实本质也还是排列组合（第一次做的时候真的蛮痛苦的这几个题目，绝对是分发特性的极致利用）。但是因为这道题目不限制顺序，[1, 2] 和 [2, 1] 认为是同一个，这就是和之前题目最大的不同

在之前的题目中，都是利用分发特性实现遍历，然后和去除了当前元素的剩余元素进行组合，从而得到结果，他们的结果，是考虑顺序的。

这个题的思路，有点类似，对于每一个元素，都只有两种选择，选 or 不选。所以我们只需要遍历一次，每个元素的处理都是选 or 不选，就能得到题目要的结果。

```ts
// 仅仅是演示题目过程
/*
[1, 2]
遍历到 1
选1
    1 | 遍历到 2
        选2
            得到 [1, 2]
        不选2
            得到 [1]
不选1
    遍历到 2
        选2 
            得到 [2]
        不选2
            得到 []
*/
```

## 题解

有了思路，题解就非常简单了

```ts
type Subsequence<T extends any[]> = T extends [infer F, ...infer R]
  ? // 选当前元素并递归 | 不选当前元素并递归
    [F, ...Subsequence<R>] | Subsequence<R>
  : [];
```

## 知识点

1. 元组遍历套路
2. 编程思路

建议 4 道题目放一起看看：

[全排列](/medium/296-实现全排列.md)

[所有组合](/medium/4260-实现所有组合.md)

[排除了空的所有组合](/medium/8767-Combination.md)

[不考虑顺序的组合](/medium/8987-Subsequence.md)

数学术语可能不太严谨，大家明白意思即可
