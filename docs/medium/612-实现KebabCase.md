---
title: 612-实现KebabCase
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

实现一个类型，把驼峰命名转换为短斜杠命名，示例如下：

```ts
type FooBarBaz = KebabCase<"FooBarBaz">;
const foobarbaz: FooBarBaz = "foo-bar-baz";

type DoNothing = KebabCase<"do-nothing">;
const doNothing: DoNothing = "do-nothing";
```

## 分析

这个题目本质上还是遍历字符，碰到大写字母，将其转换为短斜杠加小写即可。但是这里的问题是，对于第一个字符不好处理。

按照这种思路，需要增加一个参数标记是否是第一个字母，可以写出如下代码：

```ts
// isFirst 默认是 true,标记第一个字符
type KebabCase<S extends string, isFirst extends boolean = true> =
  // 匹配推断提取第一个字符 F 和剩余字符 R
  S extends `${infer F}${infer R}`
  // 如果是第一个字符
  ? isFirst extends true
    // 那么直接转为小写，递归处理剩余字符
    ? `${Lowercase<F>}${KebabCase<R, false>}`
    // 不是第一个字符，判断是不是小写
    : F extends Lowercase<F>
      // 如果是小写，那么不做处理，递归拼接剩余字符
      ? `${F}${KebabCase<R, false>}`
      // 如果是大写，转换为小写并拼接 -，递归拼接剩余字符
      : `-${Lowercase<F>}${KebabCase<R, false>}`
  : ''
```

可以看出，上述解法相对麻烦一点，此时可以换一种思路，始终让第一个字符小写，判断后续的字符是否是大写字母开头的，如果是，那么就增加一个短斜杠连接。直接看题解：

## 题解

```ts
type KebabCase<S extends string> =
  S extends `${infer F}${infer R}`
  // 判断剩余字符的首字母是否大写
  ? R extends Uncapitalize<R>
    // 如果是小写，那么直接拼接递归处理后的剩余字符
    ? `${Lowercase<F>}${KebabCase<R>}`
    // 如果是大写，那么增加 - 拼接
    : `${Lowercase<F>}-${KebabCase<R>}`
  : '';
```

看起来不如解法一清晰，但是看起来简洁。核心思路就是：始终小写前一个字符，判断后续字符是否是大写开头的，如果是，那么增加 - 进行连接即可(首字母的小写会在下一次递归中处理掉)。

## 知识点

1. 字符遍历
2. 解题思路
