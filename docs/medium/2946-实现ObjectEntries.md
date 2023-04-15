---
title: 2946-实现ObjectEntries
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

Implement the type version of ```Object.entries```

For example 

```typescript
interface Model {
  name: string;
  age: number;
  locations: string[] | null;
}
type modelEntries = ObjectEntries<Model> // ['name', string] | ['age', number] | ['locations', string[] | null];
```

## 分析

这一题也是对对象的操作，不过输出的是联合类型，每一个元素都是一个长度为2的元组，元素为对象的属性名和属性值。

这里涉及到的知识点就是 [索引访问](https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html)，举个例子：

```ts
type Test = { a: number, b: string }

// Case1 = number
type Case1 = Test['a'];

// Case2 = number | string
type Case2 = Test[keyof Test];
```

本题目就可以通过该上述方式得到联合类型，只需要根据当前类型，遍历属性并修改属性值即可。

```ts
type ObjectEntries<T> = {
  // 遍历修改属性值
  [K in keyof T]:[K, T[K]]
// 索引签名得到结果
}[keyof T]
```

讲道理到这一步其实已经结束了，但是偏偏这个题的用例比较特殊：

```ts
interface Model {
  name: string
  age: number
  locations: string[] | null
}

type ModelEntries = ['name', string] | ['age', number] | ['locations', string[] | null]

type cases = [
  Expect<Equal<ObjectEntries<Model>, ModelEntries>>,
  // 引入了可选属性，但是结果中，出现了 undefined
  Expect<Equal<ObjectEntries<Partial<Model>>, ModelEntries>>,
  // 引入了可选属性，但是结果中显示为 never
  Expect<Equal<ObjectEntries<{ key?: undefined }>, ['key', undefined]>>,
  Expect<Equal<ObjectEntries<{ key: undefined }>, ['key', undefined]>>,
]
```

这里可以做几个例子来看看可选属性对属性值的影响：

```ts
type Copy<T> = {
  [P in keyof T]: [P, T[P]]
};

/*
    type Case1 = {
        a?: ["a", number | undefined] | undefined;
        b: ["b", number];
        c?: ["c", undefined] | undefined;
    }
*/
type Case1 = Copy<{
  a?: number,
  b: number,
  c?: undefined,
}>

type CopyWithoutOption<T> = {
  [P in keyof T]-?: [P, T[P]]
};

/*
    type Case2 = {
        a: ["a", number | undefined];
        b: ["b", number];
        c: ["c", undefined];
    }
*/
type Case2 = CopyWithoutOption<{
  a?: number,
  b: number,
  c?: undefined,
}>
```

从上面结果来看，为了应对可选属性，需要在遍历的时候移除可选修饰符，才能清除拷贝后的 `['key', type] | undefined` 的影响。

同时，由于 `Expect<Equal<ObjectEntries<Partial<Model>>, ModelEntries>>` 这个 case 的存在，所以还需要移除结果中的 undefined 类型。

## 题解

```ts
type ObjectEntries<T> = {
    // step1，移除修饰符中的 可选修饰符
    [P in keyof T]-?:
        [   
            P,
            // 如果 T[P] 只有一个 undefined
            [T[P]] extends [undefined]
            // 返回 T[P] 也就是 undefined
            ? T[P]
            // 否则，从属性中移除 undefined 以满足用例的要求
            : Exclude<T[P],undefined>
        ];
}[keyof T];
```

## 知识点

1. 索引访问，`[keyof T]`。
2. 修饰符对对象遍历的影响：属性值中会多出一个 undefined。

