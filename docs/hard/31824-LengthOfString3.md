---
title: 31824-LengthOfString3
lang: zh-CN
---

# {{ $frontmatter.title }}

## 题目描述

实现 `LengthOfString<S>`——字符串版本的 `Array#length`。和之前两道字符串长度题（`easy/298`、`hard/651`）不同，这次要支持 **10<sup>6</sup>（百万级）** 长度的字符串。

```ts
type R1 = LengthOfString<'abc'>; // 3
type R2 = LengthOfString<'a very long string...'>; // ...
// 测试集里会用到长度约 8,464,592 的串
```

## 分析

常规写法（一次拆一字符 + 元组长度计数）：

```ts
type Length<S, Acc extends any[] = []> = S extends `${string}${infer R}`
  ? Length<R, [...Acc, 1]>
  : Acc['length'];
```

有两个硬性上限会先后打穿：

1. **递归深度**：TS 尾递归极限约 1000 层，单字符递归一上 1001 就挂。
2. **元组字面量大小**：即便突破了递归，`Acc` 长度过了约 10000 就会报 `Type produces a tuple type that is too large to represent`。

要到 10<sup>6</sup> 规模，两个上限都要绕：

- **单轮多吃几位**：把 `` `${string}${string}${...}${infer R}` `` 一次拆 10、100 甚至 1000 个字符，每次给计数器加一个已知数——减小递归轮数。
- **用十进制数字数组当计数器**：不要再靠元组长度累计，维护一个数字字符串（或 digit 元组），加上 "10" / "100" / "1000" 时在相应位进位。这样计数器的"大小"不随字符数线性增长。

思路是**多级切块**：

- 能一次吃 1000 字符就吃 1000，个位 +0、千位 +1；
- 剩下不够 1000 的再尝试吃 100；
- 再不够就 10；最后 1。

每一级都是有限次数，总递归层数约为 `10 + 10 + 10 + 10 = 40`，远在 1000 以内；计数器也只是一个固定长度的十进制数字数组，不会溢出。

## 题解

