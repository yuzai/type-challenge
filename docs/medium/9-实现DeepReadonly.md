---
title: 9-实现DeepReadonly
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

实现一个通用的`DeepReadonly<T>`，它将对象的每个参数及其子对象递归地设为只读。

您可以假设在此挑战中我们仅处理对象。数组，函数，类等都无需考虑。但是，您仍然可以通过覆盖尽可能多的不同案例来挑战自己。

例如

```ts
type X = { 
  x: { 
    a: 1
    b: 'hi'
  }
  y: 'hey'
}

type Expected = { 
  readonly x: { 
    readonly a: 1
    readonly b: 'hi'
  }
  readonly y: 'hey' 
}

type Todo = DeepReadonly<X> // should be same as `Expected`
```

## 分析

这题是 [实现readonly](/easy/7-%E5%AE%9E%E7%8E%B0Readonly.md) 的深度遍历版，理论上只需要在原来的基础上增加递归处理嵌套即可。

```ts
type DeepReadonly<T> = {
    readonly [P in keyof T]: T[P] extends {} ? DeepReadonly<T[P]> : T[P];
}
```

通过 `T[P] extends {} ? DeepReadonly<T[P]> : T[P]` 对属性值进行二次判断，如果是继承自 对象，那么就递归处理，否则返回原始属性值。

理论上这样就能够结束本题目，但是还存在两个特殊场景，元组和函数，都继承自对象 `{}`。

```ts
type Case1 = [] extends {} ? true : false; // true
type Case2 = (() => {}) extends {} ? true : false; // true
```

对于元组，之前其实也比较隐晦的提到过，元组的遍历，可以通过和对象一摸一样的遍历手段进行：

```ts
type Traverse<T> = {
    [P in keyof T]: T[P]
}

type Case3 = Traverse<[1, 2, 3]> // [1, 2, 3]
```

元组的遍历就是这样，同对象一样，也可以增加 `readonly` 等修饰符。故这一场景可以忽略。

但是对于函数来讲，就出现了错误：

```ts
type DeepReadonly<T> = {
    readonly [P in keyof T]: T[P] extends {} ? DeepReadonly<T[P]> : T[P];
}

// Case4 = {}
type Case4 = DeepReadonly<() => {}>

// Case5 = never
type Case5 = keyof (() => {})
```

对于函数执行遍历，那么由于 `keyof (() => {})` 是 `never`，新的类型的属性就为空，从而返回 `{}`。

所以对于此题，只需要增加函数的额外处理即可。

## 题解

```ts
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends Function ? T[P] : T[P] extends {} ?  DeepReadonly<T[P]> : T[P]
}
```

增加函数的场景判断即可。

## 知识点

1. [readonly](/easy/7-%E5%AE%9E%E7%8E%B0Readonly.md)
2. 递归处理嵌套问题
3. 元组可以使用遍历对象的方法进行遍历
4. `(() => {}) extends {}` 结果为 true
