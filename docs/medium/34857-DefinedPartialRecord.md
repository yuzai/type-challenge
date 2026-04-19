---
title: 34857-DefinedPartial
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

实现 `DefinedPartial<T>`，把对象类型 `T` 展开成"**所有非空子集对象**"的联合：

```ts
type A = DefinedPartial<{ a: string; b: string }>;
// { a: string }
// | { b: string }
// | { a: string; b: string }

type B = DefinedPartial<Record<'a' | 'b' | 'c', string>>;
// { a: string }
// | { b: string }
// | { c: string }
// | { a: string; b: string }
// | { a: string; c: string }
// | { b: string; c: string }
// | { a: string; b: string; c: string }
```

对 `N` 个 key 的对象，结果恰好 `2^N - 1` 支。

## 分析

题目等价于"列出 `T` 所有非空 key 子集，并把每个子集用 `Pick<T, subset>` 还原成对应的对象"。

直觉做法是"对 `keyof T` 分发 + 递归挑另一个"，但这里有个坑：条件类型分发时，`K` 变量会被替换成"当前单支"，`Exclude<K, X>` 直接拿不到别的 key——递归只产出单 key 的 `Pick`，没法拼出双 key、三 key 的组合。

正确套路分两步：

1. 先把 `keyof T` 的联合**转成元组**——元组不参与分发，能在递归里稳定地"一个一个走"。
2. 对元组递归，每一位有两种选择：**跳过** 当前 key，或把它**加入累加集合** `Acc`。递归到底，`Acc` 不为空就返回 `Pick<T, Acc>`。`2^N` 条路径天然覆盖所有子集，空集路径被兜底成 `never` 丢掉。

第 1 步需要"**联合转元组**"这个 hard 技巧，见 [hard/730 联合转元组](/hard/730-联合转元组.md)。

## 题解

```ts
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I,
) => void
  ? I
  : never;

type LastOfUnion<U> = UnionToIntersection<
  U extends any ? (x: U) => void : never
> extends (x: infer L) => void
  ? L
  : never;

type UnionToTuple<U, Last = LastOfUnion<U>> = [U] extends [never]
  ? []
  : [...UnionToTuple<Exclude<U, Last>>, Last];

type SubsetsFromKeys<
  T,
  Keys extends unknown[],
  Acc extends keyof T,
> = Keys extends [infer F extends keyof T, ...infer Rest extends (keyof T)[]]
  ? SubsetsFromKeys<T, Rest, Acc> | SubsetsFromKeys<T, Rest, Acc | F>
  : [Acc] extends [never]
  ? never
  : Pick<T, Acc>;

type DefinedPartial<T> = SubsetsFromKeys<T, UnionToTuple<keyof T>, never>;
```

解读：

- `UnionToTuple<U>` 把 `keyof T` 的联合变成元组。它靠 `LastOfUnion` 用逆变一次抠一个末项，再递归处理剩下的。
- `SubsetsFromKeys` 按元组一位一位递归：对当前位 `F`，**并集里同时展开两种选择**——不加入（`Acc` 不变）和加入（`Acc | F`）。由于元组递归不触发分发，`Acc` 能稳定地累积成一个真正的 key 联合。
- 递归出口：元组走完，`Acc` 若为 `never` 表示"一路上啥也没选"——对应空子集，不要它；否则用 `Pick<T, Acc>` 把真正累积到的 key 合集还原成对象。
- 相比常见的 "`Pick<T, X> & Pick<T, Y>`" 式拼接，`Pick<T, X | Y>` 在 `Equal` 下才是同一个类型，不需要额外 `Merge` 拍平——这是为什么要先转元组再累积 key 而不是直接交叉。

## 验证

```ts
type R1 = DefinedPartial<{ a: string; b: string }>;
// { a: string } | { b: string } | { a: string; b: string }

type R2 = DefinedPartial<Record<'a' | 'b' | 'c', string>>;
// 7 支

type R3 = DefinedPartial<Record<'a', number>>;
// { a: number }
```

## 知识点

- **枚举所有子集 = 对每个位置"选 / 不选"**：这是最经典的组合结构，与 [21106 CombinationKeyType](/medium/21106-CombinationKeyType.md) 的配对联合同属于 [排列组合大乱炖](/summary/算法-排列组合大乱炖.md) 里的分发模型。
- 累积 key 要用 **`Acc | F`**（联合）而不是 `Pick<T, X> & Pick<T, Y>`（交叉）。后者虽然语义相同，但会在 `Equal` 下被判为不等；前者统一走 `Pick<T, Acc>`，结构扁平，见 [对象遍历的 as 和索引访问](/summary/基操-对象遍历的as和索引访问.md)。
- 为了让递归不被联合分发打断，先通过 `UnionToTuple` 把 `keyof T` 转成元组，这样累加集合 `Acc` 才能稳定增长。`UnionToTuple` 的核心是利用逆变推断一次抠一个末项，见 [hard/730 联合转元组](/hard/730-联合转元组.md)。
