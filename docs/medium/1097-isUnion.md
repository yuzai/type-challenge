---
title: 1097-isUnion
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

实现一个类型 `IsUnion`, 判断输入的类型是不是联合类型，如果是返回 true，否则返回 false。

For example:

```ts
type case1 = IsUnion<string>; // false
type case2 = IsUnion<string | number>; // true
type case3 = IsUnion<[string | number]>; // false
```

## 分析

这个题目可以说是充分利用了联合类型的分发特性，`T extends any ? T : never`，在联合类型的分发特性中，T 被分发后，在这个例子中，第二个 T 就是分发后的类型，而不是原始类型 T。还是通过例子来的实在：

```ts
// K 保留了原始的 T
type IsUnion<T, K = T> =
  // 触发联合类型的分发特性
  T extends any
    ? // 此时 T 并非原始的 T，而是其联合中的某一项
      // 如果此时 [K] extends [T] 成立，那么必然不是联合类型，否则必然是联合类型
      // 之所以要用 [] 包裹是为了去除联合类型的分发特性
      [K] extends [T]
      ? false
      : true
    : false;

// step1: T extends any, 触发分发特性
// step2: 对于 'a': [K] extends [T] -> ['a' | 'b'] extends ['a'] 为 false，此时返回 true
// step3: 对于 'b': [K] extends [T] -> ['a' | 'b'] extends ['b'] 为 false，此时返回 true
// step4: true | true = true
type Case1 = IsUnion<'a' | 'b'>;

// step1: T extends any, 不触发分发特性
// step2: [K] extends [T] -> ['a'] extends ['a']，成立，返回 false
// Case2 = false
type Case2 = IsUnion<'a'>;
```

但是上例中，还是缺失了一些特殊的场景，比如 never。

```ts
// step1: T extends any ? 返回 never
// Case3 = never
type Case3 = IsUnion<never>;
```

故最终的解决方案中需要排除掉 never。

## 题解

```ts
type IsUnion<T, K = T> =
  // 是 never ，那么返回 false
  [T] extends [never]
    ? false
    : // 触发分发特性
    T extends any
    ? // 比较原始类型和分发后的类型，如果一致，证明不是联合类型，否则就是联合类型
      // [] 是为了消除联合类型的分发特性
      [K] extends [T]
      ? false
      : true
    : false;
```

## 知识点

1. 联合类型的分发特性，同 [Exclude](/easy/43-实现Exclude.md)。
2. never 的判断
