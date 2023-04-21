---
title: 1290-pinia
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

Create a type-level function whose types is similar to [Pinia](https://github.com/posva/pinia) library. You don't need to implement function actually, just adding types.

### Overview

This function receive only one parameter whose type is an object. The object contains 4 properties:

- `id` - just a string (required)
- `state` - a function which will return an object as store's state (required)
- `getters` - an object with methods which is similar to Vue's computed values or Vuex's getters, and details are below (optional)
- `actions` - an object with methods which can do side effects and mutate state, and details are below (optional)

### Getters

When you define a store like this:

```typescript
const store = defineStore({
  // ...other required fields
  getters: {
    getSomething() {
      return 'xxx'
    }
  }
})
```

And you should use it like this:

```typescript
store.getSomething
```

instead of:

```typescript
store.getSomething()  // error
```

Additionally, getters can access state and/or other getters via `this`, but state is read-only.

### Actions

When you define a store like this:

```typescript
const store = defineStore({
  // ...other required fields
  actions: {
    doSideEffect() {
      this.xxx = 'xxx'
      return 'ok'
    }
  }
})
```

Using it is just to call it:

```typescript
const returnValue = store.doSideEffect()
```

Actions can return any value or return nothing, and it can receive any number of parameters with different types.
Parameters types and return type can't be lost, which means type-checking must be available at call side.

State can be accessed and mutated via `this`. Getters can be accessed via `this` but they're read-only.

## 分析

这个题目也是比较贴合实际的（不过不熟悉 pinia 的人就麻烦点了，题目都得理解半天）。

其实和 [6-SimpleVue](/hard/6-SimpleVue.md) 非常类似，本质也是在 actions 和 getter 中注入 this 即可。

不过这里需要注意的是，根据用例：getter 映射后的值是不可更改，同时 state 中的值在 getter 中也是不可更改的。具体规则建议直接看用例。

## 题解

```ts
// 转换 getters，取出返回值，并增加 readonly 标签
type TransGetters<T> = {
  readonly [P in keyof T]:
    T[P] extends (...args: any[]) => infer R
    ? R
    : never;
}

type Options<D, G, A> = {
  id: string,
  state: (this: null) => D,
  // getters 中的 this 可以访问 只读的state 和自身的返回值类型
  getters: G & ThisType<Readonly<D> & TransGetters<G>>;
  // actions 中的 this 可以访问 state，自身，和 getter 的返回值类型
  actions: A & ThisType<D & A & TransGetters<G>>,
}

declare function defineStore<D, G, A>(store: Options<D, G, A>):
  // 返回值可以直接访问 state ，和 getter 的返回值类型 以及 action 和 init 方法
  D & TransGetters<G> & A & {init: () => void}
```

## 知识点

1. 比较贴合实际，本质和前几道 vue 相关的题目没有太大区别,掌握 this 和 ThisType 用法对着用例分析即可