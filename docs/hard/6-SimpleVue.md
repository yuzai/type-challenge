---
title: 6-SimpleVue
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

实现类似Vue的类型支持的简化版本。

通过提供一个函数`SimpleVue`（类似于`Vue.extend`或`defineComponent`），它应该正确地推断出 computed 和 methods 内部的`this`类型。

在此挑战中，我们假设`SimpleVue`接受只带有`data`，`computed`和`methods`字段的Object作为其唯一的参数，

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
    }
  },
  computed: {
    fullname() {
      return this.firstname + ' ' + this.lastname
    }
  },
  methods: {
    hi() {
      alert(this.fullname.toLowerCase())
    }
  }
})
```

## 分析

不知道有没有小伙伴觉得看到这道题并无思路，没想到之前做的那么多题目，都是虚的。

其实也仅仅是这道题目啦。后续的 hard 题并不见得有这种感觉。而且这题的关键在于 `this`。

这确实是之前的题目中所遗漏的知识点。

相关的文档在官网有：[函数中的 this](https://www.typescriptlang.org/docs/handbook/2/functions.html#declaring-this-in-a-function), [ThisType辅助工具](https://www.typescriptlang.org/docs/handbook/utility-types.html#thistypetype)。

主要就是在函数中注入 this，和给现有函数注入 this，使用示例如下：

```ts
// type F1 = (this: { a: string, b: string}) => string;

// const fn: F1 = () => this.a + this.b;
```

## 题解

## 知识点