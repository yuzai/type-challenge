---
title: 7258-ObjectKeyPaths
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

Get all possible paths that could be called by [_.get](https://lodash.com/docs/4.17.15#get) (a lodash function) to get the value of an object

```typescript
type T1 = ObjectKeyPaths<{ name: string; age: number }>; // expected to be 'name' | 'age'
type T2 = ObjectKeyPaths<{
  refCount: number;
  person: { name: string; age: number };
}>; // expected to be 'refCount' | 'person' | 'person.name' | 'person.age'
type T3 = ObjectKeyPaths<{ books: [{ name: string; price: number }] }>; // expected to be the superset of 'books' | 'books.0' | 'books[0]' | 'books.[0]' | 'books.0.name' | 'books.0.price' | 'books.length' | 'books.find'
```

## 分析

这个题目还是非常有难度的，需要了解一个特性，就是联合类型在字符中的特性，就是当 `123${K}`，K 是联合属性时，会发生什么：

```ts
type Copy<K extends string> = `123${K}`;

// Case2: '123a' | '123b'
type Case2 = Copy<'a' | 'b'>
```

可以看出来，当联合类型处于字符中时，其实也会触发类似分发特性的效果，生成一个新的联合。

借助这个能力，就可以比较简单的生成题目要求的字符串组合。

在处理元组类型时，可以通过如下方式轻松实现 `[0]. 、 0.` 这样的组合方式

```ts
type Test<T extends number> = `${T | `[${T}]`}.`

// Case1 = "0." | "[0]."
type Case1 = Test<0>;
```

所以要做这个题目，首先对入参进行是否是对象 or 元组的判断：

如果是对象，那么遍历这个对象的属性 `P in keyof T`，生成 ``` P | `${P}.${递归处理T[P]}`  ```,

如果是元组，那么遍历元组 `P in keyof T`，生成 ``` P | `[${P}]` | `${K | `[${K}]`}.${递归处理T[P]}`  ```，

对于不为元组，不为对象的情况，不做处理。

但是确实不太好理解，可以尝试看注释再做进一步的理解。

## 题解

```ts
type DealObj<T extends Record<string, unknown>, K extends keyof T = keyof T> =
  // 遍历对象
  K extends keyof T & (string | number)
  // 如果属性是对象或者元组
  ? T[K] extends (Record<any, unknown> | unknown[])
    // 生成 K
    // 如果属性是元组，那么还需要支持 K[0], K.[0] 的访问，是 '' | '.'
    // 否则，就是 '.'
    // 递归 T[K] 属性
    ? K | `${K}${T[K] extends unknown[] ? '' | '.' : '.'}${ObjectKeyPaths<T[K]>}`
    // 否则，这条属性就算遍历结束了，只需要返回 K 即可
    : K
  : never;

type DealArr<T extends unknown[], K extends keyof T = keyof T> =
  // 遍历元组
  K extends keyof T & (string | number)
  // 如果属性是对象或者元组
  ? T[K] extends Record<any, unknown> | unknown[]
    // 返回 '0' | `[0]`
    // 以及 '0.剩余属性递归结果' , '[0].剩余属性递归结果' 
    ? K | `[${K}]` | `${K | `[${K}]`}.${ObjectKeyPaths<T[K]>}`
    // 否则，只需要返回 '0' | '[0]' 就可以了
    : K | `[${K}]`
  : never;

type ObjectKeyPaths<T> =
  // 判断是不是元组
  T extends unknown[]
  ? DealArr<T>
  // 判断是不是对象
  : T extends Record<string, unknown>
    ? DealObj<T>
    // 其他类型不会出现
    : never;
```

## 知识点

这题确实不太好理解，虽然题目看起来很简单，但是实际处理的时候，我本人花了很长时间。而且其中还有比较多的隐藏坑点不好阐述，需自行体会。

1. 对象遍历可以通过增加辅助对象，K = keyof T 进行遍历
2. ```type Test<T extends number> = `${T | `[${T}]`}.` ``` 字符中类似联合类型分发效果

也可以参考这个答案，写法更为简单：

```ts
// https://github.com/type-challenges/type-challenges/issues/19758
type ObjectKeyPaths<T extends unknown, K extends keyof T = keyof T> =
  T extends Record<any, unknown> | unknown[]
  ? K extends keyof T & (string | number)
    ? `${
        // if T is an array, K could be in []
        T extends unknown[] ? `[${K}]` | K : K
      }${
        | ''
        | `${
            // if T[K] is an array, there could be a empty string between T and T[K]
            T[K] extends unknown[] ? '' | '.' : '.'
          }${ObjectKeyPaths<T[K]>}`}`
    : never
  : never
```
