---
title: 5-GetReadOnlyKeys
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

实现泛型`GetReadonlyKeys<T>`，`GetReadonlyKeys<T>`返回由对象 T 所有只读属性的键组成的联合类型。

例如

```ts
interface Todo {
  readonly title: string
  readonly description: string
  completed: boolean
}

type Keys = GetReadonlyKeys<Todo> // expected to be "title" | "description"
```

## 分析

这道题目和 [5181-mutablekeys](/hard/5181-mutablekeys.md) 刚好是相反的逻辑，本质还是通过 `Equal` 去判断每个属性构成的对象和是否和去除了只读修饰符构成的对象是否相等，来判断原属性是否是只读，从而进行过滤。

## 题解

```ts
type GetReadonlyKeys<T> = keyof {
  [P in keyof T as
      Equal<
        { [K in P]: T[P] },
        {-readonly [K in P]: T[P]}
      > extends true
      ? never
      : P
  ]: T[P]
}
```

## 知识点

老套路了，这还算是地狱？