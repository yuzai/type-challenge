---
title: 216-实现slice
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

Implement the JavaScript `Array.slice` function in the type system. `Slice<Arr, Start, End>` takes the three argument. The output should be a subarray of `Arr` from index `Start` to `End`. Indexes with negative numbers should be counted from reversely.

For example

```ts
type Arr = [1, 2, 3, 4, 5];
type Result = Slice<Arr, 2, 4>; // expected to be [3, 4]
```

## 分析

slice 的关键在于判断当前元素是否在区间内，如果在，则需要放入新的元组中，负责不加入。

这种思路在 [4518-fill](/medium/4518-fill.md) 中也见过，设置一个标志位，初始为 false, 随着元组的遍历 判断当前元素的位置，是否达到了起始位置，如果达到，在之后的遍历中改为 true，遇到 结束位置后，改为 false。

如果只是这样的话，那这个题目最多算个 medium，还远远达不到 地狱级的难度。

关键在于 slice 对于 负数的支持，需要支持如下的场景：

```ts
// basic
  Expect<Equal<Slice<Arr, 0, 1>, [1]>>,
  Expect<Equal<Slice<Arr, 0, 0>, []>>,
  Expect<Equal<Slice<Arr, 2, 4>, [3, 4]>>,

  // optional args
  Expect<Equal<Slice<[]>, []>>,
  Expect<Equal<Slice<Arr>, Arr>>,
  Expect<Equal<Slice<Arr, 0>, Arr>>,
  Expect<Equal<Slice<Arr, 2>, [3, 4, 5]>>,

  // negative index
  Expect<Equal<Slice<Arr, 0, -1>, [1, 2, 3, 4]>>,
  Expect<Equal<Slice<Arr, -3, -1>, [3, 4]>>,

  // invalid
  Expect<Equal<Slice<Arr, 10>, []>>,
  Expect<Equal<Slice<Arr, 1, 0>, []>>,
  Expect<Equal<Slice<Arr, 10, 20>, []>>,
```

除了负数外，同时，还有长度超过数组长度的，起始位置大于结束位置的一场情况。

在实际解决中，可以先对异常的入参进行处理：

1. 处理负数，如果是负数 -n，那么如果 length > n，就改成 length - n，否则置为 0
2. 如果处理后的 结束 End 大于起始 Start，那么就直接返回空元组
3. 无入参则设定默认值 `Start = 0, End = Arr['length']`

这里面就涉及到：

1. 大小的比较，可以参考 [4425-实现比较](/medium/4425-实现比较.md)
2. 减法的实现, 可以参考 [进阶-计数-加减乘除](/summary/进阶-计数-加减乘除.md)

接下来就是实现了，能做到这里的同学，相信理解起来不会困难，可以直接看题解

## 题解

```ts
type Slice<
  T extends any[],
  Start extends number = 0,
  End extends number = Arr['length'],
> =
  // 处理入参后交由只处理合法数据的 DealSlice 处理
  DealSlice<
    T,
    ConvertIndex<Start, T['length']>,
    ConvertIndex<End, T['length']>
  >;

// 本题核心实现
type DealSlice<
  T extends any[],
  Start extends number = 0,
  End extends number = Arr['length'],
  // 记录当前位置
  Cur extends number[] = [],
  // 标志位
  flag = false,
> = GreaterThan<Start, End> extends false // 开始位置是否大于结束位置
  ? T extends [infer F, ...infer R]
    ? // 遍历元组，如果当前达到了起始位置
      Cur['length'] extends Start
      ? // 同时也达到了结束位置，此时对应 start === end 的场景，返回空元组
        Cur['length'] extends End
        ? []
        : // 否则，将 元素加入新元组中，并在递归中将 flag 改为 true，表示在区间内
          [F, ...DealSlice<R, Start, End, [...Cur, 1], true>]
      : // 达到了结束位置
      Cur['length'] extends End
      ? // 此时后续元素也不关心，直接返回空元组
        []
      : // 不是起始也不是结束的场景，此时根据 flag 的情况，决定是否要把当前元素放入元组中
      // 并将 flag 保留当前值继续后续遍历
      flag extends true
      ? [F, ...DealSlice<R, Start, End, [...Cur, 1], flag>]
      : DealSlice<R, Start, End, [...Cur, 1], flag>
    : []
  : []; // 开始位置大于结束位置，直接返回 []

// [4425-实现比较](/medium/4425-实现比较.md)
type GreaterThan<T extends number, U extends number, Arr extends any[] = []> =
  // 先达到 T，则 T 小
  T extends Arr['length']
    ? false
    : // 先达到 U
    U extends Arr['length']
    ? // 则 T 大
      true
    : // 都没到，膨胀元组
      GreaterThan<T, U, [...Arr, 1]>;

// 构建长度为 Length 的元组
type ArrWithLength<Length extends number, Arr extends any[] = []> =
  // 元组长度等于目标长度时
  Arr['length'] extends Length
    ? // 返回元组
      Arr
    : // 否则，向 Arr 中增加一个元素，并递归处理新数组
      ArrWithLength<Length, [...Arr, any]>;

// 减法实现: [进阶-计数-加减乘除](/summary/进阶-计数-加减乘除.md)
type Substract<A extends number, B extends number> = ArrWithLength<A> extends [
  ...ArrWithLength<B>,
  ...infer R,
]
  ? R['length']
  : never;

// 处理负数入参
// 如果是负数 -n，返回 length - n, length - n > 0, 那么返回 0
// 如果是正数 n，返回 n
type ConvertIndex<
  Index extends number,
  Length extends number,
> = `${Index}` extends `-${infer F extends number}`
  ? GreaterThan<Length, F> extends true
    ? Substract<Length, F>
    : 0
  : Index;
```

## 知识点

可以说是麻烦，但是不难。

1. 思路类似: [4518-fill](/medium/4518-fill.md)
2. 实现比较：[4425-实现比较](/medium/4425-实现比较.md)
3. [进阶-计数-加减乘除](/summary/进阶-计数-加减乘除.md)
