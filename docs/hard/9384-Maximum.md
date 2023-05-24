---
title: 9384-Maximum
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

### Description

Implement the type `Maximum`, which takes an input type `T`, and returns the maximum value in `T`.

If `T` is an empty array, it returns `never`. **Negative numbers** are not considered.

For example:

```ts
Maximum<[]>; // never
Maximum<[0, 2, 1]>; // 2
Maximum<[1, 20, 200, 150]>; // 200
```

### Advanced

Can you implement type `Minimum` inspired by `Maximum`?

## 分析

要找出元组中最大的数字，可以通过遍历元组，每次都记录下最大值，将他同下一个值比较，如果大于则更新最大值，否则沿用以前的最大值，直到遍历结束，此时的最大值就是最终的结果。

对于比较，已经在 [4425-实现比较](/medium/4425-实现比较.md) 题目中实现过了。此处可以直接拿来用。

而为了记录最大值，需要引入一个辅助泛型进行记录。

## 题解

```ts
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

type Maximum<
  T extends any[],
  // 记录最大值，默认是 T[0] 或 never，处理 Maximum<[]> 的情况
  MAX extends number = T extends [] ? never : T[0],
> =
  // 遍历元组
  T extends [infer F extends number, ...infer R]
    ? // 如果当前元素大于 MAX
      GreaterThan<F, MAX> extends true
      ? // 更新 MAX
        Maximum<R, F>
      : // 否则沿用以前的 MAX
        Maximum<R, MAX>
    : // 遍历结束，返回 MAX
      MAX;
```


## 考虑负数情况

其实考虑负数无非就是多个判断，可以使用辅助类型判断是否是负数

```ts
type IsNegative<T extends number> = `${T}` extends `-${infer A extends number}` ? true : false
```

负数判断了，当然也需要提取负数了

```ts
type GetNegative<T extends number> = `${T}` extends `-${infer A extends number}` ? A : T
```


两个数判断无非就是四种情况，假设两个数分别为 `A` 和 `B`
 - `A >= 0` 且 `B >= 0` , 谁对应构造的数组的长度越小，值就越小
 - `A >= 0` 且 `B < 0`  , 这两个只判断正负数情况，正数当然大于负数了，直接返回 `A`
 - `A < 0`  且 `B >= 0` , 这两个只判断正负数情况，正数当然大于负数了，直接返回 `B`
 - `A < 0`  且 `B < 0`  , 谁对应构造的数组的长度越小，值就越大


 为了简化上面四种情况，可以使用辅助类型

 ```ts
type Max<A extends number, B extends number> =
  IsNegative<A> extends true
  ? IsNegative<B> extends true
  // A < 0 , B < 0
  ? Compare<GetNegative<A>, GetNegative<B>, true, A, B> 
  // A <0 ,B >= 0
  : B
  : IsNegative<B> extends true ? 
  // A >= 0 ,B < 0
  A : 
  // A >=0 ,B >= 0
  Compare<A, B>
 ```


 其中 `Compare` 是比较两个大小的辅助类型，另外考虑到比较大小时候使用的是绝对值，但是返回还是一个负数，
 所以需要一个变量保存原始值
 字段说明
 - `A` 第一个数绝对值 
 - `B` 第二个数绝对值
 - `isAllNegative` 两个数是否均为负数，默认为 `false`
 - `A1` 是 `A` 的原始值，如果是正数 `A = 100`，`A1 = 100`,如果是负数 `A = 100`，`A1 = -100`
 - `B1` 与 `B` 同 `A1` 与 `A`的关系
 - `C` 是一个空数组，通过递归方式增加 `C` 长度，当 `C extends A | B` 退出，说明遇到一个比较小的长度了。

```ts
type Compare<A extends number, B extends number, isAllNegative extends boolean = false, A1 extends number = A, B1 extends number = B, C extends any[] = []> =
  C['length'] extends A | B ?
  C['length'] extends A ? isAllNegative extends true ? A1 : B1 : isAllNegative extends true ? B1 : A1
  : Compare<A, B, isAllNegative, A1, B1, [...C, unknown]>
```


