# TypeScript 完整指南

## 目录

- [基础概念](#基础概念)
- [类型系统](#类型系统)
- [高级特性](#高级特性)
- [Vue.js 集成](#vuejs-集成)
- [实际应用](#实际应用)
- [最佳实践](#最佳实践)
- [工具和配置](#工具和配置)

## 基础概念

### 什么是 TypeScript？

TypeScript 是 JavaScript 的超集，它添加了静态类型检查。TypeScript 编译为纯 JavaScript，可以在任何浏览器、Node.js 或其他支持 JavaScript 的环境中运行。

### 为什么使用 TypeScript？

- **类型安全**：在编译时捕获错误
- **更好的 IDE 支持**：智能提示、重构、导航
- **代码可维护性**：自文档化代码，更容易理解和维护
- **渐进式采用**：可以逐步迁移现有 JavaScript 项目

### 基本语法

#### 变量声明

```typescript
// 显式类型注解
let name: string = "TypeScript";
let age: number = 25;
let isActive: boolean = true;

// 类型推断
let message = "Hello"; // 自动推断为 string
let count = 42; // 自动推断为 number
```

#### 函数

```typescript
// 函数参数和返回值类型
function greet(name: string): string {
  return `Hello, ${name}!`;
}

// 可选参数
function createUser(name: string, age?: number): User {
  return { name, age };
}

// 默认参数
function multiply(a: number, b: number = 2): number {
  return a * b;
}

// 箭头函数
const add = (a: number, b: number): number => a + b;
```

## 类型系统

### 基本类型

#### 原始类型

```typescript
let str: string = "hello";
let num: number = 42;
let bool: boolean = true;
let undef: undefined = undefined;
let nul: null = null;
let sym: symbol = Symbol("key");
let big: bigint = 100n;
```

#### 数组类型

```typescript
// 方式1：类型[]
let numbers: number[] = [1, 2, 3];
let strings: string[] = ["a", "b", "c"];

// 方式2：Array<类型>
let numbers2: Array<number> = [1, 2, 3];

// 多维数组
let matrix: number[][] = [
  [1, 2],
  [3, 4],
];

// 只读数组
let readonlyArray: readonly number[] = [1, 2, 3];
```

#### 元组类型

```typescript
// 固定长度和类型的数组
let tuple: [string, number] = ["hello", 42];

// 可选元素
let optionalTuple: [string, number?] = ["hello"];

// 剩余元素
let restTuple: [string, ...number[]] = ["hello", 1, 2, 3];
```

### 对象类型

#### 接口 (Interface)

```typescript
interface User {
  readonly id: number;
  name: string;
  email?: string; // 可选属性
  age: number;
}

// 实现接口
const user: User = {
  id: 1,
  name: "John",
  age: 25,
};

// 扩展接口
interface Admin extends User {
  role: "admin" | "superuser";
  permissions: string[];
}
```

#### 类型别名 (Type Alias)

```typescript
type Point = {
  x: number;
  y: number;
};

type ID = string | number;

type Callback<T> = (value: T) => void;
```

#### 类 (Class)

```typescript
class Person {
  private name: string;
  protected age: number;
  public email: string;

  constructor(name: string, age: number, email: string) {
    this.name = name;
    this.age = age;
    this.email = email;
  }

  greet(): string {
    return `Hello, I'm ${this.name}`;
  }
}

// 继承
class Employee extends Person {
  department: string;

  constructor(name: string, age: number, email: string, department: string) {
    super(name, age, email);
    this.department = department;
  }
}
```

### 联合类型和交叉类型

#### 联合类型 (Union Types)

```typescript
type Status = "loading" | "success" | "error";
type ID = string | number;

function printId(id: ID): void {
  console.log(`ID: ${id}`);
}

// 类型守卫
function isString(value: unknown): value is string {
  return typeof value === "string";
}
```

#### 交叉类型 (Intersection Types)

```typescript
type Name = { name: string };
type Age = { age: number };
type Person = Name & Age; // { name: string; age: number }

const person: Person = { name: "John", age: 25 };
```

### 泛型 (Generics)

#### 泛型函数

```typescript
function identity<T>(arg: T): T {
  return arg;
}

const result1 = identity<string>("hello");
const result2 = identity<number>(42);

// 自动推断
const result3 = identity("world"); // T 被推断为 string
```

#### 泛型接口

```typescript
interface Container<T> {
  value: T;
  getValue(): T;
  setValue(value: T): void;
}

const stringContainer: Container<string> = {
  value: "hello",
  getValue() {
    return this.value;
  },
  setValue(value) {
    this.value = value;
  },
};
```

#### 泛型约束

```typescript
interface Lengthwise {
  length: number;
}

function getLength<T extends Lengthwise>(arg: T): number {
  return arg.length;
}

getLength("hello"); // OK
getLength([1, 2, 3]); // OK
getLength(42); // Error: number 没有 length 属性
```

## 高级特性

### 条件类型 (Conditional Types)

```typescript
type IsString<T> = T extends string ? "yes" : "no";

type A = IsString<string>; // "yes"
type B = IsString<number>; // "no"

// 内置条件类型
type NonNullable<T> = T extends null | undefined ? never : T;
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
```

### 映射类型 (Mapped Types)

```typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Partial<T> = {
  [P in keyof T]?: T[P];
};

type Required<T> = {
  [P in keyof T]-?: T[P]; // -? 移除可选修饰符
};

// 自定义映射类型
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};
```

### 工具类型 (Utility Types)

#### 内置工具类型

```typescript
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

// Partial: 所有属性变为可选
type PartialTodo = Partial<Todo>;

// Required: 所有属性变为必需
type RequiredTodo = Required<Todo>;

// Readonly: 所有属性变为只读
type ReadonlyTodo = Readonly<Todo>;

// Pick: 选择部分属性
type TodoPreview = Pick<Todo, "title" | "completed">;

// Omit: 排除部分属性
type TodoWithoutCompleted = Omit<Todo, "completed">;

// Record: 创建对象类型
type StringRecord = Record<string, string>;
type TodoRecord = Record<number, Todo>;
```

### 装饰器 (Decorators)

```typescript
// 类装饰器
function sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

@sealed
class Greeter {
  greeting: string;
  constructor(message: string) {
    this.greeting = message;
  }
  greet() {
    return "Hello, " + this.greeting;
  }
}

// 方法装饰器
function enumerable(value: boolean) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    descriptor.enumerable = value;
  };
}

class Greeter {
  greeting: string;

  constructor(message: string) {
    this.greeting = message;
  }

  @enumerable(false)
  greet() {
    return "Hello, " + this.greeting;
  }
}
```

### 模块系统

#### ES6 模块

```typescript
// math.ts
export function add(a: number, b: number): number {
  return a + b;
}

export const PI = 3.14159;

export default class Calculator {
  // ...
}

// main.ts
import { add, PI } from "./math";
import Calculator from "./math";

console.log(add(1, 2)); // 3
console.log(PI); // 3.14159
```

#### 命名空间 (Namespaces)

```typescript
// math.ts
namespace MathUtils {
  export function add(a: number, b: number): number {
    return a + b;
  }

  export function multiply(a: number, b: number): number {
    return a * b;
  }
}

// main.ts
/// <reference path="math.ts" />
MathUtils.add(1, 2);
```

## Vue.js 集成

### Vue 3 + TypeScript

#### 组合式 API (Composition API)

```typescript
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// 响应式数据
const count = ref<number>(0)
const message = ref<string>('Hello Vue 3 + TS')

// 计算属性
const doubled = computed((): number => count.value * 2)

// 方法
function increment(): void {
  count.value++
}

// 生命周期
onMounted(() => {
  console.log('Component mounted')
})
</script>
```

#### defineProps 和 defineEmits

```typescript
<script setup lang="ts">
// 类型定义
interface Props {
  title: string
  count?: number
  disabled?: boolean
}

interface Emits {
  (e: 'update', value: string): void
  (e: 'reset'): void
}

// Props
const props = withDefaults(defineProps<Props>(), {
  count: 0,
  disabled: false
})

// Emits
const emit = defineEmits<Emits>()

// 使用
function handleUpdate(value: string) {
  emit('update', value)
}

function handleReset() {
  emit('reset')
}
</script>
```

#### 组件类型

```typescript
<script setup lang="ts">
// 导入组件
import ChildComponent from './ChildComponent.vue'

// 组件类型
const childRef = ref<InstanceType<typeof ChildComponent>>()

// 使用
function callChildMethod() {
  childRef.value?.someMethod()
}
</script>

<template>
  <ChildComponent ref="childRef" />
</template>
```

### Pinia Store 类型化

#### 定义 Store

```typescript
import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useCounterStore = defineStore("counter", () => {
  // State
  const count = ref<number>(0);
  const name = ref<string>("Counter");

  // Getters
  const doubleCount = computed((): number => count.value * 2);

  // Actions
  function increment(): void {
    count.value++;
  }

  function decrement(): void {
    count.value--;
  }

  function setName(newName: string): void {
    name.value = newName;
  }

  return {
    // State
    count,
    name,
    // Getters
    doubleCount,
    // Actions
    increment,
    decrement,
    setName,
  };
});

// 类型推断
type CounterStore = ReturnType<typeof useCounterStore>;
```

#### 在组件中使用

```typescript
<script setup lang="ts">
  import {useCounterStore} from '@/stores/counter' import type {CounterStore}{" "}
  from '@/stores/counter' // 使用 Store const counterStore = useCounterStore()
  // 类型安全的使用 counterStore.increment() counterStore.setName('My Counter')
  console.log(counterStore.doubleCount) // 类型：number
</script>
```

### Vue Router 类型化

#### 路由定义

```typescript
import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/Home.vue"),
    meta: {
      title: "首页",
      requiresAuth: false,
    },
  },
  {
    path: "/user/:id",
    name: "User",
    component: () => import("@/views/User.vue"),
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
```

#### 路由守卫

```typescript
import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";

router.beforeEach(
  (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
  ) => {
    if (to.meta.requiresAuth && !isAuthenticated()) {
      next("/login");
    } else {
      next();
    }
  }
);
```

### 全局类型声明

#### shims-vue.d.ts

```typescript
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
```

#### 环境变量类型

```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_APP_TITLE: string;
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

## 实际应用

### API 调用类型化

#### 定义 API 响应类型

```typescript
// API 响应基础类型
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

// 用户相关类型
interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
}

interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}

// API 函数
async function createUser(
  userData: CreateUserRequest
): Promise<ApiResponse<User>> {
  const response = await fetch("/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error("Failed to create user");
  }

  return response.json();
}

// 使用
try {
  const result = await createUser({
    name: "John Doe",
    email: "john@example.com",
    password: "secret123",
  });

  if (result.success) {
    console.log("User created:", result.data);
  } else {
    console.error("Error:", result.message);
  }
} catch (error) {
  console.error("Network error:", error);
}
```

### 表单处理

#### 表单数据类型

```typescript
interface LoginForm {
  email: string
  password: string
  rememberMe: boolean
}

interface FormErrors {
  email?: string
  password?: string
  general?: string
}

// 表单组件
<script setup lang="ts">
import { ref, reactive } from 'vue'

const form = reactive<LoginForm>({
  email: '',
  password: '',
  rememberMe: false
})

const errors = ref<FormErrors>({})
const isSubmitting = ref(false)

async function handleSubmit() {
  if (!validateForm()) return

  isSubmitting.value = true
  try {
    await login(form)
    // 成功处理
  } catch (error) {
    errors.value.general = '登录失败'
  } finally {
    isSubmitting.value = false
  }
}

function validateForm(): boolean {
  errors.value = {}

  if (!form.email) {
    errors.value.email = '邮箱不能为空'
  } else if (!isValidEmail(form.email)) {
    errors.value.email = '邮箱格式不正确'
  }

  if (!form.password) {
    errors.value.password = '密码不能为空'
  }

  return Object.keys(errors.value).length === 0
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
</script>
```

### 错误处理

#### 自定义错误类型

```typescript
class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public errors?: string[]
  ) {
    super(message);
    this.name = "ApiError";
  }
}

class ValidationError extends Error {
  constructor(message: string, public field: string, public value: any) {
    super(message);
    this.name = "ValidationError";
  }
}

// 错误处理函数
function handleError(error: unknown): void {
  if (error instanceof ApiError) {
    console.error(`API Error (${error.statusCode}):`, error.message);
    if (error.errors) {
      error.errors.forEach((err) => console.error("  -", err));
    }
  } else if (error instanceof ValidationError) {
    console.error(`Validation Error in ${error.field}:`, error.message);
  } else if (error instanceof Error) {
    console.error("Generic Error:", error.message);
  } else {
    console.error("Unknown Error:", error);
  }
}

// 使用
try {
  await someApiCall();
} catch (error) {
  handleError(error);
}
```

## 最佳实践

### 代码组织

#### 文件结构

```
src/
├── types/           # 全局类型定义
│   ├── api.ts
│   ├── models.ts
│   └── index.ts
├── stores/          # Pinia stores
│   ├── user.ts
│   ├── cart.ts
│   └── index.ts
├── components/      # Vue 组件
│   ├── common/
│   ├── forms/
│   └── layouts/
├── views/           # 页面组件
├── composables/     # 组合式函数
├── utils/           # 工具函数
└── router/          # 路由配置
```

#### 类型定义组织

```typescript
// types/index.ts - 导出所有类型
export * from "./api";
export * from "./models";
export * from "./stores";

// types/models.ts
export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export type UserRole = "admin" | "user" | "guest";

// types/api.ts
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}
```

### 类型安全最佳实践

#### 避免 any

```typescript
// ❌ 避免使用 any
function processData(data: any): any {
  return data;
}

// ✅ 使用泛型
function processData<T>(data: T): T {
  return data;
}

// ✅ 使用联合类型
function processData(data: string | number | boolean): string {
  return String(data);
}
```

#### 使用严格模式

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true
  }
}
```

#### 类型守卫

```typescript
// 类型谓词
function isUser(obj: any): obj is User {
  return obj && typeof obj.id === "number" && typeof obj.name === "string";
}

