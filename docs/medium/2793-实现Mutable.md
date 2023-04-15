---
title: 2793-实现Mutable
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

实现一个通用的类型 ```Mutable<T>```，使类型 `T` 的全部属性可变（非只读）。

例如：

```typescript
interface Todo {
  readonly title: string
  readonly description: string
  readonly completed: boolean
}

type MutableTodo = Mutable<Todo> // { title: string; description: string; completed: boolean; }

```

## 分析

其实和前几个题目都类似，只是这次是去除只读属性，而且还不存在指定 keys 的只读属性去除，可谓是非常简单了，放到 easy 级别都 ok。可以尝试下 mutuableByKeys, deepMutable，这里就不赘述了。

## 题解

```ts
type Mutable<T extends Record<string, any>> = {
  -readonly [P in keyof T]: T[P]
}
```

## 知识点

1. 修饰符操作。
2. 同 [实现Readonly](/docs/easy/7-%E5%AE%9E%E7%8E%B0Readonly.md)