---
title: 4803-TrimRight
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

实现 `TrimRight<T>` ，它接收确定的字符串类型并返回一个新的字符串，其中新返回的字符串删除了原字符串结尾的空白字符串。

例如

```ts
type Trimed = TrimRight<'  Hello World  '> // 应推导出 '  Hello World'
```

## 分析

做了前面那些题，这题可以说是非常简单了。可以参考 [106-TrimLeft](/docs/medium/106-%E5%AE%9E%E7%8E%B0TrimLeft.md)、[108-实现 Trim](/docs/medium/108-%E5%AE%9E%E7%8E%B0Trim.md)，不赘述。

## 题解

```ts
type TrimRight<T extends string> = T extends `${infer S}${' ' | '\n' | '\t'}` ? TrimRight<S> : T;
```

## 知识点

1. 字符遍历套路