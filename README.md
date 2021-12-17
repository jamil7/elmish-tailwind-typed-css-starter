# Elmish + Tailwind + TypedCssClasses Starter

This is a starter template for those looking to use Elmish with Tailwind and CSS type provider.

It uses:

- `Elmish.React`
- `Elmish.HMR`
- `Feliz` (as a DSL instead of Elmish double list style)
- `Zanaptak.TypedCssClasses` (CSS type provider)
- `Tailwind CSS`
- `Prettier`
- `Webpack 5`
- `Yarn` (changing to `npm` should be quite easy just replace `yarn` with `npm` in the `package.json` and
  remove `yarn.lock`)

## Running the first time

```bash
yarn install
yarn first-start
```

## Running the app (not the first time)

```bash
yarn start
```

## Generate production files

```bash
yarn build
```

The files will wind up in `deploy`.

## Acknowledgement

This repo is more or less a port of
[@zanaptak's](https://github.com/zanaptak)
Tailwind [sample](https://github.com/zanaptak/TypedCssClasses/tree/main/sample/FableTailwind) (a huge thanks to him!).
The difference is that this one uses `Elmish` instead of `Feliz` (Feliz is still used as a DSL). This difference meant
changing the hot module reload extension in Webpack, and going back to use Webpack 4. Which took me a while to figure
out so here we are :D
