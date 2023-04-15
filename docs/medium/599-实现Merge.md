---
title: 599-实现Merge
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

将两个类型合并成一个类型，第二个类型的键会覆盖第一个类型的键。

例如:

```ts
type foo = {
  name: string;
  age: string;
}

type coo = {
  age: number;
  sex: string
}

type Result = Merge<foo,coo>; // expected to be {name: string, age: number, sex: string}
```

## 分析

这个题如果不要求后者同名属性覆盖前者的话，直接交叉即可解决问题。

但是由于需要考虑到后者覆盖前者，此时交叉不可行。

故只能在新类型中，对于前者，拷贝属性时，不能携带存在于后者属性中的属性即可。可以写出如下代码：

```ts
type Merge<T, S> = {
    [P in Exclude<keyof T, keyof S>]: T[P]
} & S
```

这是一种思路，不借助 Exclude 本身也能实现，就是借助 [实现Omit](/docs/medium/3-%E5%AE%9E%E7%8E%B0Omit.md) 来完成，代码如下：

```ts
type Merge<T, S> = {
    [P in keyof T as P extends keyof S ? never : P]: T[P]
} & S
```

还有没有其他思路？其实也有，就是不借助交叉，直接遍历 `keyof T | keyof S`，然后在取值的时候先取后者的类型即可。可以直接看题解。

## 题解

```ts
type Merge<F, S> = {
  // step1: 遍历所有的 key
  [P in keyof F | keyof S]:
    // 如果是后者的键值
    P extends keyof S
    // 取后者的类型，这里保证了后者覆盖前者
    ? S[P]
    // 如果是前者的属性
    : P extends keyof F
        // 返回前者的类型
        ? F[P]
        // 不会走到这一流程
        : never;
}
```

## 知识点

1. 同 [实现Omit](/docs/medium/3-%E5%AE%9E%E7%8E%B0Omit.md)。

