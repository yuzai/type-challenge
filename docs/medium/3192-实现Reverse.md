---
title: 3192-实现Reverse
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

实现类型版本的数组反转 `Array.reverse`

例如：

```typescript
type a = Reverse<['a', 'b']>; // ['b', 'a']
type b = Reverse<['a', 'b', 'c']>; // ['c', 'b', 'a']
```

## 分析

也是常规套路，递归遍历元组，在生成返回值的时候修改顺序即可。只是思维上稍微切换下，匹配最后一个元素，然后把最后一个元素放在第一个，递归解决剩余元素即可。

## 题解

```ts
type Reverse<T extends any[]> = T extends [...infer F, infer R]
  ? [R, ...Reverse<F>]
  : [];
```

## 知识点

1. 递归遍历元组，老套路了。
2. 通过扩展操作符修改剩余元素的匹配位置
