---
title: 189-实现Awaited
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

假如我们有一个 Promise 对象，这个 Promise 对象会返回一个类型。在 TS 中，我们用 `Promise<T>` 中的 T 来描述这个 Promise 返回的类型。请你实现一个类型，可以获取这个类型。

例如：`Promise<ExampleType>`，请你返回 ExampleType 类型。

```ts
type ExampleType = Promise<string>;

type Result = MyAwaited<ExampleType>; // string
```

> 这个挑战来自于 [@maciejsikora](https://github.com/maciejsikora) 的文章：[original article](https://dev.to/macsikora/advanced-typescript-exercises-question-1-45k4)

## 分析

这个题目同 [第一个元素](/easy/14-第一个元素.md) 一样，都需要用到 `A extends infer xxx` 的特性，只不过原本的 `infer` 是匹配数组，而这里的 `infer`，是去匹配 `Promise` 的返回值。

了解这一点后，可以非常快速的写出如下代码：

```ts
type MyAwaited<T> = T extends Promise<infer R> ? R : never;

type Case1 = MyAwaited<Promise<string>>; // string
```

但是实际的场景中，还会存在 `Promise` 嵌套的场景:

```ts
type MyAwaited<T> = T extends Promise<infer R> ? R : never;

type Case2 = MyAwaited<Promise<Promise<string>>>; // Promise<string>
```

此时由于嵌套，并不能得到预期的最终的返回类型。

此时就需要递归上场了，简单改写，如下：

```ts
type MyAwaited<T> = T extends Promise<infer R> ? MyAwaited<R> : T;

type Case2 = MyAwaited<Promise<Promise<string>>>; // string
type Case3 = MyAwaited<Promise<Promise<Promise<string>>>>; // string
```

此时不管嵌套几层，都可以解出最终的类型。(由于牵扯到了递归，个人认为不太适合放在简单里)。

## 题解

讲道理上述解法已经足够，但是在题目的 Case 中，存在如下场景：

```ts
type T = { then: (onfulfilled: (arg: number) => any) => any };

// 期望 MyAwaited<T> = number
```

也就是还需要处理 类似 promise 的场景，根据题目 case，可以写出如下代码：

```ts
type MyAwaited<T> = T extends
  | Promise<infer R>
  | { then: (onfullfilled: (arg: infer R) => any) => any }
  ? MyAwaited<R>
  : T;
```

利用 `|` 覆盖 普通的 `Promise` 和 `then` 两种场景。

这里还有一点值得一提的是，当联合类型位于 `extends` 右侧时，并没有分发特性，虽然判断会做多次，但是其多次判断的结果会以或的方式合并后交由 `extends` 的逻辑处理，比如，`'a' extends 'a' | 'b' ? 1 : 2`，此时，可以理解为会进行 `'a' extends 'a'` 以及 `'a' extends 'b'`两次判断，两者有一处为 true 即返回 1，否则返回 2。但是并不会返回 `1 | 2`。

## 知识点

1. `A extends Promise<infer R>`，匹配推断类型
2. 递归解决嵌套问题
3. 联合类型位于 `extends` 右侧时不分发