所以最终结果为
```ts

type IsNegative<T extends number> = `${T}` extends `-${infer A extends number}` ? true : false


type GetNegative<T extends number> = `${T}` extends `-${infer A extends number}` ? A : T

type Compare<A extends number, B extends number, isAllNegative extends boolean = false, A1 extends number = A, B1 extends number = B, C extends any[] = []> =
  C['length'] extends A | B ?
  C['length'] extends A ? isAllNegative extends true ? A1 : B1 : isAllNegative extends true ? B1 : A1
  : Compare<A, B, isAllNegative, A1, B1, [...C, unknown]>

type Max<A extends number, B extends number> =
  IsNegative<A> extends true
  ? IsNegative<B> extends true
  // A < 0 , B < 0
  ? Compare<GetNegative<A>, GetNegative<B>, true, A, B> : B
  : IsNegative<B> extends true ? A : Compare<A, B>

type Maximum<T extends number[], M extends number = T[0], First extends boolean = true> =
  T['length'] extends 0 ? (
    First extends true ? never : M
  ) :
  T extends [infer A extends number, ...infer B extends number[]] ?
  Maximum<B, Max<A, M>, false> : M

```

测试
```ts
type arr0 = Maximum<[]> // never
type arr1 = Maximum<[-1, 20, -200, -150]> // 20
type arr2 = Maximum<[-1, -20, -200, -150]> // -1
type arr3 = Maximum<[1, 20, 200, -150]> // 200
type arr4 = Maximum<[0, -1]> // 0
type arr5 = Maximum<[-1, 1]> // 1
```

嗯……，比较结果没问题，说明没啥问题，是不是OK了？

NO！看图

