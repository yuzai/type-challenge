---
title: 529-实现Absolute
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

实现一个接收string,number或bigInt类型参数的`Absolute`类型,返回一个正数字符串。

例如

```ts
type Test = -100;
type Result = Absolute<Test>; // expected to be "100"
```

## 分析

这个题本质也是字符的推断匹配，但是由于入参是 number 类型的，所以在进行推断匹配前需要进行一次转化，对于 ts 来讲，也非常简单：

```ts
type NumberToString<T extends number> = `${T}`;

// Case1 = '100'
type Case1 = NumberToString<100>;
```

转换成字符后，可以直接进行 `-` 号的匹配，有 `-` 号，就只保留剩余的字符，否则全部保留即可。

## 题解

```ts
type Absolute<T extends number | string | bigint> =
    `${T}` extends `-${infer S}`
    // 有 - 号，保留剩余的字符
    ? `${S}`
    // 否则保留原字符即可
    : `${T}`;
```

## 知识点

1. number 转 string
2. 字符推断匹配套路： ```A extends `-${infer R}` ```

