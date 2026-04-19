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

1. **enum 分支**：schema 上有 `enum` 就直接返回其联合（优先级高于 `type`）。
2. **array 分支**：`items` 存在时对其递归，再包 `[]`；`items` 缺省时退化成 `unknown[]`。
3. **object 分支**：
   - `properties` 缺省 → 泛化成 `Record<string, unknown>`；
   - 有 `properties`、但没有 `required` → 所有字段可选；
   - 有 `required` → 命中的 key 走必填，其余走可选，再把两块合并。
4. **基础类型**：落在 `string` / `number` / `boolean` 上。

对象字段的"可选 / 必填"要拆成两个 mapped type 分别构建，最后用 `Merge` 把交叉拍平，不然 `Equal` 会把 `{ a: string } & { b?: string }` 跟 `{ a: string; b?: string }` 判成不等，见 [对象遍历的 as 和索引访问](/summary/基操-对象遍历的as和索引访问.md)。

## 题解

```ts
type Primitive<T> = T extends 'string'
  ? string
  : T extends 'number'
  ? number
  : T extends 'boolean'
  ? boolean
  : never;

// 把 PickRequired & PickOptional 的交叉拍平成扁平对象
type Merge<T> = { [K in keyof T]: T[K] };

type PickRequired<P, R extends readonly PropertyKey[]> = {
  [K in keyof P as K extends R[number] ? K : never]: JSONSchema2TS<P[K]>;
};

type PickOptional<P, R extends readonly PropertyKey[]> = {
  [K in keyof P as K extends R[number] ? never : K]?: JSONSchema2TS<P[K]>;
};

type JSONSchema2TS<T> = T extends { enum: infer E extends readonly any[] }
  ? E[number]
  : T extends { type: 'array' }
  ? T extends { items: infer I }
    ? JSONSchema2TS<I>[]
    : unknown[]
  : T extends { type: 'object' }
  ? T extends { properties: infer P }
    ? T extends { required: infer R extends readonly PropertyKey[] }
      ? Merge<PickRequired<P, R> & PickOptional<P, R>>
      : { [K in keyof P]?: JSONSchema2TS<P[K]> }
    : Record<string, unknown>
  : T extends { type: infer Ty }
  ? Primitive<Ty>
  : unknown;
```

解读：

- **enum 优先**：带 `enum` 直接返回其联合，跳过 `type` 判断。
- **array / object 的分层匹配**：先用 `T extends { type: 'array' }` 锁住种类，再嵌套一层 `T extends { items: infer I }` 判断字段是否存在。如果一上来就写 `T extends { type: 'array'; items: infer I }`，没有 `items` 的 schema 会直接落到下面的兜底分支（`unknown`），就拿不到 `unknown[]` / `Record<string, unknown>` 的语义。
- **object 的三档**：缺 `properties` → `Record<string, unknown>`；有 `properties` 无 `required` → 全部字段 `?`；有 `required` → 必填 + 可选合并，外面再套一层 `Merge` 防止被 `Equal` 判成"和扁平对象不等"。
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
