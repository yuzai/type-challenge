---
title: 2949-ObjectFromEntries
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

Implement the type version of ```Object.fromEntries```

For example:

```typescript
interface Model {
  name: string;
  age: number;
  locations: string[] | null;
}

type ModelEntries = ['name', string] | ['age', number] | ['locations', string[] | null];

type result = ObjectFromEntries<ModelEntries> // expected to be Model
```

## 分析

这个题目其实做过类似的：[2946-实现ObjectEntries](/medium/2946-实现ObjectEntries.md)，只不过是反过来的。

也就是需要实现一个类型，接收一个元素为两个元组的联合类型，把每个联合类型元素的第一个元素作为属性，第二个元素作为类型生成一个对象。

思路也比较简单，利用分发特性遍历联合类型，最终把新生成的联合类型转换为交叉类型，并进行 merge 即可。

```ts
// 55-UnionToIntersection
type UnionToIntersection<U> =
  (
    U extends any
    ? (arg: U) => any
    : never
  ) extends (arg: infer P) => any
  ? P
  : never;

// 可以参考 相等的判断中最终版的说明
type Merge<T> = {
  [P in keyof T]: T[P]
}

type ObjectFromEntries<T extends [string, any]> = Merge<UnionToIntersection<
  // 触发分发特性
  T extends any
  ? {
    [P in T[0]]: T[1]
  }
  : never
>>
```

但是，话又说回来了，有没有更简单的方法呢？

```ts
type Keys = 'a' | 'b' | 'c';

type ObjectFromKeys<T extends string> = {
    [P in T]: P
}

type KeyValues = ['a', string] | ['b', string] | ['c', number];

type ObjectFromKeyValues<T extends [string, any]> = {
  [P in T as P[0]]: P[1]
}
```

## 题解

```ts
type ObjectFromEntries<T extends [string, any]> = {
  [P in T as P[0]]: P[1]
}
```

这个方法巧妙的结合了联合类型以及对象遍历时的黑科技，有点分发的意思，注意 P 和 T 的位置即可。

## 知识点

1. 分发特性
2. 联合转交叉