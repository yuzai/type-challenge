---
title: 9160-Assign
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

You have a target object and a source array of objects. You need to copy property from source to target, if it has the same property as the source, you should always keep the source property, and drop the target property. (Inspired by the `Object.assign` API)

### example

```ts
type Target = {
  a: 'a'
}

type Origin1 = {
  b: 'b'
}

// type Result = Assign<Target, [Origin1]>
type Result = {
  a: 'a'
  b: 'b'
}
```


```ts
type Target = {
  a: 'a'
  d: { 
    hi: 'hi'
  }
}

type Origin1 = {
  a: 'a1',
  b: 'b'
}


type Origin2 = {
  b: 'b2',
  c: 'c'
}

type Answer = {
   a: 'a1',
   b: 'b2',
   c: 'c'
   d: { 
      hi: 'hi'
  }
}
```

## 分析

题目预期是对原类型进行增加属性或覆盖同名属性，如果入参只有一个的话，其实就是 [599-实现Merge](/medium/599-实现Merge.md)。

但是题目是个元组，需要再遍历递归一次。本身并不麻烦，可以直接看题解

## 题解

```ts
// [599-实现Merge](/medium/599-实现Merge.md)
type Merge<A, B> = {
  [P in keyof A | keyof B]:
    P extends keyof B
    ? B[P]
    : P extends keyof A
    ? A[P] : never;
}

type Assign<T extends Record<string, unknown>, U> =
  U extends [infer F, ...infer L]
  // 为了提出 元组中的普通元素
  ? F extends Record<string, any>
    // merge 后递归处理剩余元素
    ? Assign<Merge<T, F>, L>
    : Assign<T, L> 
  : T;
```

## 知识点

1. 同 [599-实现Merge](/medium/599-实现Merge.md)