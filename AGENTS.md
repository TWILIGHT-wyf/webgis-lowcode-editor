# AGENTS.md - Agent Development Guide

## Build / Lint / Test Commands

### Development & Build

- `pnpm dev` - Start dev server (@vela/editor on port 5173)
- `pnpm -F @vela/editor dev` - Start editor dev server
- `pnpm -F @vela/editor build` - Build editor only
- `pnpm build` - Build production bundle

### Type Checking & Linting

- `pnpm type-check` - Run TypeScript type checking (vue-tsc --noEmit)
- `pnpm lint` - Run ESLint across entire monorepo
- `pnpm lint --fix` - Auto-fix linting issues

### Testing (Vitest)

- `pnpm vitest` - Run all unit/component tests (watch mode)
- `pnpm vitest run` - Run tests once (no watch)
- `pnpm vitest tests/unit/eventExecutor.spec.ts` - Run single test file
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
- Group imports: external → monorepo packages → local aliases → relative
- Use `import type` for type-only imports to optimize bundles
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
- Define types alongside utilities in same file for self-contained modules
- Export union types for mode flags: `type LayoutMode = 'free' | 'flow'`

### Naming Conventions

- **Components**: PascalCase (e.g., `CanvasBoard.vue`, `FreeCanvas.vue`)
- **Composables**: `use` prefix + PascalCase (e.g., `useComponentEvents`, `useCanvasInteraction`)
- **Files**: camelCase for utilities/composables, PascalCase for components
- **Variables/Functions**: camelCase (e.g., `activePageId`, `updateProjectMeta`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `DEFAULT_CONFIG`, `SNAP_THRESHOLD`)
- **Interfaces/Types**: PascalCase (use `ProjectSchema`, `PageSchema` - avoid `I` prefix)
- **Boolean props**: Prefix with `is/has/can` (e.g., `isVisible`, `hasChildren`)
- **Event handlers**: `handle` prefix for UI events (e.g., `handleClick`, `handleDrop`)
- **Custom callbacks**: `on` prefix (e.g., `onMenuAction`, `onDragStart`)
- **Emitters**: `emit` prefix (e.g., `emitOpenContextMenu`)

### Vue Component Patterns

- **Structure**: Use `<script setup lang="ts">` with clear section comments
- **Props & Emits**: Use generic types: `defineProps<Props>()`, `defineEmits<Emits>()`
- **UI Components**: Use `withDefaults` for fallback values (in `@vela/ui`)
- **Material Components**: Accept only `id: string`, fetch data from Pinia store (in `@vela/materials`)
- **Composition API**: Prefer `ref`, `computed`, `watch` over Options API
- **Store Consumption**: Use `storeToRefs()` when destructuring state/getters, actions destructured directly
- **Provide/Inject**: Use for deep context sharing (e.g., canvas wrapper ref passed to child components)
- **Template**: kebab-case for props/events
- **Directives**: Use `v-if` vs `v-show` appropriately

### Composables Pattern

Extract complex logic into `composables/`: `useXxx` pattern, return object with refs/computed/functions, use `provide`/`inject` for shared context. UI components use `withDefaults` for fallbacks; Material components accept only `id: string` and fetch from Pinia.

### Error Handling

Always use try-catch for async/JSON/DOM ops. Provide fallback values, use `ElMessage` for feedback, bracketed console prefixes for debugging: `[Component]`, `[ProjectStore]`, `[Canvas]`.

### Testing Conventions

- Test files: `*.spec.ts` for unit/component, `*.e2e.ts` for E2E
- Use `describe()` blocks for feature grouping
- Use `it()` for individual test cases (not `test()`)
- Stub Element Plus components in tests
- Use `mount()` from @vue/test-utils with Pinia plugin
- Use Vitest matchers: `expect().toBe()`, `expect().toBeTruthy()`
- Test structure: Arrange → Act → Assert
- Mock external dependencies (axios, echarts, leaflet) - see tests/setupTests.ts
- Use helper functions: `pointerDrag()` for simulating drag events, `setupTestPinia()` for Pinia setup

### State Management (Pinia)

Store naming: `useXxxStore` (e.g., `useProjectStore`, `useComponentStore`). Use composition API style: `defineStore('storeName', () => { ... })`. Separate state, getters, actions with comments (e.g., `// ========== Section ==========`). Cross-store dependency: import and call `useXStore()` inside definitions with `watch` for sync. Export types used in store. Use `storeToRefs()` in components for reactive state/getters, actions destructured directly.

### Console Logging

Use prefixes: `[ProjectStore]`, `[Component]`, `[Canvas]`. Remove debug logs before committing.

### Comments & Documentation

Use JSDoc for functions: `/** @param {string} id Component ID */`. Use section comments: `// ========== Section ==========`.

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
