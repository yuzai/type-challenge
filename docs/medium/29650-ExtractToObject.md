---
title: 29650-ExtractToObject
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

从对象里取出指定 key 对应的子对象，并把子对象的字段"摊开"到外层，同时保留其它字段。

```ts
type Test = { id: '1'; myProp: { foo: '2' } };
type R = ExtractToObject<Test, 'myProp'>;
// { id: '1'; foo: '2' }
```

## 分析

两步：

1. 从 `T` 里 `Omit` 掉被摊开的 key。
2. 把 `T[K]` 的所有字段合并到上一步的结果里。

"合并对象"等价于交叉 `&`；若想看上去更干净，用 mapped type 重拷贝一遍（俗称 `Prettify`）。

## 题解

```ts
type ExtractToObject<T, K extends keyof T> = {
  [P in keyof (Omit<T, K> & T[K])]: (Omit<T, K> & T[K])[P];
};
```

解读：

- `Omit<T, K>` 去掉 `K` 字段，剩下的保留。
- `T[K]` 是被摊开的那个子对象。
- 用交叉 `&` 合并，再用 mapped type 扁平化。

更精炼的写法：

```ts
type Prettify<T> = { [K in keyof T]: T[K] };
type ExtractToObject<T, K extends keyof T> = Prettify<Omit<T, K> & T[K]>;
```

## 验证

```ts
type R1 = ExtractToObject<{ id: '1'; myProp: { foo: '2' } }, 'myProp'>;
// { id: '1'; foo: '2' }

type R2 = ExtractToObject<{ a: 1; inner: { b: 2; c: 3 } }, 'inner'>;
// { a: 1; b: 2; c: 3 }
```

## 知识点

- `Prettify` / `Merge` 模式把交叉类型"压平"成普通对象类型，便于观察。
- `Omit` + `&` 是"改造对象结构"最轻量的组合拳。
