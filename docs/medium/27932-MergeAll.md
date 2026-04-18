---
title: 27932-MergeAll
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

把可变个数的对象类型合并成一个新类型。如果多个对象有相同的 key，对应的 value 合并成联合。

```ts
type Foo = { a: 1; b: 2 };
type Bar = { a: 2 };
type Baz = { c: 3 };

type R = MergeAll<[Foo, Bar, Baz]>; // { a: 1 | 2; b: 2; c: 3 }
```

## 分析

递归合并 + key 冲突时用联合。两两合并即可：

1. 从元组头取一个对象 `F`，剩余 `Rest` 递归合并得到 `M`；
2. 合并 `F` 与 `M`：
   - 两者都有的 key → value 取联合；
   - 只有 `F` 有的 → 保留；
   - 只有 `M` 有的 → 保留。

用 mapped type 写起来更优雅：对"`keyof F | keyof M`"这个联合逐支处理。

## 题解

```ts
type Merge<A, B> = {
  [K in keyof A | keyof B]:
    K extends keyof A
      ? K extends keyof B
        ? A[K] | B[K]
        : A[K]
      : K extends keyof B
        ? B[K]
        : never;
};

type MergeAll<T extends any[]> =
  T extends [infer F, ...infer R]
    ? Merge<F, MergeAll<R>>
    : {};
```

解读：

- `keyof A | keyof B` 覆盖两者所有 key。
- 三分支判断：A 有 / B 有 / 两者都有。
- 递归出口：空元组返回空对象 `{}`。

## 验证

```ts
type R1 = MergeAll<[{ a: 1; b: 2 }, { a: 2 }, { c: 3 }]>;
// { a: 1 | 2; b: 2; c: 3 }

type R2 = MergeAll<[]>; // {}
type R3 = MergeAll<[{ x: 1 }]>; // { x: 1 }
```

## 知识点

- `keyof A | keyof B` 取对象 key 的并集，mapped type 对联合分发，天然覆盖所有字段，见 [对象遍历的 as 和索引访问](/summary/基操-对象遍历的as和索引访问.md)。
- 类似的合并模式在 [medium/599-实现 Merge](/medium/599-实现Merge.md)、[hard/9160-Assign](/hard/9160-Assign.md) 里也会看到。
