---
title: 35991-MyUppercase
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

不使用内置的 `Uppercase`，手动实现"将字符串所有字母转为大写"。

```ts
type R1 = MyUppercase<'hello'>; // 'HELLO'
type R2 = MyUppercase<'abc123'>; // 'ABC123'
type R3 = MyUppercase<'Hello World'>; // 'HELLO WORLD'
type R4 = MyUppercase<''>; // ''
```

## 分析

两步：

1. 准备字母大小写映射表（a→A、b→B、...、z→Z）；
2. 对字符串逐字符检查：若当前字符是小写字母，换成对应的大写字母；否则保留原字符。

映射表用对象字面量最方便：

```ts
type Map = {
  a: 'A';
  b: 'B';
  ...
  z: 'Z';
};
```

## 题解

```ts
type UpperMap = {
  a: 'A';
  b: 'B';
  c: 'C';
  d: 'D';
  e: 'E';
  f: 'F';
  g: 'G';
  h: 'H';
  i: 'I';
  j: 'J';
  k: 'K';
  l: 'L';
  m: 'M';
  n: 'N';
  o: 'O';
  p: 'P';
  q: 'Q';
  r: 'R';
  s: 'S';
  t: 'T';
  u: 'U';
  v: 'V';
  w: 'W';
  x: 'X';
  y: 'Y';
  z: 'Z';
};

type MyUppercase<S extends string> = S extends `${infer F}${infer R}`
  ? `${F extends keyof UpperMap ? UpperMap[F] : F}${MyUppercase<R>}`
  : '';
```

解读：

- 用 `${infer F}${infer R}` 把首字符和余下切开。
- 首字符若是 `UpperMap` 的 key（即小写字母），索引出对应大写；否则原样保留。
- 尾部 `MyUppercase<R>` 递归。

## 验证

```ts
type R1 = MyUppercase<'hello'>; // 'HELLO'
type R2 = MyUppercase<'abc123'>; // 'ABC123'
type R3 = MyUppercase<'Hello World'>; // 'HELLO WORLD'
type R4 = MyUppercase<''>; // ''
type R5 = MyUppercase<'TypeScript'>; // 'TYPESCRIPT'
```

## 知识点

- 字符串逐字符递归 + 对象字面量充当映射表，是实现"字符级映射"类题的通用套路（类似 [hard/114-CamelCase](/hard/114-CamelCase.md)、[hard/19458-Snakecase](/hard/19458-Snakecase.md) 的小写/大写判断依赖）。
- `F extends keyof Map` 是类型层"查表"的标准写法。
