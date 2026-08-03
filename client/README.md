# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about IDE Support for Vue in the [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support).

```
npm install axios pinia vue-router socket.io-client
npm install -D tailwindcss @tailwindcss/vite

```

Tailwind CSS v4 with Vite (no `init -p` command):

1. Update `vite.config.js`:

```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
	plugins: [vue(), tailwindcss()],
})
```

2. Add Tailwind in `src/style.css`:

```css
@import "tailwindcss";
```