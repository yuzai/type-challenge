---
title: 2688-实现StartWith
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述


实现`StartsWith<T, U>`,接收两个string类型参数,然后判断`T`是否以`U`开头,根据结果返回`true`或`false`

例如:

```typescript
type a = StartsWith<'abc', 'ac'> // expected to be false
type b = StartsWith<'abc', 'ab'> // expected to be true
type c = StartsWith<'abc', 'abcd'> // expected to be false
```

## 分析

判断是否以某个字符开头，其实之前有类似的用法，[实现 Replace](/docs/medium/116-%E5%AE%9E%E7%8E%B0Replace.md) 中，有 ```A extends `${From}${infer M}` ``` 的用法，在这一用法中，From 就是个常量字符，举几个例子：

```ts
// Case1 = true
type Case1 = '123' extends `1${infer M}` ? true : false;

// Case2 = false
type Case2 = '123' extends `${infer M}2` ? true : false;
```

这种常量就是一个占位（可以不止一个字符），而 infer M 则承接剩余的字符，可以为空字符。所以本题的解法其实非常简单

## 题解

```ts
type StartsWith<T extends string, U extends string> = T extends `${U}${infer R}` ? true : false;
```

## 知识点

1. 字符串匹配常量，```A extends `111${infer M}` ```