---
title: 5-GetReadOnlyKeys
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

You're required to implement a type-level parser to parse URL query string into a object literal type.

Some detailed requirements:

- Value of a key in query string can be ignored but still be parsed to `true`. For example, `'key'` is without value, so the parser result is `{ key: true }`.
- Duplicated keys must be merged into one. If there are different values with the same key, values must be merged into a tuple type.
- When a key has only one value, that value can't be wrapped into a tuple type.
- If values with the same key appear more than once, it must be treated as once. For example, `key=value&key=value` must be treated as `key=value` only.

## 分析

本题是解析 query，要求是几个点:

1. `k1` 需要被解释为 `{ K1: true }`
2. 多次出现的且值不同，需要被改成元组类型，也就是 `K1=1&K1=2&K1=3`，被解释为 `{ K1: [1, 2, 3] }`
3. 多次出现的相同值，不会被处理。

这道题，初看确实地狱，因为肉眼可见，就需要做至少好几条工作。

但是静下心来分析，其实就是麻烦了点，实际并不困难。

可以先实现一个处理单个属性的:

```ts
type DealSingle<T extends string> =
  // 匹配 = 号
  T extends `${infer F}=${infer R}`
  ? {
    // 生成 { F: R } 的对象
    [P in F]: R
  } : {
    // 没有等号，此时可能对应 K1 或者 空字符的情况
    // 通过 as never 排除 空字符的情况
    [P in T as P extends '' ? never : P]: true
  };

// Case1 = { K1: 2 }
type Case1 = DealSingle<'K1=2'>
```

接下来还需要将属性进行合并，这其中，对于同时存在的属性，就需要根据值进行合并。这一步单独拆开：

```ts
// 判断 T 中是否包含 U
type Includes<T, U> =
  T extends [infer F, ...infer R]
  ? F extends U
    ? true
    : Includes<R, U>
  : false;

// 合并同时存在的属性值
type MergeSingle<U1, U2> =
  // 如果 是元组
  U1 extends any[]
  // 判断是否包含 U2
  ? Includes<U1, U2> extends true
    // 包含，则不纳入
    ? U1
    // 否则，纳入
    : [...U1, U2]
  // 不是元组，判断当前值是否相同
  : U1 extends U2
    // 相同，则不组成元组，直接返回 U1
    ? U1
    // 否则，组成元组
    : [U1, U2]

// Case2 = [1, 2, 3]
type Case2 = MergeSingle<[1, 2], 3>
```

有了这个操作后，就可以实现完整的合并操作:

```ts
// 完整的合并操作
type Merge<T1, T2> = {
  // 遍历所有属性
  [P in keyof T1 | keyof T2]:
    P extends keyof T1
      ? P extends keyof T2
        // 如果是两者都有的属性，调用上述的 MergeSingle
        ? MergeSingle<T1[P], T2[P]>
        // 否则返回前者
        : T1[P]
      : P extends keyof T2
        // 否则返回后者
        ? T2[P]
        : never
};
```

有了这些辅助的类型，完成最后的工作就是根据 `&` 进行拆分字符，借助辅助对象存储已经解析的结果，就能得到最终的答案。

## 题解

```ts
// 省略了上述的辅助类型

type ParseQueryString<T extends string, Res = {}> =
  // 根据 & 匹配前后字符
  T extends `${infer F}&${infer R}`
  ? ParseQueryString<
      R,
      // 把 F 解析后的结果合并到 Res 中
      Merge<Res, DealSingle<F>>
    >
  // 匹配结束，处理 T 之后合并到 Res 中并返回便是答案
  : Merge<Res, DealSingle<T>>;
```

## 知识点

1. 字符匹配套路

其实就是旧有知识的整合啦，麻烦是真麻烦，但是并不困难。