// 使用
function processUser(obj: unknown) {
  if (isUser(obj)) {
    // TypeScript 知道 obj 是 User 类型
    console.log(obj.name); // ✅ 没有类型错误
  }
}
```

### Vue.js 最佳实践

#### 组件 Props 类型化

```typescript
<script setup lang="ts">
// ✅ 推荐：使用接口定义 props
interface Props {
  title: string
  count: number
  items: readonly string[]
  onSelect?: (item: string) => void
}

const props = withDefaults(defineProps<Props>(), {
  count: 0,
  items: () => []
})
</script>
```

#### 组合式函数

```typescript
// composables/useLocalStorage.ts
import { ref, watch } from "vue";

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const value = ref<T>(defaultValue);

  // 初始化
  const stored = localStorage.getItem(key);
  if (stored) {
    try {
      value.value = JSON.parse(stored);
    } catch {
      // 解析失败，使用默认值
    }
  }

  // 监听变化并保存
  watch(
    value,
    (newValue) => {
      localStorage.setItem(key, JSON.stringify(newValue));
    },
    { deep: true }
  );

  return value;
}

// 使用
const username = useLocalStorage("username", "");
const settings = useLocalStorage("settings", {
  theme: "light",
  language: "zh",
});
```

## 工具和配置

### TypeScript 配置

#### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "allowJs": true,
    "checkJs": true,
    "jsx": "preserve",
    "strict": true,
    "noEmit": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
    "types": ["vite/client"]
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"],
  "exclude": ["node_modules", "dist"]
}
```

