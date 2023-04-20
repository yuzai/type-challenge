
---
title: 270-get
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

Convert a string literal to a number, which behaves like `Number.parseInt`.

## 分析

题目本身描述不算清楚，可以看下用例:

```ts
type cases = [
  Expect<Equal<ToNumber<'0'>, 0>>,
  Expect<Equal<ToNumber<'5'>, 5>>,
  Expect<Equal<ToNumber<'12'>, 12>>,
  Expect<Equal<ToNumber<'27'>, 27>>,
  Expect<Equal<ToNumber<'18@7_$%'>, never>>,
]
```

也就是对于合法的数字，返回数字，不合法的返回 never。

其实还是有挺多解法的，这里简单说几个思路：

思路一：

1. 遍历一次判断是否有非数字的符号，有，never
2. 没有，则设定一个辅助计数的 Arr，不断判断 `T extends Arr['length'] ? Arr['length'] : ToNumber<T, [...Arr, any]>` 即可得到最终的数字。

但是这样如果数字大的话会出现递归溢出。

思路二：

比较麻烦，可以看看这个[题解](https://github.com/type-challenges/type-challenges/issues/398)

比较复杂，就不解释了。

思路三：

字符匹配即可。

```ts
type ToNumber<S extends string> =
  S extends `${infer F extends number}`
  ? F
  : never;
```

## 题解

```ts
type ToNumber<S extends string> =
  S extends `${infer F extends number}`
  ? F
  : never;
```

## 知识点

1. 字符匹配中 `${infer F extends number}` 的使用。

只有当 F 是最后一个推断时，才能够承接剩余的元素，而不是只占一个坑位哦，这题刚好满足了条件才可以使用。