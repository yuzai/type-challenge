---
title: 4499-Chunk
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述


Do you know `lodash`? `Chunk` is a very useful function in it, now let's implement it.
`Chunk<T, N>` accepts two required type parameters, the `T` must be a `tuple`, and the `N` must be an `integer >=1`

```ts
type exp1 = Chunk<[1, 2, 3], 2> // expected to be [[1, 2], [3]]
type exp2 = Chunk<[1, 2, 3], 4> // expected to be [[1, 2, 3]]
type exp3 = Chunk<[1, 2, 3], 1> // expected to be [[1], [2], [3]]
```

## 分析

题目的意思两个入参，一个元组 T, 一个长度 D，将 T 的每 D 个元素组合在一起作为新元组的一项即可。

从这个题目来看，其实只需要遍历元组，每遍历到 D 个元组，就组成新的元素，再递归继续处理剩余元素即可。

这里不免要用到计数，同样的，可以通过 创建元组，利用元组的长度进行计数即可。

## 题解

```ts
type Chunk<
    T extends any[],
    D extends number = 1,
    // 通过 Arr 计数，并存储之前的元素
    Arr extends any[] = []> =
    // 遍历获取第一个元素
    T extends [infer F, ...infer R]
    // 如果凑够了 D 个元素
    ? Arr['length'] extends D
        // 将当前 Arr 作为元素并入新的元组中，递归剩余元素，并把当前第一个元素并入新的 Arr 中
        ? [Arr, ...Chunk<R, D, [F]>]
        // 否则，直接将元素并入 Arr 中，继续处理剩余元素
        : Chunk<R, D, [...Arr, F]>
    // 此处处理元组遍历完的情况，此时 Arr 可能为空，对应元组刚好是 D 的整数倍情况，此时返回空元组即可，如果不为空，将剩余元素组合成的 Arr 作为一项返回给上一次递归处理
    // 此处可以多想想为什么是 [Arr] 而不是 Arr，其实和 ts 无关啦，是返回值需要交由上一次的递归继续处理。
    : Arr extends [] ? [] : [Arr];
```

与以前的 Arr 计数不同，以往填充的都是 any，这次因为刚好也有元素被存储的诉求，就将遍历到的元素 F 替换了 any，这样当凑够了 D 个元素后，Arr 就是想要的元素组成的元组。

## 分析

1. 元组长度计数，这题更巧妙的替换了元组的内容来达到顺便存储的功能
2. 递归处理嵌套问题
3. 元组遍历