---
title: 43-实现Exclude
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

实现内置的Exclude <T, U>类型，但不能直接使用它本身。

> 从联合类型T中排除U的类型成员，来构造一个新的类型。

例如：

```ts
type Result = MyExclude<'a' | 'b' | 'c', 'a'> // 'b' | 'c'
```

## 分析

这个题目可以说是非常基础的演示 ts 分发特性的题目了。

在 `A extends B ? true : false` 中，如果 `A` 是联合类型，那么就会触发 ts 的分发特性。

```ts
type Example<T> = T extends string ? T : boolean;
// 1 | '3' | {} | [] extends string 会触发分发特性，会转变成如下逻辑:
// 需要注意的是 T 在分发后，还是用 T 表示，但是此时的 T 仅仅表示的是联合类型中的那一项，而非整个联合类型
// 1 extends string ? 1 : boolean | '3' extends string ? '3' : boolean | {} extends string ? {} : boolean | [] extends string ? [] : boolean
// boolean | '3' | boolean | boolean
// Case1 = boolean | '3'
type Case1 = Example<1 | '3' | {} | []>;
```

要注意的是，只有泛型才会触发分发特性，也就是说，如下的简单类型的判断是不会触发分发特性的：

```ts
type Example<T> = T extends string ? 1 : 2;

// 简单类型，不会分发，结果为 2
type Case2 = ('1' | 1) extends string ? 1 : 2;

// 泛型，触发分发
// '1' extends string ? 1 : 2 | 1 extends string ? 1 : 2
// 1 | 2
// 结果为 1 | 2
type Case3 = Example<'1' | 1>;
```

了解了分发特性后，这题的结果就呼之欲出了，但是在此之前，还有一个特性需要了解，那就是 **任意类型 | never = 任意类型**。

## 题解

解法如下：

```ts
type MyExclude<T, U> = T extends U ? never : T;

// 触发分发特性
// 'a' extends 'a' ? never : 'a' | 'b' extends 'a' ? never : 'b' | 'c' extends 'a' ? never : 'c'
// never | 'b' | 'c'
// Case = 'b' | 'c';
type Case = MyExclude<'a' | 'b' | 'c', 'a'>
```

## 知识点
1. 泛型下联合的分发特性
2. `任意类型 | never = 任意类型`