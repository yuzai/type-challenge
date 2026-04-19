---
title: 21106-组合键类型
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

编写一个类型，把给定的修饰键数组 `ModifierKeys` 做两两组合。要求：

1. 同一种修饰键组合不能重复出现；
2. `ModifierKeys` 中前面的键优先级高于后面的键，例如 `'cmd ctrl'` 合法，但 `'ctrl cmd'` 不合法。

```ts
type ModifierKeys = ['cmd', 'ctrl', 'opt', 'fn'];

type A = Combs<ModifierKeys>;
// 'cmd ctrl' | 'cmd opt' | 'cmd fn'
// | 'ctrl opt' | 'ctrl fn' | 'opt fn'
```

## 分析

约束"前者优先级高"等价于**只允许"左边 index 小、右边 index 大"的组合**。换言之，对于元组里每一个元素 `F`，它可以和它**右边**的任意一个元素配对。

拆两步：

1. 拆出首项 `F`，把 `F` 和剩余元组 `R` 中的每一项都配对一次：`` `${F} ${R[number]}` ``。
2. 对剩余元组 `R` 递归同样的过程。

## 题解

```ts
type Combs<T extends string[]> = T extends [
  infer F extends string,
  ...infer R extends string[],
]
  ? `${F} ${R[number]}` | Combs<R>
  : never;
```

解读：

- `F` 固定是前一位，`R[number]` 作为"后一位"的联合，模板字面量对联合自动分发，一次性铺开所有 `F-Rest` 配对。
- 对 `R` 继续递归，直到 `R = []` → `R[number]` 为 `never`，整支返回 `never` 退出。

## 验证

```ts
type M = ['cmd', 'ctrl', 'opt', 'fn'];
type R = Combs<M>;
// 'cmd ctrl' | 'cmd opt' | 'cmd fn' | 'ctrl opt' | 'ctrl fn' | 'opt fn'
```

## 知识点

- `R[number]` 把元组展成联合是最廉价的方式，见 [类型转换大集合](/summary/基操-类型转换大集合.md)。
- 模板字面量对联合自动分发，配对 `` `${F} ${R[number]}` `` 一步到位。
