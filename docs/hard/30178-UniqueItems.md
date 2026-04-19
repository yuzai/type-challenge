---
title: 30178-UniqueItems
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

实现 `uniqueItems`——一个"**受约束的恒等函数**"（Constrained Identity Function, CIF）。它接收一个字面量元组，

- 元素**全部唯一**时，返回这个元组（类型上保持 `const` 精度）；
- 元素**有重复**时，让重复的那些位置直接报类型错误。

```ts
uniqueItems([1, 2, 3]); // OK，返回类型 [1, 2, 3]
uniqueItems([1, 1]); // 报错
uniqueItems([1, 2, 2, 3, 4, 4]);
// 期望：只有两个 2 和两个 4 的位置报错，其他正常
```

加分项：

- 定位到**具体重复元素**的下标位置报错；
- 友好的错误信息，而非冷冰冰的 `not assignable to never`。

## 分析

关键技巧是 CIF 的经典模板：

1. 用 `<const T extends readonly unknown[]>` 的 `const` 修饰让 TS 把输入推断为最窄的字面量元组。
2. 参数的静态类型不是 `T`，而是 `T & MarkDupes<T>`——这是一种**约束"回贴"**：对 `T` 逐位置打标记，重复位置的类型打成 `never`，唯一位置保持原样。
3. 返回值类型仍然是 `T`，保证调用方拿到的是原始精度。

计数"这个元素在元组里出现了几次"可以用最朴素的递归遍历，判等必须用 `Equal` 的"严格相等"版本（见 [判断两个类型相等](/summary/基操-判断两个类型相等.md)），否则 `any` / `unknown` / `never` / 宽类型会互相吸收，导致误判。

## 题解

```ts
type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y
  ? 1
  : 2
  ? true
  : false;

// 检查 E 是否已经出现在 Seen 里
type AnyEqual<Seen extends readonly unknown[], E> = Seen extends readonly [
  infer F,
  ...infer R,
]
  ? Equal<F, E> extends true
    ? true
    : AnyEqual<R, E>
  : false;

// 对元组一边推进、一边维护已看过的元素；后出现的重复项打成 never
type MarkDupes<
  T extends readonly unknown[],
  Seen extends readonly unknown[] = [],
> = T extends readonly [infer F, ...infer R]
  ? AnyEqual<Seen, F> extends true
    ? [never, ...MarkDupes<R, [...Seen, F]>]
    : [F, ...MarkDupes<R, [...Seen, F]>]
  : [];

declare function uniqueItems<const T extends readonly unknown[]>(
  items: T & MarkDupes<T>,
): T;
```

解读：

- `<const T extends readonly unknown[]>`：`const` 让 TS 把传入的数组字面量推断成最精细的只读元组（不带 `const` 会退化成宽类型 `number[]`、`string[]` 等），这是整个类型约束能生效的前提。
- `MarkDupes<T, Seen>`：一个带累加器的递归。从左往右扫元组：当前元素如果已出现在 `Seen` 里，就把这个位置打成 `never`；否则保留原类型，并把它加入 `Seen` 继续递归。效果是**第一次出现的元素合法**、**后续重复处才报错**——这样 `@ts-expect-error` 只需标注在第二个 / 第三个等重复位置即可。
- `AnyEqual<Seen, E>`：严格 `Equal` 逐支扫描 `Seen`，避免 `any` / `unknown` 等宽类型互相吸收导致的误判。
- 参数类型 `T & MarkDupes<T>`：用交叉把原元组和"位置标记版"绑起来。调用方传的 `[1, 2, 2]` 在位置 2 上的 `MarkDupes` 结果是 `never`，和 `2` 不兼容，TS 就报错；不重复的位置交叉后等于原类型，传入 OK。
- 返回类型仍是 `T`，保留字面量精度。

进一步的友好错误信息（比如"重复元素不允许"这类文案）可以把 `never` 换成带 brand 的标签类型，例如 `{ _error: 'Duplicate element' }`，但会牺牲 `@ts-expect-error` 写法的简洁，这里不展开。

## 验证

```ts
uniqueItems([1, 2, 3]); // OK
uniqueItems(['a', 'b', 'c']); // OK
uniqueItems([1, 'a', true]); // OK

// @ts-expect-error 两个 1
uniqueItems([1, 1]);

uniqueItems([
  1, 2,
  // @ts-expect-error 第二个 2
  2, 3, 4,
  // @ts-expect-error 第二个 4
  4,
]);
```

## 知识点

- CIF（受约束的恒等函数）是把"运行时接受参数"和"编译时检查约束"拧在一起的通用套路：把**静态约束**写进参数类型里，TS 不满足就报错。
- `<const T>` 是 TypeScript 5.0 引入的 const 修饰泛型，效果相当于在调用点加 `as const`。没有它，数组字面量会被推成宽类型元组，字面量级的约束全部失效。
- 对每一位独立打标记的 mapped type `[K in keyof T]: ...`，在元组上保留元组形态。配合 `T & MarkDupes<T>` 产生位置级错误，是比"整体 never"更友好的体验。
- 严格 `Equal` 写法见 [判断两个类型相等](/summary/基操-判断两个类型相等.md)；带计数元组的递归统计见 [进阶-计数-加减乘除](/summary/进阶-计数-加减乘除.md)。
