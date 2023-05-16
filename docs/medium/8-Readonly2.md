---
title: 8-Readonly2
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

实现一个通用`MyReadonly2<T, K>`，它带有两种类型的参数`T`和`K`。

`K`指定应设置为 Readonly 的`T`的属性集。如果未提供`K`，则应使所有属性都变为只读，就像普通的`Readonly<T>`一样。

例如

```ts
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

const todo: MyReadonly2<Todo, 'title' | 'description'> = {
  title: 'Hey',
  description: 'foobar',
  completed: false,
};

todo.title = 'Hello'; // Error: cannot reassign a readonly property
todo.description = 'barFoo'; // Error: cannot reassign a readonly property
todo.completed = true; // OK
```

## 分析

这个题目是 [readonly](/easy/7-实现Readonly.md) 的升级版，仅仅对一部分的属性增加 `readonly` 的修饰符。

对所有属性增加 `readonly` 修饰符只需要遍历一次即可：

```ts
type MyReadonly<T> = {
  readonly [P in keyof T]: T[P];
};
```

但是这个修饰符不能直接指定某些属性增加，某些属性不增加，就导致本题通过一次遍历做出。

只能做到：对于需要增加的属性，遍历一次，增加 `readonly` 修饰符，对于不需要增加的属性，遍历一次，然后将两次遍历生成的类型进行交叉即可生成目标类型。

关于交叉，可以看官方的文档：[Intersection Types ](https://www.typescriptlang.org/docs/handbook/2/objects.html#intersection-types)

## 题解

```ts
type MyReadonly2<T, K extends keyof T = keyof T> = {
  readonly [P in K]: T[P];
} & {
  [P in keyof T as P extends K ? never : P]: T[P];
};
```

这个题解可以分成两部分看，第一部分是对指定的类型增加 `readonly` 修饰符，第二部分是从 `T` 的属性中排除存在于 `K` 中的属性后组成的类型，两者交叉，就是本题的结果。

相信大家也看出来了，后者其实就是上一题实现的 [Omit](/medium/3-实现Omit.md)，直接换成 `Omit<T, K>` 也是成立的。

这里还有一点要提的就是，题目中在 `K` 不存在的时候需要将所有的属性都增加 `readonly` 修饰符，所以题解中写了 `K extends keyof T = keyof T`，功能就是缺省值，当 `K` 不存在时，就是 `keyof T`。

## 知识点

1. 对象遍历增加修饰符
2. 缺省值设置
3. [Omit](/medium/3-实现Omit.md)
