---
title: 基操-对象遍历的as和索引访问
lang: zh-CN
---

# {{ $frontmatter.title }}

对象遍历是 TS 体操里比字符串/元组更早接触到的东西 —— 第一题 `Pick` 就是遍历对象 key。但真正把它练熟，还得理解两件事：

1. `keyof` / `T[K]` 索引访问在不同类型上的行为；
2. `[P in keyof T as X]` 这个"重映射 (key remapping)"语法能玩出多少花样。

这篇把这两块集中讲清楚。

## 基础遍历模板

```ts
type Copy<T> = {
  [P in keyof T]: T[P];
};
```

这一行是所有对象类型操作的起点。记住三个关键位置：

- **`P in keyof T`**：把 `keyof T` 这个联合的每一支拿出来作为新对象的键；
- **冒号左边**：新对象的键，默认就是 `P`；
- **冒号右边**：新对象该键对应的值，默认是 `T[P]`。

改造对象类型，基本就是在这三个位置上做文章。

## 索引访问 `T[K]`

索引访问是把对象"挖出一部分"最简单的方法。它接受的 `K` 可以是：

```ts
type O = { a: 1; b: 2; c: 3 };

type A = O['a']; // 1                 — 单个 key
type B = O['a' | 'b']; // 1 | 2       — 联合 key，结果也是联合
type C = O[keyof O]; // 1 | 2 | 3     — 全部 value
```

**把 `T[keyof T]` 当口头禅**：它把对象的所有值取出来拼成联合，用来构造"反向映射"、"筛值"、"entries 联合"等场景：

```ts
// 构造 entries 联合
type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T];

type R = Entries<{ a: 1; b: 2 }>; // ['a', 1] | ['b', 2]
```

这招的精髓是 **"先用 mapped type 把每个字段改成想要的单元结构，再用 `[keyof T]` 一次性拉平成联合"**，在 medium 的 [ObjectEntries](/medium/2946-实现ObjectEntries.md), [Flip](/medium/4179-实现Flip.md) 以及 hard 的 [ObjectFromEntries](/hard/2949-ObjectFromEntries.md), [OptionalKeys](/hard/90-获取可选属性键值.md) 里都会看到。

### 在元组上的索引访问

元组也支持索引访问，两个特殊 key 要记牢：

```ts
type T = [1, 2, 3];
type V = T[number]; // 1 | 2 | 3  — 元组的 value 联合
type L = T['length']; // 3        — 元组长度（字面量 number）
```

`T['length']` 是 TS 里拿具体数值的**唯一入口**，加减乘除全靠它，见 [加减乘除](/summary/进阶-计数-加减乘除.md)。

## 重映射 `as`

TS 4.1 开始，mapped type 的键位置支持 `as` 子句，可以**重命名** key、也可以通过产出 `never` 来**过滤** key。这是 medium/hard 题里最常用的武器。

### 场景 1：重命名

```ts
// 给所有 key 加前缀 get_
type Getters<T> = {
  [P in keyof T as `get_${string & P}`]: () => T[P];
};

type R = Getters<{ name: string; age: number }>;
// { get_name: () => string; get_age: () => number }
```

模板字符串里会拿到字符串字面量类型，但 `keyof` 的结果是 `string | number | symbol` 联合，所以通常要用 `string & P` 把 `P` 收窄成字符串字面量。

### 场景 2：按条件过滤 key

```ts
// 留下 value 为 string 的字段
type PickString<T> = {
  [P in keyof T as T[P] extends string ? P : never]: T[P];
};

// never 会被 mapped type 自动丢弃
type R = PickString<{ a: string; b: number; c: 'x' }>;
// { a: string; c: 'x' }
```

**"as 输出 never 即丢弃"** 是 as 最高频的用法，直接对标 [PickByType](/medium/2595-实现PickByType.md), [OmitByType](/medium/2852-实现OmitByType.md), [RequiredKeys](/hard/89-获取必填属性键值.md), [OptionalKeys](/hard/90-获取可选属性键值.md), [ReadonlyKeys](/extreme/5-GetReadOnlyKeys.md) 等一大票题目。

### 场景 3：把 key 映射到另一个联合

```ts
// 把 key 映射成 value，key 和 value 互换
type Flip<T extends Record<string, string>> = {
  [P in keyof T as T[P]]: P;
};

type R = Flip<{ a: '1'; b: '2' }>; // { '1': 'a'; '2': 'b' }
```

这就是 [medium/4179 Flip](/medium/4179-实现Flip.md) 的解法核心。

## 修饰符

mapped type 还能同时改造修饰符（`readonly` / `?`）：

```ts
type MyReadonly<T> = {
  readonly [P in keyof T]: T[P];
};

type MyPartial<T> = {
  [P in keyof T]?: T[P];
};

// 去修饰符：加 - 前缀
type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

type Required<T> = {
  [P in keyof T]-?: T[P];
};
```

`+?` 和 `-?`、`+readonly` 和 `-readonly` 成对出现，记住"加减"就不会搞错。

## 几个坑

### keyof 结果可能带 number / symbol

```ts
type T = { 1: 'a'; b: 'b' };
type K = keyof T; // 1 | 'b'   — key 混了数字字面量
```

所以需要把 key 当字符串用时，记得 `string & K` 或者 `K extends string ? K : never` 筛一遍。

### never 在 as 里是"丢弃"，在冒号右边是"值为 never"

```ts
// 丢弃 a
type A = { [P in 'a' | 'b' as P extends 'a' ? never : P]: 1 };
// 结果：{ b: 1 }

// 保留 a，但其 value 变成 never
type B = { [P in 'a' | 'b']: P extends 'a' ? never : 1 };
// 结果：{ a: never; b: 1 }
```

这是初学者最容易搞混的一处。

### 索引访问不存在的 key 是 never（严格配置下报错）

```ts
type O = { a: 1 };
type X = O['b']; // 会报错："Property 'b' does not exist"
```

所以当你递归到"可能访问不存在的路径"时（常见于 DeepPick、get 这类题），要先 `K extends keyof T ? T[K] : never` 兜底。

## 被谁用到

重映射几乎是 medium 以上所有对象类题的必备手段。代表作：

- 丢弃 key 型：[medium/2595-PickByType](/medium/2595-实现PickByType.md), [medium/2852-OmitByType](/medium/2852-实现OmitByType.md), [hard/57-获取必填属性](/hard/57-获取必填属性.md), [hard/89-获取必填属性键值](/hard/89-获取必填属性键值.md), [hard/5181-mutablekeys](/hard/5181-mutablekeys.md)。
- 改键型：[medium/4179-Flip](/medium/4179-实现Flip.md), [medium/1367-移除索引签名](/medium/1367-移除索引签名.md)。
- entries 拉平型：[medium/2946-ObjectEntries](/medium/2946-实现ObjectEntries.md), [hard/2949-ObjectFromEntries](/hard/2949-ObjectFromEntries.md)。
- 修饰符型：[medium/2793-Mutable](/medium/2793-实现Mutable.md), [medium/8-Readonly2](/medium/8-Readonly2.md), [medium/2757-PartialByKeys](/medium/2757-实现PartialByKeys.md)。

心里把这张表熟了，以后看到"改造对象"类题目直接反射 mapped type + as，绝不手软。
