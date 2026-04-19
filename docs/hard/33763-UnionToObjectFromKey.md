---
title: 33763-UnionToObjectFromKey
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

实现 `UnionToObjectFromKey<U, K>`，在对象联合 `U` 里保留**所有拥有 key `K` 的对象**，组成新的联合返回。

```ts
type Foo = { foo: string; common: boolean };
type Bar = { bar: number; common: boolean };
type Other = { other: string };

type A = UnionToObjectFromKey<Foo | Bar, 'foo'>; // Foo
type B = UnionToObjectFromKey<Foo | Bar, 'common'>; // Foo | Bar
type C = UnionToObjectFromKey<Foo | Bar | Other, 'common'>; // Foo | Bar
```

## 分析

典型的"按条件筛联合"题，对应 `Extract` 的思路：对联合 `U` 做分发，逐支判断是否含 key `K`，不含则丢弃。

判断对象是否有某个 key 的最直接方式就是 `K extends keyof X`。

整个题目其实只是一个自定义版的 `Extract`。

## 题解

```ts
type UnionToObjectFromKey<Union, Key> = Union extends any
  ? Key extends keyof Union
    ? Union
    : never
  : never;
```

解读：

- `Union extends any` 触发联合分发：联合里的每一个对象都会单独走一次这个判断。
- `Key extends keyof Union`：如果当前分支对象有 `Key` 这个 key，保留自身；否则返回 `never`（天然从联合里被吸收掉）。

## 验证

```ts
type Foo = { foo: string; common: boolean };
type Bar = { bar: number; common: boolean };
type Other = { other: string };

type cases = [
  UnionToObjectFromKey<Foo | Bar, 'foo'>, // Foo
  UnionToObjectFromKey<Foo | Bar, 'common'>, // Foo | Bar
  UnionToObjectFromKey<Foo | Bar | Other, 'common'>, // Foo | Bar
];
```

## 知识点

- `T extends any ? ... : never` 的"分发 + never 吸收"组合是类型层做"filter 联合"的通用范式，见 [战斗基-联合类型的分发特性](/summary/战斗基-联合类型的分发特性.md)。
- 本质上就是 `Extract<Union, { [P in Key & PropertyKey]: unknown }>` 的另一种写法；自定义版本在 Key 是泛型时可读性更好。
