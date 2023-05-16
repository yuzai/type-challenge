---
title: 62-实现按类型查找
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

在此挑战中，我们想通过在联合类型`Cat | Dog`中搜索公共`type`字段来获取相应的类型。换句话说，在以下示例中，我们期望`LookUp<Dog | Cat, 'dog'>`获得`Dog`，`LookUp<Dog | Cat, 'cat'>`获得`Cat`。

```ts
interface Cat {
  type: 'cat';
  breeds: 'Abyssinian' | 'Shorthair' | 'Curl' | 'Bengal';
}

interface Dog {
  type: 'dog';
  breeds: 'Hound' | 'Brittany' | 'Bulldog' | 'Boxer';
  color: 'brown' | 'white' | 'black';
}

type MyDog = LookUp<Cat | Dog, 'dog'>; // expected to be `Dog`
```

## 分析

这一题也有点贴合实际工作了，借助联合类型的分发特性可以很轻易的实现(不了解分发类型的可以看这一题 [实现 Exclude](/easy/43-实现Exclude.md))。

## 题解

```ts
type LookUp<U, T> = U extends { type: T } ? U : never;

// 分发特性
// step1: Cat extends { type: 'dog' } ? Cat : never -> never
// step2: Dog extends { type: 'dog' } ? Dog : never -> Dog
// step3: never | Dog -> Dog
type MyDog = LookUp<Cat | Dog, 'dog'>;
```

## 知识点

1. 泛型下联合类型的分发特性，可以参考 [实现 Exclude](/easy/43-实现Exclude.md)
2. 条件表达式，可以参考官网 [Conditional Types ](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)
