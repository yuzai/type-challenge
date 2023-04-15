---
title: 5821-MapTypes
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

Implement `MapTypes<T, R>` which will transform types in object T to different types defined by type R which has the following structure

```ts
type StringToNumber = {
  mapFrom: string; // value of key which value is string
  mapTo: number; // will be transformed for number
}
```

## Examples:

```ts
type StringToNumber = { mapFrom: string; mapTo: number;}
MapTypes<{iWillBeANumberOneDay: string}, StringToNumber> // gives { iWillBeANumberOneDay: number; }
```

Be aware that user can provide a union of types:
```ts
type StringToNumber = { mapFrom: string; mapTo: number;}
type StringToDate = { mapFrom: string; mapTo: Date;}
MapTypes<{iWillBeNumberOrDate: string}, StringToDate | StringToNumber> // gives { iWillBeNumberOrDate: number | Date; }
```

If the type doesn't exist in our map, leave it as it was:
```ts
type StringToNumber = { mapFrom: string; mapTo: number;}
MapTypes<{iWillBeANumberOneDay: string, iWillStayTheSame: Function}, StringToNumber> // // gives { iWillBeANumberOneDay: number, iWillStayTheSame: Function }
```

## 分析

这个题目本质是替换 T 中的某些属性，从 mapFrom 替换到 mapTo，题目中 第二个参数的输入可以是联合类型。

遇到这种问题，可以先不考率联合类型，仅仅实现非联合下，其实是比较简单的，只需要遍历对象，判断其属性值是否是 mapFrom 类型的，如果是，则替换成 mapTo 即可。可以写出如下代码：

```ts
type MapTypesV1<T, R extends { mapFrom: any, mapTo: any }> = {
    [P in keyof T]:
        // 判断是否和 R['mapFrom'] 相同，此处仅仅是简单判断，严格判断可以参考 Equal 章节
        T[P] extends R['mapFrom']
        ? R['mapTo']
        : T[P]
}
```

那么加上联合类型后，问题在哪里呢？

可以看看如下 case:

```ts
/*
type Case1 = {
    name: string | boolean;
    date: string | boolean;
}
*/
type Case1 = MapTypesV1<{ name: string; date: Date }, { mapFrom: string; mapTo: boolean } | { mapFrom: Date; mapTo: string }>

// string | boolean
type Case2 = ({ mapFrom: string; mapTo: boolean } | { mapFrom: Date; mapTo: string })['mapTo'];
```

想要把 R 从联合类型拆开，可以借助其分发特性：

```ts
type Split<R extends { mapFrom: string; mapTo: number; }> =
    R['mapFrom'] extends string
    ? R['mapTo']
    : never

// { mapFrom: string; mapTo: boolean } extends string 是 true，返回 R['mapTo'] = boolean
// { mapFrom: Date; mapTo: string } extends string 是 false，返回 never
// boolean | never = boolean
type Case3 = Split<{ mapFrom: string; mapTo: boolean } | { mapFrom: Date; mapTo: string }>;
```

综上，只需要在 `T[P] extends R['mapFrom']` 后，再次分发 `R['mapFrom'] extends T[P] ? R['mapTo'] : never` 即可得到目标结果。

## 题解

```ts
type MapTypes<T, R extends {'mapFrom': any, 'mapTo': any}> = {
  [P in keyof T]:
    T[P] extends R['mapFrom']
    ? R extends { mapFrom: T[P] }
        ? R['mapTo']
        : never
    : T[P];
};
```

## 知识点

1. 对象遍历套路
2. 联合类型的分发特性


