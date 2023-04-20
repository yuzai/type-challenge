---
title: 114-CamelCase
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

实现 `CamelCase<T>` ，将 `snake_case` 类型的表示的字符串转换为 `camelCase` 的表示方式。

例如

```ts
type camelCase1 = CamelCase<"hello_world_with_types"> // 预期为 'helloWorldWithTypes'
type camelCase2 = CamelCase<"HELLO_WORLD_WITH_TYPES"> // 期望与前一个相同
```

## 分析

这题和上一题比较类似，也有多种思路，鉴于上一题只有思路三可以通过所有用例，本题也直接采取思路三：

遍历字符，增加辅助变量存储 `-` 之前的字符，当遇到 `-` 时，取出之前的字符，进行 `Capitalize<Lowercase<T>>` 即可得到题目要求的格式，继续递归剩余字符即可，值得注意的是，第一次必定是小写开头，可以在执行上述遍历后，再处理第一个字母即可。

## 题解

```ts
type CamelCaseF<
  S extends string,
  // 辅助字符，存储 _ 之前遇到的字符
  W extends string = ''
> =
  S extends `${infer F}${infer R}`
  // 如果是 _
  ? F extends '_'
    // 处理 _ 之前的的字符 W, 并递归剩余字符，重置 W
    ? `${Capitalize<Lowercase<`${W}`>>}${CamelCaseF<R>}`
    // 否则，递归剩余字符，将 F 存储 W 中
    : `${CamelCaseF<R, `${W}${F}`>}`
  // 遍历结束，取出最后一次的字符进行处理
  : Capitalize<Lowercase<`${W}`>>;

// 单独处理掉第一个字符的小写
type CamelCase<S extends string> = Uncapitalize<CamelCaseF<S>>;
```

## 知识点

1. 字符遍历
2. 字符相关工具类的使用
