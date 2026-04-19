---
title: 30970-IsFixedStringLiteralType
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

判断一个类型 `S` 是否是"固定的字符串字面量类型"。以下情况返回 `false`：

- `never`；
- 字符串字面量的联合（如 `'a' | 'b'`）；
- 模板字符串类型中内嵌了 `string` / `number` / `bigint` / `boolean`（如 `` `${string}foo` ``、`` `foo${number}` ``、`` `${boolean}` `` 等）。

```ts
type T1 = IsFixedStringLiteralType<'abc'>; // true
type T2 = IsFixedStringLiteralType<string>; // false
type T3 = IsFixedStringLiteralType<'a' | 'b'>; // false
type T4 = IsFixedStringLiteralType<never>; // false
type T5 = IsFixedStringLiteralType<`${number}abc`>; // false
type T6 = IsFixedStringLiteralType<''>; // true
type T7 = IsFixedStringLiteralType<`${true}`>; // true  // 等于 'true'
```

## 分析

分三层：

1. **判 `never` 和联合**：
   - `[S] extends [never]` 关分发识别 `never`；
   - `IsUnion<S>` 判断是不是联合，见 [分发特性](/summary/战斗基-联合类型的分发特性.md)。
2. **判 `S = string`**：`string extends S` 为真说明 S 本身就是 `string`（或纯 `` `${string}` ``），直接 false。
3. **判模板里嵌入宽类型**：对每一种可能的宽类型做模板匹配——这是最难的一步，后文单独说。

关键在 **第 3 步**：TS 没有"是不是模板文本"的内建判定，只能靠"试着把宽类型插进去看能不能 match"这种间接手段，很容易误判。

## 题解

```ts
type IsUnion<T, U = T> = T extends any
  ? [U] extends [T]
    ? false
    : true
  : false;

type IsFixedStringLiteralType<S> = [S] extends [never]
  ? false
  : IsUnion<S> extends true
  ? false
  : S extends string
  ? string extends S
    ? false
    : // 逐字符展开，沿途任意位置若落到宽类型槽即判 false
      CheckAllFixed<S>
  : false;

type CheckAllFixed<S> = S extends ''
  ? true
  : S extends `${infer C}${infer Rest}`
  ? string extends C
    ? false
    : CheckAllFixed<Rest>
  : true;
```

解读：

- `CheckAllFixed` 靠 `` `${infer C}${infer Rest}` `` 从头逐字符抽。
- 对每个抽出的 `C` 判断 `string extends C`：
  - **字面字符**：`string extends 'A'` 为 false，继续向后；
  - **落到宽槽**：`string extends (宽类型)` 为 true，整条结果直接退化为 false。
- `S = ''` 是出口，返回 true。

## 验证

```ts
type R1 = IsFixedStringLiteralType<'abc'>; // true
type R2 = IsFixedStringLiteralType<string>; // false
type R3 = IsFixedStringLiteralType<'a' | 'b'>; // false
type R4 = IsFixedStringLiteralType<never>; // false
type R5 = IsFixedStringLiteralType<`${string}`>; // false
type R6 = IsFixedStringLiteralType<`${true}`>; // true （== 'true'）
type R7 = IsFixedStringLiteralType<`${null}`>; // true （== 'null'）
```

### ⚠️ 已知局限

上游测试集有 41 个 case，覆盖了许多微妙的边界，例如：

- `` `ABC${string}` ``、`` `${number}DEF` ``、`` `ABC${number}DEF` ``：前后都有固定字面量、中间夹一个宽类型槽；
- `` `${bigint}` ``、`` `${number}` ``：整个就是单个宽类型模板；
- `` `${string & {}}` ``：TS 里 `string & {}` 的"别名"在模板里有微妙的差异。

本文给出的逐字符展开方案在 **`${string}` 原形能被 `string extends S` 一次拦下**——但 `` `ABC${string}` `` 这类**前/后缀 + 宽槽**的模板，`string extends S` 不成立，逐字符展开时 `` `${infer C}${infer Rest}` `` 也抽不到"宽槽处"的独立字符，会误判成 true。`` `${number}` `` / `` `${bigint}` `` 同理。

要严格覆盖全部 41 case，需要更精细的模板结构检测——目前社区没有特别简洁的通解，建议直接参考 [tsch.js.org/30970 的 solutions 页](https://tsch.js.org/30970/solutions) 。

## 知识点

- 关分发的经典模板 `[T] extends [U]`，见 [分发特性](/summary/战斗基-联合类型的分发特性.md)。
- 字面量 vs 基础类型的方向性判断（`string extends S` 的含义），见 [字面量类型和基础类型](/summary/冷门-字面量类型和基础类型.md)。
- "模板字面量字符抽取"是 TS 里少数能在编译期做字符串内省的手段，见 [类型转换大集合](/summary/基操-类型转换大集合.md) 里字符串 → 联合的段落。
