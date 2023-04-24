---
title: 15260-TreePathArray
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

Create a type `Path` that represents validates a possible path of a tree under the form of an array.

Related challenges:
- [7258-ObjectKeyPaths](/hard/7258-ObjectKeyPaths.md)

```ts
declare const example: {
    foo: {
        bar: {
            a: string;
        };
        baz: {
            b: number
            c: number
        }
    };
}

// Possible solutions: 
// []
// ['foo']
// ['foo', 'bar']
// ['foo', 'bar', 'a']
// ['foo', 'baz']
// ['foo', 'baz', 'b']
// ['foo', 'baz', 'c']
```

## 分析

可以先看下用例，题目输出是所有 path 组成的联合类型。

```ts
declare const example: {
  foo: {
    bar: {
      a: string
    }
    baz: {
      b: number
      c: number
    }
  }
}

type cases = [
  ExpectTrue<ExpectExtends<Path<typeof example['foo']['bar']>, ['a']>>,
  ExpectTrue<ExpectExtends<Path<typeof example['foo']['baz']>, ['b'] | ['c'] >>,
  ExpectTrue<ExpectExtends<Path<typeof example['foo']>, ['bar'] | ['baz'] | ['bar', 'a'] | ['baz', 'b'] | ['baz', 'c']>>,
  ExpectFalse<ExpectExtends<Path<typeof example['foo']['bar']>, ['z']>>,
]
```

和 [7258-ObjectKeyPaths](/hard/7258-ObjectKeyPaths.md) 类似，但是结果不同，上一题是 a.b 这样的组成的联合类型，而本题是 `[a, b]` 这样组合成的联合类型。同时这个题目不需要处理元组属性，更为简单一点。

很明显的一个思路就是借助 [7258-ObjectKeyPaths](/hard/7258-ObjectKeyPaths.md) 的结果，借助分发特性，将 a.b 转成 `[a, b]` 就是本题的答案。

不过这题还有另外一个思路，就是遍历的时候，不生成 a.b，而是直接生成 `[a, b]` 的结果。

这里也涉及到一个比较隐晦的特性，就是联合类型出现在元组中的扩展操作符位置时，也会存在分发特性：

```ts
// type a = [2, "a"] | [2, "b"]
type a = [2, ...(['a'] | ['b'])];
```

借助这个特性，生成本题的结果非常简单，直接看题解

## 题解

```ts
type Path<T, K = keyof T> =
  // 遍历属性
  K extends keyof T
  // 生成 [K]
  // 如果 T[K] 是对象，那么需要再生成 
  // [K, ...(递归T[K]的结果)]
  ? [K] | (T[K] extends Record<string, any>
      ? [K, ...Path<T[K]>]
      : never)
  : never
```

借助联合类型在元组中的类似分发的特性，就可以实现题目要求的结果组合了。

## 知识点

1. `type a = [2, ...(['a'] | ['b'])];` 中类似联合类型分发效果
2. 对象遍历可以通过增加辅助对象，K = keyof T 进行遍历