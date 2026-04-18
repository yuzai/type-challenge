---
title: 21106-组合键类型
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

编写一个类型，把给定的修饰键数组 `ModifierKeys` 组合成所有可能的按键组合。要求：

1. 同一种修饰键组合不能重复出现；
2. `ModifierKeys` 中前面的键优先级高于后面的键，例如 `'cmd ctrl'` 合法，但 `'ctrl cmd'` 不合法。

```ts
type ModifierKeys = ['cmd', 'ctrl', 'shift', 'option'];

type A = Combs<ModifierKeys>;
// 'cmd' | 'ctrl' | 'shift' | 'option'
// | 'cmd ctrl' | 'cmd shift' | 'cmd option'
// | 'ctrl shift' | 'ctrl option' | 'shift option'
// | 'cmd ctrl shift' | ...
```

## 分析

约束"前者优先级高"等价于**只允许"左边 index 小、右边 index 大"的组合**。换言之，题目就是对元组做"**按原顺序**的非空子集枚举"，并用空格连接。

拆成两层：

1. 枚举所有"从位置 i 出发的"子序列；对每一项，决定"选 / 不选"。
2. 把选中的序列拼成字符串。

## 题解

```ts
type Combs<T extends string[]> = T extends [infer F extends string, ...infer R extends string[]]
  ? F | `${F} ${Combs<R>}` | Combs<R>
  : never;
```

解读：

- 拆出首项 `F`，剩余 `R`。对每一项有三种选择：
  - 只选 `F`；
  - 选 `F` 再拼上 `R` 里的某个组合（用模板串上空格）；
  - 不选 `F`，直接从 `R` 里继续。
- 返回的是这三条路径的联合，天然保证了"有序、不重复"。

递归出口：`T = []`，返回 `never`（空联合），不会贡献任何字符串。

## 验证

```ts
type M = ['cmd', 'ctrl', 'shift'];
type R = Combs<M>;
// 'cmd' | 'cmd ctrl' | 'cmd ctrl shift' | 'cmd shift'
// | 'ctrl' | 'ctrl shift' | 'shift'
```

## 知识点

- "**选 / 不选**"二叉分支是组合类题目的万能模板，见 [排列组合大乱炖](/summary/算法-排列组合大乱炖.md)。
- 用 `F | ${F} ${Combs<R>} | Combs<R>` 一行搞定三种情况，是本题最精巧之处。
