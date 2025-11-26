# Two Sum（两数之和）笔记

## 题目描述（简短）
给定整数数组 `nums` 和目标值 `target`，找出数组中两个数之和等于 `target` 的两个下标（0-based）。通常题目保证恰好存在一组解，且不能重复使用同一个元素。

示例：
- 输入：`nums = [2,7,11,15]`, `target = 9`
- 输出：`[0,1]` 因为 `nums[0] + nums[1] == 9`

---

## 核心思路与常用解法

### 1) 暴力枚举（Brute Force）
- 思路：双重循环枚举所有 `i < j` 的配对，检查是否满足和为 `target`。
- 复杂度：时间 O(n^2)，空间 O(1)。
- 何时用：最直观、代码简单，作为思路说明或小数组时可用。

示例（TypeScript）：
```ts
function twoSumBrute(nums: number[], target: number): number[] {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) return [i, j];
    }
  }
  throw new Error("No solution");
}
```

---

### 2) 两遍哈希表（Two-pass Hash Map）
- 思路：第一遍把每个值和索引存入哈希表（value -> index），第二遍对每个值查找 `target - value` 是否在表中且索引不同。
- 复杂度：时间 O(n)，空间 O(n)。
- 优点：思路清晰；适合想先建表再查找的场景。

示例：
```ts
function twoSumTwoPass(nums: number[], target: number): number[] {
  const map = new Map<number, number>();
  nums.forEach((v, i) => map.set(v, i));
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    const j = map.get(need);
    if (j !== undefined && j !== i) return [i, j];
  }
  throw new Error("No solution");
}
```

---

### 3) 一遍哈希表（One-pass Hash Map）——推荐
- 思路：遍历数组，边遍历边查找：对当前值 `v`，先计算 `need = target - v`，如果 `need` 在哈希表中则找到解；否则把 `v` 插入哈希表（`value -> index`）。
- 复杂度：时间 O(n)，空间 O(n)。
- 优点：只需一次遍历，简洁高效，是面试/工程中常用写法。

示例（TypeScript）：
```ts
function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>(); // value -> index
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (map.has(need)) {
      return [map.get(need) as number, i];
    }
    map.set(nums[i], i);
  }
  throw new Error("No solution");
}
```

---

## 复杂度总结
- 暴力：时间 O(n^2)，空间 O(1)
- 哈希（两遍 / 一遍）：时间 O(n)，空间 O(n)

---

## 你给出的代码问题（重点）
你原始代码片段（带错误）：
```ts
function twoSum(nums: number[], target: number): number[] {
    for( let i = 0; i < nums.length; i++){
        for( let j = i+1; j < nums.length - 1; j++){
            if (nums[i] + nums[j] === target)
                return [i,j]
        }
    }
};
```

### 错误原因
- 内层循环的条件写成 `j < nums.length - 1`，这会使 `j` 最大只能到 `nums.length - 2`，因此**永远不会检查数组的最后一个元素（索引 `nums.length - 1`）**作为第二个数。
- 举例：`nums = [2, 3]`, `target = 5`。这里 `nums.length = 2`，`j` 从 `1` 开始，但判断 `j < 1` 为假，内层循环不执行，导致不能找到 `[0,1]`。

### 正确写法
- 把内层循环改为 `j < nums.length`（或 `j <= nums.length - 1`）：
```ts
for (let j = i + 1; j < nums.length; j++) { ... }
```

修正后的暴力实现：
```ts
function twoSum(nums: number[], target: number): number[] {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) {
        return [i, j];
      }
    }
  }
  throw new Error("No solution");
}
```

---

## 常见错误与陷阱（归纳）
1. 内层循环边界写错（如上述 `nums.length - 1` 错写）。
2. 把 `Map.get` 的返回值与 `undefined` 混淆（TypeScript/JS 中 `0` 是合法索引，需要用 `map.has` 或比较 `!== undefined`）。
3. 在循环内使用 `Array.indexOf` 或 `list.index` 会导致 O(n^2) 的复杂度（避免在循环内做线性查找）。
4. 索引基准不清（0-based vs 1-based）；LeetCode 使用 0-based。
5. 当题目未保证一定有解时，记得处理“无解”情况（返回 `[]` 或抛错，按题意）。
6. 使用对象作为 Map 键时注意是按引用比较（JS 的 Map 对象键按引用相等）。

---

## 边界测试用例（建议本地跑）
- 基本样例：
  - `[2,7,11,15], 9` -> `[0,1]`
- 重复元素：
  - `[3,3], 6` -> `[0,1]`
  - `[1,2,3,2], 4` -> 可能是 `[1,2]` 或 `[2,3]`（取决实现）
- 最后元素参与：
  - `[1,4,5], 9` -> `[1,2]`
- 负数 / 零：
  - `[-3,4,3,90], 0` -> `[0,2]`
- 没有解（若题目允许无解）：
  - `[1,2,3], 7` -> 返回 `[]` 或 抛错

---

## 面试答题建议（如何表述）
1. 复述题目并确认约束（是否保证有解、索引基准、返回格式）。
2. 先给暴力解并说明时间复杂度 O(n^2)。
3. 给出哈希表优化思路并解释为什么能降到 O(n)：因为哈希查找平均 O(1)。
4. 写出一遍哈希的代码，边写边解释哈希表里存什么（value -> index）以及何时查找/插入。
5. 考虑边界测试（空数组、重复元素、负数）并说明如何处理。
6. 若问最优复杂度，说明时间 O(n)，空间 O(n)，并能简短比较双指针在已排序数组上的做法（空间 O(1)）。

---

## 拓展/变体（可作为练习）
- Two Sum II - 输入数组已排序，使用双指针解决（O(n), O(1)）。
- 返回所有不重复的对（Two Sum Unique Pairs）。
- Three Sum（3 数之和）：更复杂的组合问题，常用排序 + 双指针。
- 如果要求返回值而非索引，代码改返回 `nums[i], nums[j]` 即可。

---

## 小贴士
- 通常在面试中写“一遍哈希”并能解释清楚就能拿到分数；暴力解也可先写作为正确性证明。
- 在 TypeScript/JavaScript 中使用 `Map` 可以避免对象键引用陷阱（`Map` 可以使用任意值作为键）。
- 练习时注意写测试用例覆盖边界（最后元素、重复元素、负数）。

---

如果你愿意，我可以：
- 帮你把上面的函数写成带测试的 TypeScript 文件（用 Jest 或直接 Node 测试）；
- 逐步带你运行调试某个具体例子（我会把每一步打印出来让你跟着看）；
- 出 5 个练习题从简单到复杂，巩固 Two Sum 的变体。

你想先做哪一个？（写测试 / 运行示例 / 做练习题）