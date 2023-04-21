---
title: 213-VueBasicProps
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

**This challenge continues from [6 - Simple Vue](//tsch.js.org/6), you should finish that one first, and modify your code based on it to start this challenge**.

In addition to the Simple Vue, we are now having a new `props` field in the options. This is a simplified version of Vue's `props` option. Here are some of the rules.

`props` is an object containing each field as the key of the real props injected into `this`. The injected props will be accessible in all the context including `data`, `computed`, and `methods`.

A prop will be defined either by a constructor or an object with a `type` field containing constructor(s).

For example

```js
props: {
  foo: Boolean
}
// or
props: {
  foo: { type: Boolean }
}
```

should be inferred to `type Props = { foo: boolean }`.

When passing multiple constructors, the type should be inferred to a union.

```ts
props: {
  foo: { type: [Boolean, Number, String] }
}
// -->
type Props = { foo: boolean | number | string }
```

When an empty object is passed, the key should be inferred to `any`.

For more specified cases, check out the Test Cases section.

> `required`, `default`, and array props in Vue are not considered in this challenge.


## 分析

这题目比较长，而且依赖了 [6-SimpleVue](/hard/6-SimpleVue.md)。

对于不了解 vue 的，我理了下题目要求：

除了 data, methods, computed 的定义，增加了 props 的类型定义，需要在 data, methods, computed 中，通过 this 访问到这个 props 定义的类型。

比如:

```ts
props: {
  foo: { type: [Boolean, Number, String] }
}

那么在 data、methods、computed 中， `this.props.foo` 就可以访问到，并且类型是 `boolean | number | string`
```

而注入 this 的方法，在 [6-SimpleVue](/hard/6-SimpleVue.md) 中已经讲过，那么这题的核心，就转换成了，如何把 `foo: { type: [Boolean, Number, String] }` 转换成 `foo: boolean | number | string`。

元组转联合非常简单，但是 Boolean -> boolean, Number -> number，就又涉及到新的知识点了：

## 题解

## 知识点
