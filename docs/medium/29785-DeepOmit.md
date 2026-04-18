---
title: 29785-DeepOmit
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

实现 `DeepOmit<T, Path>`，按 `a.b.c` 点号路径递归移除嵌套属性。

```ts
type Obj = {
  person: {
    name: string;
    age: { value: number };
  };
};

type R1 = DeepOmit<Obj, 'person'>;          // {}
type R2 = DeepOmit<Obj, 'person.name'>;      // { person: { age: { value: number } } }
type R3 = DeepOmit<Obj, 'name'>;             // 原样返回（路径不匹配）
type R4 = DeepOmit<Obj, 'person.age.value'>; // { person: { name: string; age: {} } }
```

## 分析

两层嵌套：

1. 用模板字符串把路径拆成 "当前 key" + "剩余路径" —— `${infer Head}.${infer Rest}`。
2. 遍历对象：
   - 如果当前路径没有 `.`（即到终点），直接 `Omit` 掉这个 key；
   - 有 `.`，拆出 `Head` / `Rest`；只对匹配 `Head` 的字段递归 `DeepOmit<_, Rest>`，其他字段原样保留；
   - 路径对应的 key 不在对象里，原样返回。

## 题解

```ts
type DeepOmit<T, Path extends string> =
  Path extends `${infer Head}.${infer Rest}`
    ? Head extends keyof T
      ? {
          [K in keyof T]: K extends Head ? DeepOmit<T[K], Rest> : T[K];
        }
      : T
    : Path extends keyof T
      ? Omit<T, Path>
      : T;
```

三个分支：

- **路径还有 `.`**：拆头尾，对匹配 `Head` 的字段递归；
- **路径是单段且匹配**：直接 `Omit` 这个 key；
- **路径不匹配**：返回原对象，不变。

## 验证

```ts
type Obj = { person: { name: string; age: { value: number } } };

type R1 = DeepOmit<Obj, 'person'>;            // {}
type R2 = DeepOmit<Obj, 'person.name'>;
// { person: { age: { value: number } } }
type R3 = DeepOmit<Obj, 'name'>;              // 原样
type R4 = DeepOmit<Obj, 'person.age.value'>;
// { person: { name: string; age: {} } }
```

## 知识点

- 模板字符串拆路径 `${Head}.${Rest}`，是处理"点路径"类题目（DeepPick / DeepGet）的常用手段，见 [hard/956-DeepPick](/hard/956-DeepPick.md) 对比。
- 区分"路径到终点直接 Omit"与"路径中间继续递归"，是这类题关键逻辑分叉。
