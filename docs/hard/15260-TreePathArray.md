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

## 题解
