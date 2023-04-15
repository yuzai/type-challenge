---
title: 116-实现Replace
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

实现 `Replace<S, From, To>` 将字符串 `S` 中的第一个子字符串 `From` 替换为 `To` 。

例如

```ts
type replaced = Replace<'types are fun!', 'fun', 'awesome'> // 期望是 'types are awesome!'
```

## 分析

这个题目也是通过匹配推断即可实现，只需要匹配出 `${infer F}${From}${infer R}`，就返回 `${F}${To}${R}`，否则返回原字符即可。

值得一提的是，像这样的匹配，只会匹配 `From` 出现的第一次，刚好和题目要求吻合，如果需要连续替换，那么可以通过递归嵌套处理剩余字符 `R` 即可。

这里需要注意的就是边界条件，当 `From` 为 空字符串时，此时匹配会始终成立，故需要对该情况做特殊处理。

## 题解

```ts
type Replace<S extends string, From extends string, To extends string> = 
  // 如果 from 是 ''，那么直接返回原字符
  From extends '' ? S :
  S extends `${infer F}${From}${infer R}`
  ? `${F}${To}${R}`
  : S
```

只需要注意边界即可。

## 知识点

1. 字符匹配推断：```A extends `${infer F}${From}${infer R}` ```

