# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Environment variables

The wallet overview panels rely on external data sources. The following optional environment variables let you proxy or tune
those integrations when running the site locally:

| Variable | Purpose | Default |
| --- | --- | --- |
| `VITE_TEL_MARKET_CHART_URL` | Override the TEL market chart endpoint (Coingecko-compatible response). | `https://api.coingecko.com/api/v3/coins/telcoin/market_chart` |
| `VITE_TEL_MARKET_CHART_CURRENCY` | Fiat currency code for price formatting. | `usd` |
| `VITE_TELX_STATS_URL` | TELx liquidity JSON endpoint or proxy that returns pool arrays from `telx.network`. | `https://www.telx.network/api/pools.json` |
| `VITE_TEL_STATUS_URL` | Status/Roadmap summary endpoint (Statuspage v2 schema). | `https://status.telco.in/api/v2/summary.json` |
| `VITE_TEL_STATUS_POLL_MS` | Polling interval for the status integration in milliseconds. | `60000` |

If `telx.network` blocks direct browser requests, point `VITE_TELX_STATS_URL` to a proxy you control that forwards JSON
responses without adding restrictive CORS headers.

## React Compiler

The React Compiler is currently not compatible with SWC. See [this issue](https://github.com/vitejs/vite-plugin-react/issues/428) for tracking the progress.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
