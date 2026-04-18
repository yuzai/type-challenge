---
title: 30970-IsFixedStringLiteralType
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

判断一个类型 `S` 是否是"固定的字符串字面量类型"。以下情况返回 `false`：

- `never`
- 字符串字面量的联合（如 `'a' | 'b'`）
- 模板字符串类型中内嵌了 `string` / `number` / `bigint` / `boolean`（如 `${string}foo` 或 `foo${number}`）

```ts
type T1 = IsFixedStringLiteralType<'abc'>;           // true
type T2 = IsFixedStringLiteralType<string>;          // false
type T3 = IsFixedStringLiteralType<'a' | 'b'>;       // false
type T4 = IsFixedStringLiteralType<never>;           // false
type T5 = IsFixedStringLiteralType<`${number}abc`>;  // false
type T6 = IsFixedStringLiteralType<''>;              // true
```

## 分析

分两层：

1. **判 never 和联合**：
   - `never` 放进条件类型会分发出"空"，用 `[S] extends [never]` 识别；
   - 联合会触发分发 → 结果超过一支即"非固定"。借 `IsUnion` 处理，见 [分发特性](/summary/战斗基-联合类型的分发特性.md)。
2. **判模板中是否嵌入宽类型**：
   - `S extends `${string}`` 且 `string extends S` 为真 ⇒ 里面至少有一处是 `string`；
   - 同理检测 `number` / `bigint` / `boolean`。

严格来讲：**"S 是字面量" 等价于 "S extends basic ⇒ true，而 basic extends S ⇒ false"**（单向性）。把这几种 basic 都挨个判一次即可。

## 题解

```ts
type IsUnion<T, U = T> = T extends any
  ? [U] extends [T] ? false : true
  : false;

type IsFixedStringLiteralType<S> =
  [S] extends [never]
    ? false
    : IsUnion<S> extends true
      ? false
      : [S] extends [string]
        ? string extends S
          ? false
          : S extends `${string}${infer _}`
            ? Contains<S, string | number | bigint | boolean>
            : true
        : false;

// 检查 S 的模板字符串里是否嵌入了某种宽类型
type Contains<S, U> =
  U extends any
    ? S extends `${infer _A}${U & (string | number | bigint | boolean)}${infer _B}`
      ? false
      : never
    : never;
```

更简洁稳妥的做法（社区常用）：

```ts
type IsFixedStringLiteralType<S> =
  [S] extends [never]
    ? false
    : IsUnion<S> extends true
      ? false
      : S extends string
        ? string extends S
          ? false
          : `${S}` extends `${number}` | `${bigint}` | `${boolean}`
            ? true
            : S extends `${infer A}${infer B}`
              ? IsFixedCheck<S>
              : true
        : false;

type IsFixedCheck<S> =
  S extends `${infer A}${string}${infer B}` // 包含 ${string}
    ? false
    : S extends `${infer A}${number}${infer B}`
      ? false
      : S extends `${infer A}${bigint}${infer B}`
        ? false
        : S extends `${infer A}${boolean}${infer B}`
          ? false
          : true;
```

核心判断点：

1. `[S] extends [never]` 关分发判 `never`。
2. `IsUnion<S>` 判断是否是联合。
3. `string extends S` 区分 `string` 本身和具体字面量（见 [字面量类型和基础类型](/summary/冷门-字面量类型和基础类型.md)）。
4. 模板里是否嵌入 `string` / `number` / `bigint` / `boolean`：用四次模板匹配。

## 验证

```ts
type R1 = IsFixedStringLiteralType<'abc'>;           // true
type R2 = IsFixedStringLiteralType<string>;          // false
type R3 = IsFixedStringLiteralType<'a' | 'b'>;       // false
type R4 = IsFixedStringLiteralType<never>;           // false
type R5 = IsFixedStringLiteralType<`${number}abc`>;  // false
type R6 = IsFixedStringLiteralType<`abc`>;           // true
type R7 = IsFixedStringLiteralType<''>;              // true
```

## 知识点

- 关分发的经典模板 `[T] extends [U]`，见 [分发特性](/summary/战斗基-联合类型的分发特性.md)。
- 字面量 vs 基础类型的方向性判断，见 [字面量类型和基础类型](/summary/冷门-字面量类型和基础类型.md)。
- 多种 "嵌入" 探测用四次模板匹配覆盖，是这类题常见套路。
