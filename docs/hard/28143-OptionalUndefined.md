---
title: 28143-OptionalUndefined
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

实现 `OptionalUndefined<T, Props?>`：

- 把 `T` 里**所有值包含 `undefined`** 的字段改成可选（`?`）；
- 可选参数 `Props` 限定只处理 `Props` 中列出的 key——未列出的 key 即使 value 可以是 `undefined` 也保持原状。

```ts
type A = OptionalUndefined<{ value: string | undefined; desc: string }>;
// { value?: string; desc: string }

type B = OptionalUndefined<
  { value: string | undefined; desc: string | undefined },
  'value'
>;
// { value?: string | undefined; desc: string | undefined }
```

## 分析

题目把字段分两类：

1. **"该改可选"**：key 在 `Props` 里（或 `Props` 缺省时视为全部 key），且 value 包含 `undefined`；
2. **"保持原样"**：其他所有字段。

对应到 mapped type：

- "该改可选"这部分用 `{ [K in keyof T as ...]?: Exclude<T[K], undefined> }` 产出，只收 value 不含 `undefined` 的核心类型；
- "保持原样"这部分用 `{ [K in keyof T as ...]: T[K] }` 直接照搬。

最后把两块合并起来。注意合并要用 `Merge` 拍平，不然 `Equal` 会把 `{a?:T}&{b:T}` 判成不等于 `{a?:T; b:T}`——这是 [对象遍历的 as 和索引访问](/summary/基操-对象遍历的as和索引访问.md) 里反复出现的坑。

另一个小细节：看第一组测试 `{ value: string | undefined }` → `{ value?: string }`，`Exclude<T[K], undefined>` 把 `undefined` 剥了；但第四组 `{ value: string | undefined, desc: string | undefined }` 在 `Props='value'` 时期望 `{ value?: string | undefined, desc: string | undefined }`——`desc` 没在 Props 里，不动；`value` 在 Props 里**但保留 undefined**。

所以默认情况（`Props` 缺省）才 `Exclude`；指定 `Props` 时不 `Exclude`。区分这两种就行。

## 题解

```ts
type Merge<T> = { [K in keyof T]: T[K] };

// undefined 出现在这个 key 的 value 里
type ValueHasUndefined<V> = undefined extends V ? true : false;

type OptionalUndefined<T, Props extends keyof T = keyof T> = Merge<
  // 要改成可选的那部分
  {
    [K in keyof T as K extends Props
      ? ValueHasUndefined<T[K]> extends true
        ? K
        : never
      : never]?: [keyof T] extends [Props]
      ? // Props 缺省：剔除 undefined
        Exclude<T[K], undefined>
      : // Props 指定：保留 undefined
        T[K];
  } & {
    // 保持原样的那部分
    [K in keyof T as K extends Props
      ? ValueHasUndefined<T[K]> extends true
        ? never
        : K
      : K]: T[K];
  }
>;
```

解读：

- `Props extends keyof T = keyof T`：没传 `Props` 时默认等于 `keyof T`，所有 key 都视为候选。
- `ValueHasUndefined<V>`：`undefined extends V` 为真表示 `V` 里含 `undefined`。
- 第一块 mapped type：key 同时满足"在 Props 里"和"value 含 undefined"才保留、改成可选。
  - value 侧用 `[keyof T] extends [Props]` 判断是不是**默认调用**（即 `Props = keyof T`），是 → 用 `Exclude<T[K], undefined>` 剥掉 undefined；否 → 保留。
- 第二块 mapped type：收容剩余 key——要么不在 Props 里，要么 value 根本不含 undefined，一律原样照抄。
- 最外层 `Merge` 拍平 `&` 交叉，保证 `Equal` 能精确匹配。

## 验证

```ts
type cases = [
  OptionalUndefined<{ value: string | undefined }, 'value'>,
  // { value?: string | undefined }
  OptionalUndefined<{ value: string; desc: string }, 'value'>,
  // { value: string; desc: string }
  OptionalUndefined<{ value: string | undefined; desc: string }, 'value'>,
  // { value?: string; desc: string }
  OptionalUndefined<{ value: string | undefined; desc: string | undefined }>,
  // { value?: string; desc?: string }
  OptionalUndefined<{ value?: string }, 'value'>,
  // { value?: string }
];
```

## 知识点

- `as` 子句 + `K extends 条件 ? K : never` 做"按 key 过滤"是 mapped type 标配，见 [基操-对象遍历的 as 和索引访问](/summary/基操-对象遍历的as和索引访问.md)。
- 判断某个类型里是否含 `undefined`，写法是 `undefined extends V ? ... : ...`（方向很重要，反过来只能判"V 就是 undefined 本身"）。
- 把 `A & B` 拍平到扁平对象上靠 `Merge<T> = { [K in keyof T]: T[K] }`——几乎所有"合并两个子对象"的题最后都要加一层。