![数组长度溢出，递归过深](https://cdn.staticaly.com/gh/wuxin0011/blog-resource@main/vue-page/num-is-long.png)

上面两个数值大小是通过转换对应数组，通过数组长度来比较的，使用的是递归增长数组长度

万一数值较大，递归深度过大，会出现栈溢出问题，[了解更多栈溢出问题](../extreme/274-%E6%95%B4%E6%95%B0%E6%AF%94%E8%BE%83%E5%99%A8.md)



## 优化


**转换成字符串后比较**

1. 相同，返回两个中任意一个。
2. 均为正数
    - 长度不同，转换成字符串比较，谁的长度大，值就越大。
    - 同长度，将各个字符对应值，从左到右逐一比较，同位置字符对应数字越大，对应值越大。
3. 一正一负 直接返回正数。
4. 均为负数
    - 长度不同，转换成字符串,谁的长度小，值就越大
    - 同长度，将各个字符对应值，从左到右逐一比较，同位置字符对应数字越小，对应值越大小。

    

**为什么需要转换成字符串？**

当数字值越大时，递归深度就越大，出现栈溢出。

**转换成字符串有什么好处？**

只比较长度，不会存在深度递归，同长度情况下，可以从左到右逐一比对，由于比较的是单个数字，这种情况下最大也是9，不会存在深度递归问题，栈溢出问题也就迎刃而解了。


```ts

// 辅助类型

// 数字转换成字符串
type NumToString<T extends number> = `${T}`
// 获取字符串长度
type GetStringLen<T extends string, U extends any[] = []> = T extends `${infer L}${infer R}` ? GetStringLen<R, [...U, L]> : U['length']
// 返回较小数字
type GetMinNumber<A extends number, B extends number, L extends any[] = []> = L['length'] extends A | B ? L['length'] extends A ? A : B : GetMinNumber<A, B, [...L, -1]>
// 返回较大值 A B 属于 0-9 A1 B1 为原始值
type GetMaxNumber<A extends number, B extends number, A1 extends number = A, B1 extends number = B, isAllNegative extends boolean = false,>
  = A extends GetMinNumber<A, B> ? isAllNegative extends true ? A1 : B1 : isAllNegative extends true ? B1 : A1

// 判断是否是负数
type IsNegative<T extends number> = `${T}` extends `-${infer A extends number}` ? true : false

// 获取绝对值
type GetNegative<T extends number> = `${T}` extends `-${infer A extends number}` ? A : T


// 优化后主要是针对 S1 和 S2 两个字符串比较的
type Compare<
  A extends number,
  B extends number,
  isAllNegative extends boolean = false,
  A1 extends number = A,
  B1 extends number = B,
  S1 extends string = NumToString<A>,
  S2 extends string = NumToString<B>
> =
   // A1 === B1 直接退出
   A1 extends B1 ? A1
   :
   // 比较两个字符串长度
  GetStringLen<S1> extends GetStringLen<S2>?
  (
    S1 extends `${infer L1 extends number}${infer R1}` 
    ? S2 extends `${infer L2 extends number}${infer R2}`
    // 比较单个字符串对应数字情况
    ? L1 extends L2 ?
    // 相等递归 此时字符串长度相较上一次长度减一，
    Compare<A, B, isAllNegative, A1, B1, R1, R2> :
    // 不相等话比较数字大小
    GetMaxNumber<L1, L2, A1, B1, isAllNegative>
    // 对比到此处说明 A1 === B1 所以任意返回一个值就行了，不过前面判断了
    : never : never
  ) 
  : 
  (
    // 转换成字符串后长度不相等
    GetStringLen<S1> extends GetMinNumber<GetStringLen<S1>, GetStringLen<S2>> ?
    // S1 长度小于 S2
    isAllNegative extends false ? B1 : A1 :
    // S1长度大于 S2
    isAllNegative extends false ? A1 : B1
  )

type Max<A extends number, B extends number> =
IsNegative<A> extends true
? IsNegative<B> extends true
// A < 0 , B < 0
? Compare<GetNegative<A>, GetNegative<B>, true, A, B> : B
: IsNegative<B> extends true ? A : Compare<A, B>


// 答案
type Maximum<T extends number[], M extends number = T[0], First extends boolean = true> =
T extedns [] ?
First extends true ? never : M 
:T extends [infer A extends number, ...infer B extends number[]] ? Maximum<B, Max<A, M>, false> : M
```

测试

```ts
// test NumToString
type N1 = NumToString<100>
type N2 = NumToString<20>

// test GetStringLen
type S1 = GetStringLen<N1> // 3
type S2 = GetStringLen<N1> // 2

// test  GetMaxNumber
type G1 = GetMaxNumber<1, 2, 100, 200> // 200
type G2 = GetMaxNumber<1, 2, 100, 200>  // 200
type G3 = GetMaxNumber<2, 1, -200, -100, true> // -100
type G4 = GetMaxNumber<1, 2, -100, -200, true> // -100

//test Max
type A1 = Max<30000000, 20000000> // 30000000
type A2 = Max<20000000, 30000000> // 30000000
type B1 = Max<0, 100000000> // 100000000
type B2 = Max<100000000, 0> // 100000000
type C1 = Max<-10000000000, -20000000000> // -10000000000
type C2 = Max<-20000000000, -10000000000> // -10000000000
type D1 = Max<-20000000, -10000000000000> // -20000000
type D2 = Max<-10000000000000, -20000000> // -20000000
type E1 = Max<-30000000, -30000000> // -30000000
type E2 = Max<-3000000000000, -3000000000000> // -3000000000000

// test Maximum
type arr0 = Maximum<[]> // never
type arr1 = Maximum<[-100000, -2000000, -2000000, -150000000]> // -100000
type arr2 = Maximum<[-10, -200000, -2000, -1500000000]> // -10
type arr3 = Maximum<[100000000, 20000, 20000, -150000]> // 100000000
type arr4 = Maximum<[0, -1]> // 0
type arr5 = Maximum<[-1, 1]> // 1
```

**总结**

看似题目写的有点多，理清思路，对于复杂类型，要多使用辅助类型，将复杂问题单元化，还能清晰类型结构，毕竟写在一个类型，光 `?` 和 `:` 就能把人整迷糊。





## 知识点

1. 同 [4425-实现比较](/medium/4425-实现比较.md)。
