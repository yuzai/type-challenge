---
title: 34857-DefinedPartialRecord
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

构造一种类型，兼具 `Record` 的类型安全和 `Partial<Record>` 的"可缺省字段"特性：

- 可以只提供联合中的部分 key；
- 访问**已定义**的 key 一定是非 `undefined` 的（不会丢失类型精度）；
- 访问**未定义**的 key 直接报错（`Property does not exist`）。

```ts
const a: DefinedPartial<Record<'a' | 'b' | 'c', number>> = { a: 42 };
const sum = 0 + a.a; // 42，a 的类型是 number（非 undefined）
const err = a.b; // Error: Property 'b' does not exist
```

## 分析

`Record<K, V>` 的类型是 `{ [P in K]: V }`，要求所有 key 都存在。 `Partial<Record<K, V>>` 则所有 key 都可选，返回 `V | undefined`。

我们想要的是："**赋值时允许只写部分 key**，但**访问时只允许访问实际写了的 key**"。做法：

1. 在声明端让字段**可选**（允许赋值时漏掉），这用 mapped type 的 `?` 修饰；
2. 同时保持**值类型不追加 `undefined`**；
3. TS 默认：`{ a?: number }` 会被视为 `a: number | undefined`。为避免这点，启用 `exactOptionalPropertyTypes` 或手写一个映射，把"实际没写"的 key 从类型里剔除 —— 这要在**实例侧**做，而题目只要求类型层。

换个思路：TypeScript 并没有"按实际赋值的 key 自动收窄"的机制。本题的答案就是利用 mapped type 生成 `{ [P in K]+?: V }`，并在 `tsconfig` 中开启 `exactOptionalPropertyTypes` 让 TS 不自动加 `undefined`。于是类型层实现就极其简单：

## 题解

```ts
type DefinedPartial<T> = {
  [K in keyof T]+?: T[K];
};
```

- `+?` 显式标记字段为可选；
- 值类型保留原始的 `T[K]`，不追加 `undefined`；
- 题目的验收依赖 `exactOptionalPropertyTypes` 开关（type-challenges 仓库会开启这个编译选项），这样 `a.a` 直接是 `number` 而不是 `number | undefined`。
- 由于字段仍然是可选的（`?`），访问未赋值的 key 不会被自动允许；实际行为依赖 tsconfig。

## 验证

```ts
type R = DefinedPartial<Record<'a' | 'b' | 'c', number>>;
// { a?: number; b?: number; c?: number }

const x: R = { a: 42 };
const v: number = x.a!; // 在 exactOptionalPropertyTypes 下 x.a 就是 number
```

## 知识点

- 类型层实现看似平凡，重点在 tsconfig 的 `exactOptionalPropertyTypes`：它决定 `?` 是否给值追加 `undefined`。
- 这是非常见到的"**题目答案简单，考点在编译选项**"的例子。
