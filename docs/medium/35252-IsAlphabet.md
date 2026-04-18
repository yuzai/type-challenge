---
title: 35252-IsAlphabet
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

判断一个单字符是否是字母（a–z 或 A–Z）。

```ts
type R1 = IsAlphabet<'a'>; // true
type R2 = IsAlphabet<'Z'>; // true
type R3 = IsAlphabet<'1'>; // false
type R4 = IsAlphabet<'!'>; // false
```

## 分析

TS 没有内置"字符区间判断"，但 `Uppercase` 和 `Lowercase` 这两个内置类型是**天然的字母识别器**：

- 字母 `'a'` 经过 `Uppercase` 会变成 `'A'`，和原值 **不相等**；
- 字母 `'A'` 经过 `Lowercase` 会变成 `'a'`，和原值 **不相等**；
- 非字母字符（数字 / 标点 / 中文等）在大小写变换后**没有变化**。

所以：**对字符 X，如果 `Uppercase<X> !== Lowercase<X>`，就是字母**。

## 题解

```ts
type IsAlphabet<S> = Uppercase<S & string> extends Lowercase<S & string>
  ? false
  : true;
```

解读：

- `S & string` 把泛型约束到字符串，安全使用 `Uppercase` / `Lowercase`。
- 相等 → 非字母 → `false`；不等 → 字母 → `true`。

## 验证

```ts
type R1 = IsAlphabet<'a'>; // true
type R2 = IsAlphabet<'Z'>; // true
type R3 = IsAlphabet<'1'>; // false
type R4 = IsAlphabet<'!'>; // false
type R5 = IsAlphabet<' '>; // false
type R6 = IsAlphabet<''>;  // false
```

## 知识点

- `Uppercase` / `Lowercase` / `Capitalize` / `Uncapitalize` 是 TS 的内置字符串字面量类型操作符，遇到字母以外的字符会原样返回。
- 这道题是"**巧用内置类型替代逐字符判断**"的经典例子。
