# vue-ZohoDesk-widget-template

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production and ready for Zoho Sigma upload

```sh
npm run pakc
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

### Note
 - Always wrap you logic with `ZOHODESK.extension.onload()` to be able to use the Zoho Desk SDK.
```js
export default {
    // `mounted` is a lifecycle hook which we will explain later
    mounted() {
        ZOHODESK.extension.onload().then((App) => {
            ZOHODESK.get("ticket.email").then((response) => {
                console.log(response);
            });
        });
    },
};
```
