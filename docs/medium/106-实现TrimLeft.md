---
title: 106-实现TrimLeft
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

实现 `TrimLeft<T>` ，它接收确定的字符串类型并返回一个新的字符串，其中新返回的字符串删除了原字符串开头的空白字符串。

例如

```ts
type trimed = TrimLeft<'  Hello World  '> // 应推导出 'Hello World  '
```

## 分析

这一题和之前的题目基本都不搭噶了，因为操作的对象是字符串类型。不过字符串类型的操作和元组非常类似：

在元组中，可以通过 infer 来遍历：

```ts
type TraverseTuple<T extends any[]> = T extends [infer F, ...infer R] ? [F, ...TraverseTuple<R>] : [];
```

类似的，字符也可以(关于这个操作，没有在官网上找到类似的，如果有找到的，可以微信联系我哈)：

```ts
type TraverseString<T extends string> = T extends `${infer F}${infer R}` ? `${F}${TraverseString<R>}` : '';
```

两者除了写法上的不同，还有一处就是元组中，可以`通过扩展操作符声明剩余元素放在哪个推断中`，而字符则没有，只能是在最后一个使用 infer 推断的类型。

也就是，元组可以通过 `T extends [...infer F, infer R]` 来使得 R 是最后一个元素，而字符 ```T extends `${infer F}${infer R}```` 则 F 始终是一个字符，R 表示剩余字符。

同时两者也具备相同的特性，在上例中，如果元素数量为1，那么能够走 true 的逻辑，如果为0，则无法推断，会走 false 逻辑，这一边界条件在后续的题目中也会经常需要考虑进去。

好了，回归本题目，要删除左侧的空白字符，那么只需要遍历字符，遇到空白，继续遍历，遇到非空白，直接返回当前字符即可。


## 题解

```ts
// ${' ' | '\n' | '\t'} 占据一个字符，R 匹配剩余的字符，如果能够匹配，证明第一个字符就是空白字符，此时需要继续处理剩余字符 R，否则返回当前字符 S
type TrimLeft<S extends string> = S extends `${' ' | '\n' | '\t'}${infer R}` ? TrimLeft<R> : S;
```

## 知识点

1. 字符遍历：``` T` extends `${F}${R}` ```