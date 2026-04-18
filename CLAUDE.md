# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository purpose

This repo is **《TS 类型挑战通关手册》** — a Chinese-language VuePress documentation site containing detailed solutions and analyses for the [type-challenges](https://github.com/type-challenges/type-challenges) problem set. It is **documentation-only**: there is no application source code, only Markdown content rendered by VuePress.

## Commands

Package manager: **pnpm** (the CI uses pnpm 8 + Node 16; `yarn.lock` is also present but CI/deploys go through pnpm).

- `pnpm dev` — run VuePress dev server against `docs/` for local preview.
- `pnpm build` — runs `prettier --write` then `vuepress build docs` (output goes to `docs/.vuepress/dist`, which is gitignored).
- `pnpm format` — check formatting with Prettier.
- `pnpm format:fix` — auto-fix formatting (also runs as part of `build`).

Deployment is automated: pushes to `main` trigger `.github/workflows/docs.yml`, which builds with pnpm and deploys to the `gh-pages` branch. **Contributors do not need to build or deploy manually** (see `CONTRIBUTING.md`).

## Architecture

- `docs/` — all site content. Everything user-facing lives here.
  - `docs/README.md` — site landing page (`关于本文档`).
  - `docs/easy/`, `docs/medium/`, `docs/hard/`, `docs/extreme/` — solution articles grouped by difficulty. File names follow the pattern `<challenge-id>-<中文标题>.md` (e.g. `4-实现Pick.md`). A few interstitial files without a numeric id act as section breaks (e.g. `medium/休息下.md`, `hard/写在hard开始前.md`).
  - `docs/summary/` — cross-cutting technique articles (递归深度, 分发特性, 逆变顺变协变, etc.) referenced by individual solutions.
  - `docs/Contactme.md`, `docs/Contributors.md`, `docs/DaShang.md`, `docs/lujing.md` — standalone pages linked from the nav/sidebar.
  - `docs/assets/` — images referenced from articles.
- `docs/.vuepress/config.js` — the single source of truth for site structure. The `themeConfig.sidebar` array hard-codes the order of every article per difficulty. **Adding a new solution file requires adding its path to the appropriate `children` array here**, otherwise it will not appear in the sidebar.
- `docs/.vuepress/imagesize.js` — local plugin wrapping `markdown-it-imsize` so Markdown image syntax can carry `=WxH` size hints.
- `docs/.vuepress/public/` — static assets (favicon, etc.).
- `.github/workflows/docs.yml` — build + deploy pipeline.

The `base` in `config.js` is `/type-challenge/dist/`; internal links and assets assume that prefix in production.

## Authoring conventions

- Solution articles use Chinese prose throughout, with `lang: zh-CN` frontmatter and a `title` that is surfaced via `{{ $frontmatter.title }}` in an `# {{ ... }}` heading. Follow the existing template (see `docs/easy/4-实现Pick.md`) when adding new articles:
  1. Frontmatter (`title`, `lang: zh-CN`).
  2. `## 题目描述` — restate the problem.
  3. `## 分析` — walk through the reasoning.
  4. `## 题解` — give the typed solution(s) in fenced ` ```ts ` blocks.
  5. Optional `## 知识点` / Q&A / alternative approaches at the end.
- When a solution relies on a general technique, link to the relevant file under `docs/summary/` rather than re-explaining (e.g. `Equal` judgment, union distribution, recursion depth limits).
- File-name numeric prefixes must match the upstream type-challenges challenge id.
- The sidebar in `config.js` mixes absolute (`/easy/...`) and relative (`hard/...`) paths — match the style already used within the same difficulty block when editing.
- Prettier settings (`.prettierrc`): `singleQuote: true`, `trailingComma: 'all'`, `proseWrap: 'never'`. `.editorconfig` enforces 2-space indent, LF, UTF-8; Markdown files keep trailing whitespace (used for hard line breaks).

## Scope of contributions

Per `CONTRIBUTING.md`, contributions should be limited to editing files under `docs/`. Build and deploy are handled automatically on merge to `main`, so no generated output should ever be committed (`docs/.vuepress/dist` is gitignored).
