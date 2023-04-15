---
title: 3188-元组转nested对象
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

Given a tuple type ```T``` that only contains string type, and a type ```U```, build an object recursively.

```typescript
type a = TupleToNestedObject<['a'], string> // {a: string}
type b = TupleToNestedObject<['a', 'b'], number> // {a: {b: number}}
type c = TupleToNestedObject<[], boolean> // boolean. if the tuple is empty, just return the U type
```

## 分析

之前做过 [元组转对象](/docs/easy/11-%E5%85%83%E7%BB%84%E8%BD%AC%E6%8D%A2%E4%B8%BA%E5%AF%B9%E8%B1%A1.md)，还是 easy 级别的，本质就是借助了元组的索引签名将元组转为联合类型作为属性形成新的类型。

这一题有点变种，是折叠进去的，所以并不能通过元组转成的联合类型来做属性。

之前提到过元组的遍历的套路： `A extends [infer F, ...infer R]`，本题也是如此，不断遍历元组，以第一个元素作为属性，直到元组遍历结束为止，而属性值就是第二个入参。

## 题解

```ts
type TupleToNestedObject<T, U> =
  // 遍历匹配第一个元素，此处要注意限制 F 的类型，因为 P in F 要求 F 的类型必须是 PropertyKey = string | number | symbol
  T extends [infer F extends PropertyKey, ...infer R]
  ? {
    // 用第一个元素作为属性名，递归处理剩余元素
    [P in F]: TupleToNestedObject<R, U>;
  }
  // 如果没有了，就把 U 作为类型返回，从而形成迭代后的 nested object
  : U;
```


## 知识点

1. 元组的遍历的套路： `A extends [infer F, ...infer R]`
2. P in F, F 的类型必须为 PropertyKey

