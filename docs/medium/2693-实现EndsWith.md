---
title: 2693-实现EndsWith
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

实现`EndsWith<T, U>`,接收两个string类型参数,然后判断`T`是否以`U`结尾,根据结果返回`true`或`false`

例如:

```typescript
type a = EndsWith<'abc', 'bc'> // expected to be true
type b = EndsWith<'abc', 'abc'> // expected to be true
type c = EndsWith<'abc', 'd'> // expected to be false
```

## 分析

参考上一题目 [startWith](/medium/2688-实现StartWith.md)。

## 题解

```ts
type EndsWith<T extends string, U extends string> = T extends `${infer F}${U}` ? true : false;
```

## 知识点

1. 字符串匹配常量，```A extends `${infer M}111` ```，通过改变占位的位置即可实现多种多样的匹配