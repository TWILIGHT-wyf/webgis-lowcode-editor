# AGENTS.md - Agent Development Guide

## Build / Lint / Test Commands

### Development & Build

- `pnpm dev` - Start dev server (@vela/editor on port 5173)
- `pnpm build` - Build production bundle
- `pnpm -F @vela/editor dev` - Start editor dev server
- `pnpm -F @vela/editor build` - Build editor only

### Type Checking & Linting

- `pnpm type-check` - Run TypeScript type checking (vue-tsc --noEmit)
- `pnpm lint` - Run ESLint across entire monorepo
- `pnpm lint --fix` - Auto-fix linting issues

### Testing (Vitest)

- `pnpm vitest` - Run all unit/component tests
- `pnpm vitest run` - Run tests once (no watch)
- `pnpm vitest --run` - Run tests in CI mode
- `pnpm vitest tests/components/AnimationPanel.spec.ts` - Run single test file
- `pnpm vitest --reporter=verbose` - Run with detailed output

### Testing (Playwright E2E)

- `npx playwright test` - Run all E2E tests
- `npx playwright test tests/e2e/editor.spec.ts` - Run single E2E file
- `npx playwright test --headed` - Run with browser UI
- `npx playwright test --project=chromium` - Run on specific browser

## Project Architecture

This is a **pnpm monorepo** with the following packages:

- `@vela/editor` - Main low-code editor app (Vue 3 + TypeScript)
- `@vela/core` - Shared types, utilities, constants
- `@vela/ui` - Reusable UI components
- `@vela/materials` - Component library (50+ components)
- `@vela/renderer` - Render engine
- `@vela/generator` - Code generation utilities

## Code Style Guidelines

### Imports

- Use `@/` alias for editor source files: `import { useProjectStore } from '@/stores/project'`
- Use package aliases for inter-package imports: `import type { ProjectSchema } from '@vela/core'`
- Group imports: external → internal → relative
- Named exports preferred over default exports

### Formatting (Prettier + EditorConfig)

- **Indentation**: 2 spaces (no tabs)
- **Quotes**: Single quotes `'` for strings
- **Semicolons**: Disabled (no semicolons)
- **Line width**: 100 characters max
- **End of line**: LF (Unix-style)
- **Trailing whitespace**: Trimmed
- **Final newline**: Required

### TypeScript & Types

- Strict mode enabled in tsconfig.json
- Use explicit return types for public functions
- Prefer `interface` for object shapes, `type` for unions
- Avoid `any` - use `unknown` or proper types
- Use generics appropriately: `<T extends Component>`

### Naming Conventions

- **Components**: PascalCase (e.g., `CanvasBoard.vue`, `useProjectStore`)
- **Files**: camelCase for utilities, PascalCase for components
- **Variables/Functions**: camelCase (e.g., `activePageId`, `updateProjectMeta`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `DEFAULT_CONFIG`)
- **Interfaces/Types**: PascalCase with `I` prefix discouraged (use `ProjectSchema`, `PageSchema`)
- **Boolean props**: Prefix with `is/has/can` (e.g., `isVisible`, `hasChildren`)
- **Event handlers**: Prefix with `handle` (e.g., `handleDrag`, `handleSubmit`)

### Vue Component Patterns

- Use `<script setup lang="ts">` syntax
- Prefer Composition API with `ref`, `computed`, `watch`
- Use `defineProps<T>()` and `defineEmits<T>()` with generic types
- For stores, use `defineStore()` from Pinia
- Use `storeToRefs()` when destructuring from stores
- Component templates use kebab-case for props/events
- Use `v-if` vs `v-show` appropriately (conditional rendering vs visibility)

### Error Handling

- Always use try-catch for async operations
- Use ElMessage for user feedback: `ElMessage.success('Saved')`, `ElMessage.error('Failed')`
- Log errors with context: `console.error('[ProjectStore] Save failed:', error)`
- Provide fallback values where appropriate
- Don't ignore errors - at least log them

### Testing Conventions

- Test files: `*.spec.ts` for unit/component, `*.e2e.ts` for E2E
- Use `describe()` blocks for feature grouping
- Use `it()` for individual test cases (not `test()`)
- Stub Element Plus components in tests
- Use `mount()` from @vue/test-utils with Pinia plugin
- Use Vitest matchers: `expect().toBe()`, `expect().toBeTruthy()`
- Test structure: Arrange → Act → Assert
- Mock external dependencies (axios, echarts, leaflet) - see tests/setupTests.ts

### State Management (Pinia)

- Store naming: `useXxxStore` (e.g., `useProjectStore`, `useComponentStore`)
- Use composition API style: `defineStore('storeName', () => { ... })`
- Separate state, getters, and actions with comments
- Export types used in store: `export type { SaveStatus } from './project'`
- Use `storeToRefs()` in components to maintain reactivity

### Console Logging

- Use prefixes for context: `[ProjectStore]`, `[Component]`, `[Canvas]`
- Keep logs informative but concise
- Remove debug logs before committing
- Use `console.warn()` for deprecations or non-breaking issues
- Use `console.error()` for errors that need investigation

### Comments & Documentation

- Use JSDoc for functions: `/** @param {string} id Component ID */`
- Keep comments concise and current
- Don't comment obvious code
- Use TODO/FIXME comments for temporary workarounds

## Path Aliases

Editor source uses these aliases (defined in vite.config.ts):

- `@/` → `packages/editor/src/`
- `@vela/editor` → `packages/editor/src/`
- `@vela/core` → `packages/core/src/`
- `@vela/ui` → `packages/ui/`
- `@vela/materials` → `packages/materials/src/`
- `@vela/renderer` → `packages/renderer/src/`
- `@vela/generator` → `packages/generator/src/`

## Tech Stack Notes

- **Framework**: Vue 3.4+ with Composition API
- **Build Tool**: Vite 5.x
- **UI Library**: Element Plus 2.13+
- **State**: Pinia 2.3+
- **Router**: Vue Router 4.6+
- **Charts**: ECharts 6.x via vue-echarts
- **Maps**: Leaflet (mocked in tests)
- **HTTP**: Axios 1.x (mocked in tests)
- **Package Manager**: pnpm (workspaces)
- **Node**: 20.19+
