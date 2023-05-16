---
title: 14188-Run-lengthEncoding
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

Given a `string` sequence of a letters f.e. `AAABCCXXXXXXY`. Return run-length encoded string `3AB2C6XY`. Also make a decoder for that string.

## 分析

这个题目还是比较有趣的，需要一些辅助变量。

在以往的遍历题目中，并不需要前值，所以在遍历的过程中相对容易，而在这个题目中，需要记录上一个值，同时还需要进行计数。

可以想到 encode 至少需要两个辅助泛型，一个用于存储字符出现的次数，一个用于记录上一个字符。

每次遍历的时候，先判断当前字符和上一个字符是否相同，如果相同，则次数 + 1，如果不同，输出 `${num}${before}`，也就是 次数+字符的格式。通过这种方式可以实现 encode，代码如下：

```ts
export type Encode<
  S extends string,
  // 辅助元组记录次数
  Arr extends any[] = [],
  // 记录当前计数的字符
  Before extends string = '',
> = S extends `${infer F}${infer R}`
  ? // 如果前值没有，此时属于初始状态
    Before extends ''
    ? // 直接递归剩余元素，并且将字符设置为 F，同时记 1
      Encode<R, [1], F>
    : // 遇到相同的字符
    F extends Before
    ? // 次数加一，并递归剩余字符
      Encode<R, [...Arr, 1], Before>
    : // 遇到不同的字符，
      // 判断是否是1，如果是1，直接输出 before
      // 否则输出 次数 + before
      // 并进行递归剩余字符，此时次数直接 + 1，并记录 Before 为 当前字符
      `${Arr['length'] extends 1 ? '' : Arr['length']}${Before}${Encode<
        R,
        [1],
        F
      >}`
  : // 递归结束，把最后一个字符补上
    `${Arr['length'] extends 1 ? '' : Arr['length']}${Before}`;
```

而 decode，需要将 3a 这样的格式转为 `AAA`，可以通过一个辅助类型实现转换，在主流程中进行数字和字符的判断会更加清晰。

Repeat 非常简单，增加计数元组辅助即可实现，如下：

```ts
type Repeat<
  S extends string,
  N extends number,
  Arr extends any[] = [],
> = Arr['length'] extends N
  ? ''
  : // 不断填入 S，直到数量足够
    `${S}${Repeat<S, N, [...Arr, 1]>}`;
```

有了辅助函数之后，另一个问题是如何判断一个字符是否是数字，由于要么是字符，要么是数字，此时可以通过 `Uppercase<F> extends Lowercase<F>` 判断，也可以通过 `F extends '0' | '1' | ...` 判断。如此，便得到了解码的过程：

```ts
export type Decode<
  S extends string,
  Nums extends number = 0,
> = S extends `${infer F}${infer R}`
  ? // 如果是数字
    Uppercase<F> extends Lowercase<F>
    ? // 那么把 F 转成数字，对剩余元素进行递归
      Decode<R, F extends `${infer Num extends number}` ? Num : never>
    : // 如果是0，此时对应上述编码中的 1Y -> Y，所以直接输出 F，并递归剩余元素
    Nums extends 0
    ? `${F}${Decode<R, 0>}`
    : // 否则，重复字符 Nums 次，并递归处理剩余字符，Nums 又重新置为 0.
      `${Repeat<F, Nums>}${Decode<R, 0>}`
  : '';
```

## 题解

```ts
type Repeat<
  S extends string,
  N extends number,
  Arr extends any[] = [],
> = Arr['length'] extends N ? '' : `${S}${Repeat<S, N, [...Arr, 1]>}`;

namespace RLE {
  export type Encode<
    S extends string,
    Arr extends any[] = [],
    Before extends string = '',
  > = S extends `${infer F}${infer R}`
    ? Before extends ''
      ? Encode<R, [1], F>
      : F extends Before
      ? Encode<R, [...Arr, 1], Before>
      : `${Arr['length'] extends 1 ? '' : Arr['length']}${Before}${Encode<
          R,
          [1],
          F
        >}`
    : `${Arr['length'] extends 1 ? '' : Arr['length']}${Before}`;

  export type Decode<
    S extends string,
    Nums extends number = 0,
  > = S extends `${infer F}${infer R}`
    ? Uppercase<F> extends Lowercase<F>
      ? Decode<R, F extends `${infer Num extends number}` ? Num : never>
      : Nums extends 0
      ? `${F}${Decode<R, 0>}`
      : `${Repeat<F, Nums>}${Decode<R, 0>}`
    : '';
}
```

在上述题解中，解码还存在一个特殊情况没有考虑，就是 `15Y` 两位数字的情况，此时需要在解码的时候进行 计数的增加，但是用例里没有，暂时就不做处理了，类似 [6141-二进制转十进制](/hard/6141-二进制转十进制.md) 的处理，只是把 `1 -> 2 -> 4 -> 8` 转成 `1 -> 10 -> 100 -> 1000` 而已。

## 知识点

本题看似困难，实则是麻烦，本质都还是以前知识的拼接。字符的遍历，拼接，泛型辅助参数的计数，存储中间值等等。
