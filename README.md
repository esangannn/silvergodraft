# .

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

### 1. Install dependencies

```sh
npm install
```

### 2. Configure environment variables

Copy the example file and fill in the real keys (request them privately from a teammate — never commit `.env`):

```sh
cp .env.example .env
```

Then open `.env` and replace each placeholder with the actual key.

Required variables:

- `VITE_MAPS_API_KEY` — Google Maps JavaScript / Embed API key
- `VITE_FIREBASE_*` — Firebase web app config (apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId, measurementId)

### 3. Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```
