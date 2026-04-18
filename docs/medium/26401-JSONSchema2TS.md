---
title: 26401-JSONSchema2TS
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

实现一个 `JSONSchema2TS`，把 JSON Schema 对象转换成对应的 TypeScript 类型。需支持：

- 基础类型：`{ type: 'string' }` → `string`；`{ type: 'number' }` → `number`；`{ type: 'boolean' }` → `boolean`。
- 枚举：`{ type: 'string', enum: ['a', 'b', 'c'] }` → `'a' | 'b' | 'c'`。
- 对象：`{ type: 'object', properties: { a: { type: 'string' } } }` → `{ a?: string }`。
- 数组：`{ type: 'array', items: { type: 'string' } }` → `string[]`。
- 必填字段：`required: ['a']` 让 `a` 变成非可选。

## 分析

典型的递归类型题，核心是按 `type` 字段分支处理：

1. **基础分支**：根据 `type` 返回 `string` / `number` / `boolean`。
2. **enum 分支**：如果 schema 上有 `enum` 字段，把它作为数组元素的联合返回（优先级高于 `type`）。
3. **object 分支**：遍历 `properties`，对每个值递归；需要配合 `required` 数组决定字段是否可选。
4. **array 分支**：对 `items` 递归，包装成 `T[]`。

对象字段默认可选、命中 `required` 时去掉可选修饰 —— 用 mapped type 的 `?` / `-?` 组合即可，见 [对象遍历的 as 和索引访问](/summary/基操-对象遍历的as和索引访问.md)。

## 题解

```ts
type Primitive<T> = T extends 'string'
  ? string
  : T extends 'number'
    ? number
    : T extends 'boolean'
      ? boolean
      : never;

type PickRequired<P, R extends readonly string[]> = {
  [K in keyof P as K extends R[number] ? K : never]: JSONSchema2TS<P[K]>;
};

type PickOptional<P, R extends readonly string[]> = {
  [K in keyof P as K extends R[number] ? never : K]?: JSONSchema2TS<P[K]>;
};

type JSONSchema2TS<T> = T extends { enum: infer E extends readonly any[] }
  ? E[number]
  : T extends { type: 'array'; items: infer I }
    ? JSONSchema2TS<I>[]
    : T extends { type: 'object'; properties: infer P; required?: infer R }
      ? (R extends readonly string[]
          ? PickRequired<P, R> & PickOptional<P, R>
          : { [K in keyof P]?: JSONSchema2TS<P[K]> })
      : T extends { type: infer Ty }
        ? Primitive<Ty>
        : unknown;
```

解读：

- **enum 优先**：schema 上带 `enum` 就直接返回其联合，跳过 `type` 判断。
- **array**：递归 `items`，外层包 `[]`。
- **object**：分 `required` 是否存在两种情况；存在就用 mapped type 分别构建必填和可选两块，最后交叉。
- **基础类型**：最后落在 `Primitive<Ty>` 上。

## 验证

```ts
type A = JSONSchema2TS<{ type: 'string' }>;
// string

type B = JSONSchema2TS<{ type: 'string'; enum: ['a', 'b', 'c'] }>;
// 'a' | 'b' | 'c'

type C = JSONSchema2TS<{
  type: 'object';
  properties: { a: { type: 'string' }; b: { type: 'number' } };
  required: ['a'];
}>;
// { a: string } & { b?: number }

type D = JSONSchema2TS<{ type: 'array'; items: { type: 'string' } }>;
// string[]
```

## 知识点

- mapped type 的 `?` / `-?` 控制字段可选；配合 `as ... extends ... ? K : never` 过滤 key，见 [对象遍历的 as 和索引访问](/summary/基操-对象遍历的as和索引访问.md)。
- 用 `infer` 从对象字段中取出 `enum` / `items` / `properties`，配合 `extends { ... }` 做分支匹配。
