---
title: 6-SimpleVue
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

实现类似 Vue 的类型支持的简化版本。

通过提供一个函数`SimpleVue`（类似于`Vue.extend`或`defineComponent`），它应该正确地推断出 computed 和 methods 内部的`this`类型。

在此挑战中，我们假设`SimpleVue`接受只带有`data`，`computed`和`methods`字段的 Object 作为其唯一的参数，

- `data`是一个简单的函数，它返回一个提供上下文`this`的对象，但是你无法在`data`中获取其他的计算属性或方法。

- `computed`是将`this`作为上下文的函数的对象，进行一些计算并返回结果。在上下文中应暴露计算出的值而不是函数。

- `methods`是函数的对象，其上下文也为`this`。函数中可以访问`data`，`computed`以及其他`methods`中的暴露的字段。 `computed`与`methods`的不同之处在于`methods`在上下文中按原样暴露为函数。

`SimpleVue`的返回值类型可以是任意的。

```ts
const instance = SimpleVue({
  data() {
    return {
      firstname: 'Type',
      lastname: 'Challenges',
      amount: 10,
    };
  },
  computed: {
    fullname() {
      return this.firstname + ' ' + this.lastname;
    },
  },
  methods: {
    hi() {
      alert(this.fullname.toLowerCase());
    },
  },
});
```

## 分析

不知道有没有小伙伴觉得看到这道题时的内心 os: 没想到之前做的那么多题目，都是虚的，这题好像没思路啊。

其实也仅仅是这道题目啦。后续的 hard 题，很不幸，也有很多之前没有接触过的知识点。

而这题的关键在于 `this`。

这确实是之前的题目中所遗漏的知识点。

不过，现代 react 开发的普通业务开发中，用到 this 的地方可以说是少之又少。

相关的文档在官网有：[函数中的 this](https://www.typescriptlang.org/docs/handbook/2/functions.html#declaring-this-in-a-function), [ThisType 辅助工具](https://www.typescriptlang.org/docs/handbook/utility-types.html#thistypetype)。

主要就是在函数中注入 this，和给现有对象注入 this，使用示例如下：

```ts
// 注入 this 示例
// 如果不注入 this，this.a, this.b 就会报错
// 因为 window 上面并不存在
function F(this: { a: string; b: string }) {
  return this.a + this.b;
}
```

而 ThisType 的使用更为简单，一般是用在给对象中注入 this。

```ts
// 定义一个对象
type Test = {
  f1(): string;
} & ThisType<{
  a: string;
  b: string;
}>;

const Case1: Test = {
  f1() {
    // 在这个对象中的函数可以使用 this
    return this.a + this.b;
  },
};
```

具体到实际中的场景(其实不太多了，用 this 的地方都不多其实)，就是题目中的场景。

了解了 `ThisType` 和 `this`，这题基本上就可以做出来了，可以直接看题解。

## 题解

```ts
declare function SimpleVue<D, C, M>(options: {
  // 在这个函数中，this 为 空，返回值为泛型 D
  data: (this: void) => D;
  // 返回值依赖泛型 C，并在 C 中，可以在 this 中使用 D
  computed: C & ThisType<D>;
  // 返回值依赖泛型 M，并在 M 中，可以在 this 中使用 D 和自身以及 computed 中函数的返回值类型
  methods: M &
    ThisType<
      D &
        M & {
          // 提取 计算属性的返回值类型
          [P in keyof C]: C[P] extends (...args: any[]) => infer R ? R : never;
        }
    >;
}): any;
```

这一题还是涉及到了不少函数相关的泛型，在这种情况下，遇到返回值不确定，但是其他地方又需要用到的地方，就可以考虑定义泛型。

比如 data，不确定但是其他地方要用的，是这个 data 函数的返回值，所以定义了泛型 D。

而 computed，全部不确定（仅仅能确定的是是一个对象类型），但是 methods 中需要用到，所以直接定义泛型 C。

而 methods，自身用到了自身，所以定义泛型 M。

这些泛型在实际的使用中，一方面，可以根据用户的入参得到隐式的类型推断，从而给使用者友好的类型提示，另一方面，使用者也可以直接传入 D, C, M 来进行约束，前者对使用者更为友好。

## 知识点

1. [ThisType 辅助工具](https://www.typescriptlang.org/docs/handbook/utility-types.html#thistypetype)
2. [函数中的 this](https://www.typescriptlang.org/docs/handbook/2/functions.html#declaring-this-in-a-function)

觉得困难的话，可以再看看官方的[关于函数的章节](https://www.typescriptlang.org/docs/handbook/2/functions.html#handbook-content)。
