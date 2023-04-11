---
title: 4-实现Pick
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

实现 TS 内置的 `Pick<T, K>`，但不可以使用它。

**从类型 `T` 中选择出属性 `K`，构造成一个新的类型**。

例如：

```ts
interface Todo {
  title: string
  description: string
  completed: boolean
}

type TodoPreview = MyPick<Todo, 'title' | 'completed'>

const todo: TodoPreview = {
    title: 'Clean room',
    completed: false,
}
```

## 分析

这是 ts 体操入门的第一道题，也可以说是最基础入门的一道题，其考察的本质在于遍历泛型并产生一个新的类型，涉及到的知识点在官方的 handbook 也有提及，可以查看 [mapped-types](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html) 一节。

核心就在于对 对象类型 的遍历并修改，对 对象类型的遍历方法如下：

```ts
type Copy<T> = {
    [P in keyof T]: T[P]
}

type Case1 = Copy<{ a: string, b: string }>
```

`keyof T` 本身是个联合类型，`[P in keyof T]` 便是将联合类型取出作为新类型的键值， 在上例中，流程如下：

```ts
// step1: keyof T: 'a' | 'b'
// ['a']: T['a'] (也就是 string)
// ['b']: T['b'] (也就是 string)
// type Case1 = { a: string, b: string }
type Case1 = Copy<{ a: 1, b: 2 }>
```

## 题解

理解了上述遍历的行为后，实现 `Pick` 就非常简单了，只需要把 `keyof T` 这个联合类型换成入参的 `K` 即可：

```ts
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P]
}

// P in 'a' | 'b'
// ['a']: T['a']
// ['b']: T['b']
// type Case2 = { a: string, b: string }
type Case2 = MyPick<{a: string, b: string, c: string}, 'a' | 'b'>
```

注意：上述需要对 `K` 进行约束，也就是 `K extends keyof T`，因为 K 如果不是类型的键值的话，需要进行类型约束，否则 T[P] 将会因为访问不到类型而报错。

知识点在于：

1. `[P in keyof T]: T[P]` 遍历 对象类型/数组类型
2. `[P in K]: T[P]` ，根据传入的 K 进行遍历，此时 K 需要满足 `K extends keyof T`
