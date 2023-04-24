---
title: 2828-ClassPublicKeys
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

Implement the generic `ClassPublicKeys<T>` which returns all public keys of a class.

For example:

```ts
class A {
  public str: string
  protected num: number
  private bool: boolean
  getNum() {
    return Math.random()
  }
}

type publicKyes = ClassPublicKeys<A> // 'str' | 'getNum'
```

## 分析

这题其实一开始我是没有思路的，但是其实答案真的很简单，`keyof T` 就是公共属性的 key。

这里还是可以看看 class 和 typeof class 的区别：

在 ts 里面，当你写了一个 classA，就定义了两种类型：

1. A 就表示 class A 的一个实例的类型
2. typeof A 表示了 class 对象。

因为 class 的实例就是个对象，所以直接 keyof A ，就是返回 public 属性。

## 题解

```ts
type ClassPublicKeys<T> = keyof T;
```

## 知识点

1. keyof 