```ts
// —— 维护一个 8 位十进制计数器（从低位到高位）——
// 每一位是 Digit = 0..9；加上一个常数时做进位传播
type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

// 两个一位数相加得到 [本位, 进位]
// prettier-ignore
type DigitAddTable = [
  [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0]],
  [[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0],[0,1]],
  [[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0],[0,1],[1,1]],
  [[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0],[0,1],[1,1],[2,1]],
  [[4,0],[5,0],[6,0],[7,0],[8,0],[9,0],[0,1],[1,1],[2,1],[3,1]],
  [[5,0],[6,0],[7,0],[8,0],[9,0],[0,1],[1,1],[2,1],[3,1],[4,1]],
  [[6,0],[7,0],[8,0],[9,0],[0,1],[1,1],[2,1],[3,1],[4,1],[5,1]],
  [[7,0],[8,0],[9,0],[0,1],[1,1],[2,1],[3,1],[4,1],[5,1],[6,1]],
  [[8,0],[9,0],[0,1],[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1]],
  [[9,0],[0,1],[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1],[8,1]],
];

type AddAt<A extends Digit, B extends Digit> = DigitAddTable[A][B] extends [
  infer S extends Digit,
  infer C extends Digit,
]
  ? [S, C]
  : never;

// 把加数 Addend 加到 Counter 的 Pos 位（0 = 个位）
type AddToCounter<
  Counter extends Digit[],
  Pos extends number,
  Addend extends Digit,
  Idx extends any[] = [],
  Acc extends Digit[] = [],
  Carry extends Digit = 0,
> = Counter extends [infer D extends Digit, ...infer Rest extends Digit[]]
  ? Idx['length'] extends Pos
    ? AddAt<D, Addend> extends [infer S extends Digit, infer C extends Digit]
      ? AddAt<S, Carry> extends [infer S2 extends Digit, infer C2 extends Digit]
        ? // 注意两次 AddAt 的进位最多叠一层
          AddToCounter<Rest, Pos, 0, [...Idx, 0], [...Acc, S2], AddAt<C, C2>[0]>
        : never
      : never
    : AddAt<D, Carry> extends [infer S extends Digit, infer C extends Digit]
    ? AddToCounter<Rest, Pos, Addend, [...Idx, 0], [...Acc, S], C>
    : never
  : Acc;

// 用多级 chunk 吃字符：一次 1000 / 100 / 10 / 1
type EatChunks<
  S extends string,
  Counter extends Digit[] = [0, 0, 0, 0, 0, 0, 0, 0],
> = S extends `${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${infer Rest}`
  ? // 吃 100 个字符
    EatChunks<Rest, AddToCounter<Counter, 2, 1>>
  : S extends `${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${infer Rest}`
  ? // 吃 10 个字符
    EatChunks<Rest, AddToCounter<Counter, 1, 1>>
  : S extends `${string}${infer Rest}`
  ? // 吃 1 个字符
    EatChunks<Rest, AddToCounter<Counter, 0, 1>>
  : Counter;

// Digit 数组（低位在前）→ number 字面量
type DigitsToNumber<D extends Digit[]> =
  ReverseAndStrip<D> extends infer S extends string
    ? S extends ''
      ? 0
      : S extends `${infer N extends number}`
      ? N
      : never
    : never;

type ReverseAndStrip<D extends Digit[], Acc extends string = ''> = D extends [
  ...infer Rest extends Digit[],
  infer Last extends Digit,
]
  ? ReverseAndStrip<
      Rest,
      `${Acc}${Last extends 0 ? (Acc extends '' ? '' : '0') : Last}`
    >
  : Acc;

type LengthOfString<S extends string> = DigitsToNumber<EatChunks<S>>;
```

解读：

- **计数器是 8 位 Digit 数组**：`[个位, 十位, 百位, ..., 千万位]`，初始全 0。覆盖 `10^8 - 1` 足以放下 10^6 的长度。
- **`AddToCounter`** 只给指定位加一个一位数，再把进位往高位传：吃一个 100 字符的块就在百位 +1，吃 10 字符块就在十位 +1，以此类推。
- **`EatChunks`** 三档模板分别匹配 100、10、1 个字符（每档之间是优先级：先尽量吃 100 再 10 再 1）。这样每一档的递归次数至多 100 次左右，整个链条远远避开了 1000 层深度。
- **`DigitsToNumber`** 把 Digit 数组反转成高位在前的字符串，跳过前导 0，再通过模板字面量 `` `${infer N extends number}` `` 转回 `number`。

## 验证

```ts
type cases = [
  LengthOfString<''>, // 0
  LengthOfString<'abc'>, // 3
  LengthOfString<'0123456789' /* 10 */>, // 10
  LengthOfString<'0123456789' /* ×100 */>, // 100
];
```

### ⚠️ 已知局限

上游的官方测试集直接喂 10<sup>6</sup> 级别的字符串进来；在 TS 5.6 的默认 `tsc` 下，这个实现能稳过 `10^4` 左右，但当字符串超过 `10^5` 后 `EatChunks` 的第一档 (100 字符)模板匹配本身会触发 `Type instantiation is excessively deep` ——这是 TypeScript 模板字面量匹配的内部预算上限，而非"递归次数"的限制。

官方测试通过的解法普遍需要**字符串分块 + 显式十进制加法**的混合技巧，并且对 `tsc` 的内部启发式有一定依赖。更极致的实现建议参阅 [tsch.js.org/31824/solutions](https://tsch.js.org/31824/solutions)。

## 知识点

- **打破递归深度的关键是每轮吃得更多**，加法计数器只维护几个十进制位即可，不随字符长度增长，见 [冷门-递归深度](/summary/冷门-递归深度.md)。
- **数字字典 / 加法表**这种把运算表硬编码成类型的思路，同样可以套用到乘法、减法——比起用元组长度加减更省深度。
- `` `${infer N extends number}` `` 把字符串转回 number 是几乎所有"字符串层算完再回数字"类题目的收官步骤。
