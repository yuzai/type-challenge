---
title: 14080-FizzBuzz
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

The FizzBuzz problem is a classic test given in coding interviews. The task is simple:

Print integers 1 to N, except:

- Print "Fizz" if an integer is divisible by 3;
- Print "Buzz" if an integer is divisible by 5;
- Print "FizzBuzz" if an integer is divisible by both 3 and 5.

For example, for N = 20, the output should be: `1, 2, Fizz, 4, Buzz, Fizz, 7, 8, Fizz, Buzz, 11, Fizz, 13, 14, FizzBuzz, 16, 17, Fizz, 19, Buzz`

In the challenge below, we will want to generate this as an array of string literals.

For large values of N, you will need to ensure that any types generated do so efficiently (e.g. by correctly using the tail-call optimisation for recursion).

## 分析

题目的本质是输入一个整数，输出一个元组，元组中的数就是从 1 - N，但是其中，3 的倍数，5 的倍数，3 和 5 的倍数需要做特殊的替换。

对于 3 or 5 的倍数，其实增加两个辅助计数的元组，分别计数到 3、5 清零并替换对应的数字就可以实现题目的要求。

同时题目还提示了要用尾递归进行优化，关于尾递归，可以参考 [冷门-递归深度](/summary/冷门-递归深度.md)。主要是优化递归的深度。

可以先不考虑递归深度的优化，直接用生成元组的方式去实现：

```ts
type FizzBuzz<
  N extends number,
  // 计数
  Arr extends any[] = [],
  // 每 3 次清一次
  Arr3 extends any[] = [],
  // 每 5 次清一次
  Arr5 extends any[] = [],
> =
  // 判断是否达到结束值
  Arr['length'] extends N
    ? []
    : // 加上一之后的 Arr3 长度是否是 3
    // 此处加1，是因为 Arr3 从 0，开始， 0, 1, 2 就是满足条件了，所以加1，或者 3 -> 2都可以
    [1, ...Arr3]['length'] extends 3
    ? // 是否到 5
      [1, ...Arr5]['length'] extends 5
      ? // 既是3也是5，填入 FizzBuzz,清空 Arr3, Arr5，增加 Arr
        ['FizzBuzz', ...FizzBuzz<N, [...Arr, 1], [], []>]
      : // 只是3不是5，填入 Fizz,清空 Arr3, 增加Arr5，增加 Arr
        ['Fizz', ...FizzBuzz<N, [...Arr, 1], [], [...Arr5, 1]>]
    : // 不是3，是5，填入 Buzz,清空 Arr5, 增加 Arr3，增加 Arr
    [1, ...Arr5]['length'] extends 5
    ? ['Buzz', ...FizzBuzz<N, [...Arr, 1], [...Arr3, 1], []>]
    : // 不是3，不是5，填入 长度 length, 增加 Arr5, 增加 Arr3，增加 Arr
      [
        `${[1, ...Arr]['length'] & number}`,
        ...FizzBuzz<N, [...Arr, 1], [...Arr3, 1], [...Arr5, 1]>,
      ];
```

此时能够通过 50 以内的数字，由于非尾递归，不能通过更长的用例。

在上面的过程中，其实 Arr 只是作为了计数，但是如果把结果存在 Arr 中，就能够在返回的时候直接作为结果，来达到尾递归的条件，看代码更合适一点：

```ts
type FizzBuzz<
  N extends number,
  Arr extends any[] = [],
  Arr3 extends any[] = [],
  Arr5 extends any[] = [],
> = Arr['length'] extends N
  ? // Arr 就是要求的结果
    Arr
  : [1, ...Arr3]['length'] extends 3
  ? [1, ...Arr5]['length'] extends 5
    ? // 核心修改点，直接返回函数本身
      // 将结果放入 Arr 中
      FizzBuzz<N, [...Arr, 'FizzBuzz'], [], []>
    : FizzBuzz<N, [...Arr, 'Fizz'], [], [...Arr5, 1]>
  : [1, ...Arr5]['length'] extends 5
  ? FizzBuzz<N, [...Arr, 'Buzz'], [...Arr3, 1], []>
  : FizzBuzz<
      N,
      [...Arr, `${[1, ...Arr]['length'] & number}`],
      [...Arr3, 1],
      [...Arr5, 1]
    >;
```

当然，再开一个辅助元组存储结果也是 ok 的，此处仅仅是方便。

如此，便可通过所有 用例。

## 题解

```ts
type FizzBuzz<
  N extends number,
  Arr extends any[] = [],
  Arr3 extends any[] = [],
  Arr5 extends any[] = [],
> = Arr['length'] extends N
  ? // Arr 就是要求的结果
    Arr
  : [1, ...Arr3]['length'] extends 3
  ? [1, ...Arr5]['length'] extends 5
    ? // 核心修改点，直接返回函数本身
      // 将结果放入 Arr 中
      FizzBuzz<N, [...Arr, 'FizzBuzz'], [], []>
    : FizzBuzz<N, [...Arr, 'Fizz'], [], [...Arr5, 1]>
  : [1, ...Arr5]['length'] extends 5
  ? FizzBuzz<N, [...Arr, 'Buzz'], [...Arr3, 1], []>
  : FizzBuzz<
      N,
      [...Arr, `${[1, ...Arr]['length'] & number}`],
      [...Arr3, 1],
      [...Arr5, 1]
    >;
```

## 知识点

1. 除法计数
2. [冷门-递归深度](/summary/冷门-递归深度.md)
