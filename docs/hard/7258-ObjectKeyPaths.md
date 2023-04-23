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

这个题目还是非常有难度的，需要了解一个特性，就是对象遍历时，as 一个联合类型会发生什么：

```ts
type Merge<T> = {
    [P in keyof T as 'a' | 'b']: T[P]
}

// Case1 = { a: 1, b: 2 }
type Case1 = Merge<{ c: 1 }>
```

可以看出来，如果 as 的是一个联合类型，那么其实是会被分发变成两个属性。

另一个特性，也是联合类型的特性，就是当 `123${K}`，K 是联合属性时，会发生什么：

```ts
type Copy<K extends string> = `123${K}`;

// Case2: '123a' | '123b'
type Case2 = Copy<'a' | 'b'>
```

了解了这个特性，这个题目才能够进行第一版：

```ts
type ObjectKeyPaths<T> = keyof T | keyof {
    [
        P in keyof T as
            // 如果是对象属性的
            T[P] extends Record<string, any>
            // 借助字符属性的联合分发的特性，分发嵌套的对象属性
            ? `${P & string}.${ObjectKeyPaths<T[P] & string>}`
            : never
    ]: T[P]
}

// type Case3 = "a" | "b" | "b.c" | "b.d" | "b.d.f"
type Case3 = ObjectKeyPaths<{
    a: 1,
    b: {
        c: 2,
        d: {
            f: 3,
        }
    }
}>
```

此时，可以处理对象类型的嵌套属性了。

但是对于元组属性，还没有进行处理。不过核心就是上述分发的特性，处理元组也仅仅是稍微麻烦但是并没有什么困难的问题。

## 题解