### Vite 配置

#### vite.config.ts

```typescript
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vue: ["vue", "vue-router", "pinia"],
          utils: ["lodash-es", "dayjs"],
        },
      },
    },
  },
});
```

### ESLint + Prettier 配置

#### .eslintrc.js

```javascript
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "@vue/eslint-config-typescript",
    "@vue/eslint-config-prettier/skip-formatting",
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "vue/multi-word-component-names": "off",
  },
};
```

#### .prettierrc

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "endOfLine": "lf"
}
```

### 开发工具

#### VS Code 扩展推荐

- TypeScript and JavaScript Language Features (内置)
- TypeScript Importer
- Vue Language Features (Volar)
- Prettier - Code formatter
- ESLint
- Auto Rename Tag
- Bracket Pair Colorizer 2

#### VS Code 设置

```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.suggest.autoImports": true,
  "typescript.updateImportsOnFileMove.enabled": "always",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "explicit"
  },
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

### 调试和测试

#### 测试类型化

```typescript
// vitest.config.ts
/// <reference types="vitest" />
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: "jsdom",
  },
});
```

#### 组件测试示例

```typescript
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { createPinia } from "pinia";
import MyComponent from "./MyComponent.vue";

describe("MyComponent", () => {
  it("renders correctly", () => {
    const wrapper = mount(MyComponent, {
      global: {
        plugins: [createPinia()],
      },
      props: {
        title: "Test Title",
        count: 5,
      },
    });

    expect(wrapper.text()).toContain("Test Title");
    expect(wrapper.vm.count).toBe(5);
  });
});
```

## 总结

TypeScript 为 JavaScript 带来了静态类型检查，使代码更加健壮和可维护。在 Vue.js 项目中，TypeScript 的优势尤为明显：

1. **类型安全**：在编译时捕获潜在错误
2. **更好的开发体验**：智能提示、重构支持
3. **代码质量**：自文档化，更容易维护
4. **渐进式迁移**：可以逐步引入到现有项目

掌握 TypeScript 需要时间，但长期来看，它会显著提高你的开发效率和代码质量。建议从基础类型开始学习，逐步深入高级特性，并在实际项目中不断实践。

记住：TypeScript 不是银弹，它的设计哲学是"尽可能的类型安全，同时保持实用性"。在某些情况下，灵活性比严格的类型检查更重要。

Happy TypeScript coding! 🚀
