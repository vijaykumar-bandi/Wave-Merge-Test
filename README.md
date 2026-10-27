# Wave Merge Test

A small local Node.js/Express app with one page at `/` and one JSON endpoint at `/api/health`.
It stores nothing, has no sign-in and no database, and answers only on `127.0.0.1`.

## Build and run

Install:

```
npm install
```

Test:

```
npm test
```

Run locally:

```
npm run dev
```

The dev server starts `src/server.js` with Node's built-in `--watch` flag and listens on
`127.0.0.1`. It reads the `PORT` environment variable and falls back to port `3000` when it is
not set.

Health path: `/api/health` — answers `200` with `{"status":"ok"}`.

Deploy: none.
