---
title: 847-StringJoin
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

Create a type-safe string join utility which can be used like so:

```ts
const hyphenJoiner = join('-');
const result = hyphenJoiner('a', 'b', 'c'); // = 'a-b-c'
```

Or alternatively:

```ts
join('#')('a', 'b', 'c'); // = 'a#b#c'
```

When we pass an empty delimiter (i.e '') to join, we should concat the strings as they are, i.e:

```ts
join('')('a', 'b', 'c'); // = 'abc'
```

When only one item is passed, we should get back the original item (without any delimiter added):

```ts
join('-')('a'); // = 'a'
```

## 分析

这个题目中，把字符串拼接起来的部分，在 hard 题里面算是非常简单的了。

只需要遍历一次元组，在最后一个元素时，不拼接分割符即可。

```ts
type Join<S extends string, P extends string[]> = P extends [
  infer F extends string,
  ...infer R extends string[],
]
  ? // 判断是否是最后一个元素
    R extends []
    ? // 是最后一个元组，那么返回 F 即可
      F
    : // 否则，拼接分割符后递归
      `${F}${S}${Join<S, R>}`
  : '';
```

这题稍微绕一点的地方在于，join 本身是个函数，分割符和待组合的字符是以入参的形式进行推断的，所以写法上需要稍微注意点即可。

## 题解

```ts
type Join<S extends string, P extends string[]> = P extends [
  infer F extends string,
  ...infer R extends string[],
]
  ? R extends []
    ? F
    : `${F}${S}${Join<S, R>}`
  : '';

// 要注意 S 和 P 的位置，这里很容易把 P 和 S 写在一起
// 那么就无法根据第二个函数的入参来推断 P 了。
declare function join<S extends string>(
  delimiter: S,
): <P extends string[]>(...parts: P) => Join<S, P>;
```

## 知识点

1. 元组遍历，字符重组
