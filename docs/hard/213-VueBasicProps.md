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

而注入 this 的方法，在 [6-SimpleVue](/hard/6-SimpleVue.md) 中已经讲过，那么这题的核心，就转换成了，如何把 `foo: { type: [BooleanConstructor, NumberConstructor, StringConstructor] }` 转换成 `foo: boolean | number | string`。

等等，为什么是 `BooleanConstructor` 而不是 boolean 或者 Boolean？

这里就涉及到函数中的隐式类型推断了，TODO:隐式类型推断。

由于题目中，props的类型是根据入参隐式推断出来的。js 中的 String，会被推断为 StringConstructor，这一点，好好理解下 js 中的 String 中的功能相比不难理解。

那么如果从 StringConstructor 得到 string？

```ts
type Cons<T> = T extends () => infer R ? R : never;

// string
type Case1 = Cons<StringConstructor>;
```

其本质，可以查看下 StringConstructor 的定义：

```ts
interface StringConstructor {
    new(value?: any): String;
    (value?: any): string;
    readonly prototype: String;
    fromCharCode(...codes: number[]): string;
}
```

借助第二个特性，就可以匹配出来。

掌握了这一点，这一题就不在话下了，可以先实现一个转换 props 的类型：

```ts
type ClassToType<C> = 
  // 匹配 StringConstructor, NumberConstructor, BooleanConstructor etc.
  C extends () => infer T
    ? T
    : C extends unknown[]
      // 元组，递归每一个元素
      // 此处借助了 C[number] 利用联合类型的分发特性遍历每一个元素 
      ? ClassToType<C[number]>
      // 匹配用户自己定义的     propD: { type: ClassA }，这样的要求
      : C extends new (...args: any) => any // user defined constructors 
        ? InstanceType<C>
        // 不应该出现其他情况
        : never

type ComputedProps<P> = {
  // 遍历 props 的属性
  [key in keyof P]:
    // 匹配 type: xxx 的情况
    P[key] extends { type: infer T }
    ? ClassToType<T>
    : {} extends P[key]
      // 如果是 {}，对应 propA 的情况
      ? any
      // 处理 propF: RegExp 的情况
      : ClassToType<P[key]>
}

type d = ComputedProps<{
  propA: {},
  propB: { type: String },
  propC: { type: Boolean },
  propD: { type: ClassA },
  propE: { type: [String, Number] },
  propF: RegExp,
}>
```

## 题解

完整题解如下：

```ts
type ComputedValues<C> = {
  [key in keyof C]: C[key] extends (...args: unknown[]) => infer R ? R : never
}

type ClassToType<C> = 
  C extends () => infer T // String/Number/Boolean
    ? T
    : C extends unknown[] 
      ? ClassToType<C[number]>
      : C extends new (...args: any) => any // user defined constructors 
        ? InstanceType<C>
        : never

type ComputedProps<P> = {
  [key in keyof P]: P[key] extends { type: infer T }
    ? ClassToType<T>
    : {} extends P[key]
      ? any
      : ClassToType<P[key]>
}

declare function VueBasicProps<P, D, C, M>(options: {
  props: P,
  // 注入 props 的声明
  data: (this: ComputedProps<P>) => D,
  computed: C & ThisType<D & ComputedProps<P>>,
  methods: M & ThisType<D & M & ComputedValues<C> & ComputedProps<P>>
}): any
```

## 知识点

1. 隐式类型推断, String -> StringConstructor
2. 同 [6-SimpleVue](/hard/6-SimpleVue.md)
