---
title: 3-实现Omit
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

不使用 `Omit` 实现 TypeScript 的 `Omit<T, K>` 泛型。

`Omit` 会创建一个省略 `K` 中字段的 `T` 对象。

例如：

```ts
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

type TodoPreview = MyOmit<Todo, 'description' | 'title'>;

const todo: TodoPreview = {
  completed: false,
};
```

## 分析

Omit 是 ts 自带的一个工具类，其原本的内部实现如下：

```ts
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
```

可以看到，想要在 T 中忽略某些属性，其实就是从 T 中，获取排除了这些属性后的类型即可，所以官方的实现借助了 [Exclude](/easy/43-实现Exclude.md) 和 [Pick](/easy/4-实现Pick.md)，当然之前我们也自己实现过。

但是能不能不借助其他辅助工具实现呢？

答案也是可以的，从道理上来讲，我们可以遍历一遍对象，判断他的键值是否是要忽略的键值，如果是，就把他剔除掉，否则，就保留。

我们的遍历方法如下：

```ts
type MyOmit<T, K> = {
  [P in keyof T]: T[P];
};
```

但是问题来了，能够在哪里加上忽略某些键值的逻辑呢？

这里需要介绍 [`as` 操作符](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions)，其中文名是类型断言，说白了就是强制指定一个类型为另一个类型，也可以说是指鹿为马，比如如下代码：

```ts
// a 的类型就是 string，当然，这里只是一个演示，实际 ts 会报错的哈
const a = 1 as string;

// 不报错的合理写法
const a = 1 as unknown as string;
```

在实际工作中一般用来做 fix，本质就是强制类型转换，强制指定一个类型为另一个类型。

那么和这里有什么关系呢？别急，看一下如下的类型声明：

```ts
type Copy<T> = {
  // 强制声明键值为 never
  [P in keyof T as never]: T[P];
};

// Case1 = {};
type Case1 = Copy<{ a: 1; b: 2 }>;
```

通过强制声明键值为 never，其结果就是该键值就会被忽略掉。到这一步了，题解也呼之欲出，只需要判断当前键值是否是目标键值的一员，如果是，就忽略掉。

## 题解

```ts
type MyOmit<T, K extends keyof T> = {
  [P in keyof T as P extends K ? never : P]: T[P];
};
```

其核心就是利用 `as` 强制转换键值类型，又借助条件表达式将符合条件的键值改为 never，从而达到目标。

## 知识点

1. 对象遍历的方式： `{ [P in keyof T]: T[P] }`
2. `as` 表达式在对象遍历时的用途
3. 条件表达式写法
