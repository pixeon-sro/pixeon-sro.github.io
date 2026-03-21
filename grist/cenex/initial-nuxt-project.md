# Spustenie NUXT projektu

```sh
npx nuxt init meno-projektu
cd meno-projektu
npm run dev
```

## Inštalácia Tailwind css

```sh
npx nuxi module add tailwindcss
```

Edit nuxt.config.ts

```js
export default defineNuxtConfig({
   modules: ["@nuxtjs/tailwindcss"],
   tailwindcss: {
      exposeConfig: true,
      viewer: true,
      // and more...
   },
});
```
