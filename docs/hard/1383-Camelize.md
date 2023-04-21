---
title: 1383-Camelize
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

实现 Camelize 类型: 将对象属性名从 蛇形命名(下划线命名) 转换为 小驼峰命名

```ts
Camelize<{
  some_prop: string, 
  prop: { another_prop: string },
  array: [{ snake_case: string }]
}>

// expected to be
// {
//   someProp: string, 
//   prop: { anotherProp: string },
//   array: [{ snakeCase: string }]
// }
```

## 分析

这种题目之前也遇到不少，比如 [114-CamelCase](/hard/114-CamelCase.md)。

只是这一题是上一题的升级版，需要对对象的属性值进行操作，而不是直接对字符操作。

借助 as 即可修改属性，套用 [114-CamelCase](/hard/114-CamelCase.md) 的解法即可。

```ts
type Camelize<T> = {
  [P in keyof T as CamelCase<P & string>]:
    // 递归处理对象属性
    T[P] extends {}
      ? Camelize<T[P]>
      : T[P]
}
```

但是上述解法在面对元组元素的时候，就会出现问题：

```ts
type cases = [
  Expect<Equal<
    Camelize<{
      some_prop: string
      prop: { another_prop: string }
      // 不能正确处理元组类型
      array: [
        { snake_case: string },
        { another_element: { yet_another_prop: string } },
        { yet_another_element: string },
      ]
    }>,
    {
      someProp: string
      prop: { anotherProp: string }
      array: [
        { snakeCase: string },
        { anotherElement: { yetAnotherProp: string } },
        { yetAnotherElement: string },
      ]
    }
  >>,
]
```

所以还需要对元组进行遍历，每一个元素都进行一次递归处理即可。

## 题解

```ts
// [114-CamelCase](/hard/114-CamelCase.md)
type CamelCaseF<
  S extends string,
  // 辅助字符，存储 _ 之前遇到的字符
  W extends string = ''
> =
  S extends `${infer F}${infer R}`
  // 如果是 _
  ? F extends '_'
    // 处理 _ 之前的的字符 W, 并递归剩余字符，重置 W
    ? `${Capitalize<Lowercase<`${W}`>>}${CamelCaseF<R>}`
    // 否则，递归剩余字符，将 F 存储 W 中
    : `${CamelCaseF<R, `${W}${F}`>}`
  // 遍历结束，取出最后一次的字符进行处理
  : Capitalize<Lowercase<`${W}`>>;

// 单独处理掉第一个字符的小写
type CamelCase<S extends string> = Uncapitalize<CamelCaseF<S>>;

type ObjCamelize<T> = {
  [P in keyof T as CamelCase<P & string>]:
    T[P] extends {}
      ? Camelize<T[P]>
      : T[P]
}

type TupleCamelize<T> =
  // 遍历元组
  T extends [infer F, ...infer R]
  // 每一个元素进行递归处理
  ? [Camelize<F>, ...Camelize<R>]
  : [];

type Camelize<T> =
  // 判断是不是元组
  T extends any[]
  // 元组则进行遍历，并递归处理每一个元素
  ? TupleCamelize<T>
  // 否则执行对象属性的处理
  : ObjCamelize<T>
```

这里其实还缺失了对函数的判断，`Function extends {}` 是 true，如果是函数，则需要直接返回，而不是继续递归，不过用例中并没有，就不做过多讨论了。

## 知识点

1. 均是以前的知识拼凑的，看起来确实复杂一点


