---
title: 17973-DeepMutatable
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

实现一个通用的 `DeepMutable<T>` ，它使对象的每个属性，及其递归的子属性 - 可变。

例如：

```ts
type X = {
  readonly a: () => 1
  readonly b: string
  readonly c: {
    readonly d: boolean
    readonly e: {
      readonly g: {
        readonly h: {
          readonly i: true
          readonly j: "s"
        }
        readonly k: "hello"
      }
    }
  }
}

type Expected = {
  a: () => 1
  b: string
  c: {
    d: boolean
    e: {
      g: {
        h: {
          i: true
          j: "s"
        }
        k: "hello"
      }
    }
  }
}

type Todo = DeepMutable<X> // should be same as `Expected`
```

你可以假设我们在这个挑战中只处理对象。 数组、函数、类等不需要考虑。 但是，您仍然可以通过涵盖尽可能多的不同案例来挑战自己。

## 分析

这一题其实和 [DeepReadonly](/medium/9-%E5%AE%9E%E7%8E%B0DeepReadonly.md) 一样，只不过这次是去除 readonly 修饰符，不再赘述

## 题解

```ts
type DeepMutable<T extends Record<string, any>> = {
  -readonly [P in keyof T]:
    // 函数特殊处理
    T[P] extends Function
    ? T[P]
    // 类对象类型，递归处理
    : T[P] extends {}
      ? DeepMutable<T[P]>
      : T[P]
};
```

## 知识点

1. 同 [DeepReadonly](/medium/9-%E5%AE%9E%E7%8E%B0DeepReadonly.md)