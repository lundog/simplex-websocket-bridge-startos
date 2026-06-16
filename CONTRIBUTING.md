# Contributing

This is a StartOS service-package repository for **SimpleX Gateway** — SimpleX Chat
run headless behind a WebSocket API.

## Local development

Install dependencies and run the TypeScript check:

```sh
npm ci
npm run check
```

Build the SDK JavaScript bundle:

```sh
npm run build
```

Build StartOS packages:

```sh
make
```

The runtime container image is **not** built here — it is the standalone
`lundog/simplex-chat` image built from
[lundog/simplex-chat-docker](https://github.com/lundog/simplex-chat-docker) and
consumed via `dockerTag`. Use `UPDATING.md` when changing the upstream
simplex-chat image pin. Keep `README.md` (architecture, for developers and LLMs)
and `instructions.md` (end-user docs) in sync with runtime behavior, interfaces,
volumes, actions, and the file-exchange contract (documented in `README.md`).
