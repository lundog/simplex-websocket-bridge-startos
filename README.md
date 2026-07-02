<p align="center">
  <img src="icon.svg" alt="SimpleX Websocket Bridge Logo" width="21%">
</p>

# SimpleX Websocket Bridge on StartOS

> **Upstream repo:** <https://github.com/simplex-chat/simplex-chat>

SimpleX Websocket Bridge runs the [SimpleX Chat](https://simplex.chat) client headless and exposes the SimpleX messaging network over a token-authenticated **Websocket API**, so bots, AI agents, scripts, and other StartOS services can send and receive SimpleX messages and files programmatically.

**It is not a human chat app.** There is no inbox to read or compose in — it is the machine-to-SimpleX on-ramp that your own software drives. For chatting by hand, use the SimpleX mobile or desktop apps. [SimpleX](https://simplex.chat) is the first messenger with no user identifiers — not even random numbers — and is fully open source, end-to-end encrypted, and metadata-resistant by design.

The bundled client is driven over its Websocket using the upstream [SimpleX bot/chat protocol](https://github.com/simplex-chat/simplex-chat/blob/stable/bots/README.md). [OpenClaw](https://github.com/Start9-Community/openclaw-startos) is an example consumer, using the bridge as an AI agent's SimpleX channel.

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Configuration Management](#configuration-management)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Actions (StartOS UI)](#actions-startos-ui)
- [Backups and Restore](#backups-and-restore)
- [Health Checks](#health-checks)
- [Dependencies](#dependencies)
- [Limitations and Differences](#limitations-and-differences)
- [What Is Unchanged from Upstream](#what-is-unchanged-from-upstream)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

| Property      | Value                                                          |
| ------------- | -------------------------------------------------------------- |
| Image         | `lundog/simplex-chat` (built from `lundog/simplex-chat-docker`) |
| Architectures | x86_64, aarch64                                                |
| Command       | Image entrypoint — supervises `simplex-chat` and `websocat`    |

The image entrypoint starts `simplex-chat` in headless server/bot mode on a localhost-only control port, then runs [`websocat`](https://github.com/vi/websocat) as a bridge from a container-wide port to that control port so traffic from outside the container can reach it. The supervisor exits if either child dies, so StartOS restarts the container rather than leaving a half-running service.

---

## Volume and Data Layout

| Volume | Mount Point        | Purpose                                                                       |
| ------ | ------------------ | ----------------------------------------------------------------------------- |
| `main` | `/data`            | HOME — the `.simplex` profile database and file dirs, plus `store.json` (keys) |
| `main` | `/tmp/simplex-outbound`| The `.simplex/outbound` subpath, re-mounted at a neutral path for outbound sends |

The SimpleX client's own profile (identity, contacts, chat history) is the source of truth for chat state; there is no separate package-level chat config. A small `store.json` at the volume root holds the bridge's API keys. All SimpleX file dirs live under `/data/.simplex` — `files` (received, `--files-folder`), `tmp` (`--temp-folder`), and `outbound` (consumer-written) — as siblings on one filesystem, so simplex-chat's atomic `tmp` → `files` rename can't fail with `EXDEV`.

### File exchange contract (for consumer packages)

The Websocket carries only a small inline preview for image/video messages — actual file bytes (documents, voice, full-resolution media) live on disk. So other StartOS packages exchange files with the bridge by mounting subpaths of this package's `main` volume via dependency mounts (`mountDependency`), declared as an **optional** dependency so it stays opt-in. The two directions are handled differently:

| Direction | Volume subpath | Consumer mounts at | Access | Purpose |
| --------- | -------------- | ------------------ | ------ | ------- |
| Inbound | `.simplex/files` | *any path* (its own choice) | read-only | Files received by the bridge (`--files-folder`) |
| Outbound | `.simplex/outbound` | `/tmp/simplex-outbound` (verbatim) | read-write | Consumer-written files for the bridge to send |

**Inbound** is loose: the Websocket API reports a received file by *name only*, which the consumer resolves against its own view of the `files` dir — so the two sides only need to share that one host directory; the mountpoint can be anything the consumer likes.

**Outbound** requires a matching path: on send the consumer passes a file path that simplex-chat resolves inside *this* container, so it must be valid here. The bridge re-mounts the `.simplex/outbound` subpath at a neutral `/tmp/simplex-outbound`; a consumer mounting the same subpath at `/tmp/simplex-outbound` can then pass `/tmp/simplex-outbound/...` paths verbatim, with no `/data` collision (the neutral prefix avoids clashing with the consumer's own `/data` volume). This is the same neutral path the standalone Docker image documents, so a consumer's outbound folder is identical in both deployments. `outbound` is not renamed across filesystems, so it needs no co-location with `tmp`.

**Security:** consumers mount only the `.simplex/files` and `.simplex/outbound` subpaths — never the whole `main` volume, `.simplex/` itself, or the profile database and keys it holds. `files` is read-only so consumers can't alter received files; write access is limited to `outbound`.

---

## Installation and First-Run Flow

1. On install, the bridge seeds **one API key** so outside access is gated from first start; copy it from the **API Keys** action.
2. On first start, the bundled client auto-creates a fresh SimpleX profile (marked as a bot by default).
3. Copy the Websocket URL from **Interfaces → Websocket**, point a client at it with the API key as a bearer token, and drive it with the SimpleX bot/chat protocol. To hand a contact a connection link, run the **Create Invitation** action.

---

## Configuration Management

There is no separate StartOS-side config file — the SimpleX profile is the configuration.

- **SimpleX profile** (display name, picture, file sharing) — edited live via the **Configure Bot Profile** action; changes are pushed to the running client over the Websocket with no restart.
- **API keys** — stored in `store.json` and managed via the **API Keys** action. Editing keys re-binds the reverse proxy's accepted-token set with no restart.

---

## Network Access and Interfaces

| Interface | Port | Protocol | Purpose                                          |
| --------- | ---- | -------- | ------------------------------------------------ |
| Websocket | 5225 | ws/wss   | Control API for driving SimpleX programmatically |

**Access methods:**

- LAN IP with unique port
- `<hostname>.local` with unique port
- Tor `.onion` address (opt-in — install Tor and provision an onion for the interface)

**Authentication:** outside access is gated by a **bearer token** enforced at the StartOS reverse proxy — a request without a valid `Authorization: Bearer <token>` gets `401` before reaching the container. Same-box StartOS dependents (and this package's own actions) connect directly to the container's bridge IP, which does not traverse the proxy, so they need no token.

---

## Actions (StartOS UI)

| Action                  | Group       | Purpose                                                                                  |
| ----------------------- | ----------- | ---------------------------------------------------------------------------------------- |
| **Configure Bot Profile** | General     | View and edit the live SimpleX profile — display name, picture, and the file-sharing toggle. Pushed to the running client; no restart. |
| **Create Invitation**   | General     | Drive the running client to mint a fresh one-time SimpleX invitation link (with QR). One redemption per link. |
| **API Keys**            | General     | Manage the bearer tokens that gate outside access — add a labeled key per client, delete to revoke. |
| **Reset Profile**       | Danger Zone | Wipe the SimpleX identity, contacts, and chat history. Service must be stopped. API keys are preserved. |

---

## Backups and Restore

**Included in backup:**

- `main` volume (SimpleX profile and identity, contacts, chat history, received/outbound files, and API keys)

**Restore behavior:** the volume is fully restored before the service starts, bringing the bridge back with its original identity and history.

---

## Health Checks

| Check     | Method                 | Messages                                                          |
| --------- | ---------------------- | ----------------------------------------------------------------- |
| Websocket | Port listening (5225)  | Success: "Websocket is ready" / Error: "Websocket is not ready"   |

The standalone health check has the stable ID `websocket`, which dependent packages reference in a `kind: 'running'` dependency requirement.

---

## Dependencies

None.

This package has no dependencies of its own. Other packages may declare an **optional** dependency on it to consume the Websocket API and the file-exchange contract above (referencing the `websocket` health check). Pointing the bridge at a self-hosted SimpleX Server for SMP/XFTP relaying is a planned enhancement, tracked upstream of this README.

---

## Limitations and Differences

1. **Headless only** — there is no human-facing chat UI; the bridge is driven entirely over its Websocket API by other software.
2. **Bearer auth suits programmatic clients** — browsers cannot set an `Authorization` header on a Websocket handshake, so the gated interface is intended for server-side clients, scripts, and same-box dependents (which bypass the gate), not in-browser Websocket use.
3. **File bytes require the shared volume** — the Websocket carries only a small inline preview for images/video; transferring real file bytes to or from a consumer package requires the file-exchange volume contract.

---

## What Is Unchanged from Upstream

The bundled `simplex-chat` client behaves exactly as upstream: messages and files relay through SimpleX's default preset public SMP/XFTP servers, end-to-end encryption and the no-user-identifiers model are intact, and the Websocket speaks the upstream SimpleX bot/chat command protocol verbatim.

---

## Quick Reference for AI Consumers

```yaml
package_id: simplex-websocket-bridge
image: lundog/simplex-chat
architectures: [x86_64, aarch64]
volumes:
  main: /data
ports:
  ws: 5225
auth: bearer token (Authorization: Bearer <token>); same-box dependents bypass via container bridge IP
file_exchange:
  inbound: mount subpath .simplex/files read-only at any path; WS reports file name only
  outbound: mount subpath .simplex/outbound read-write at /tmp/simplex-outbound (pass paths verbatim)
health_checks:
  - websocket
dependencies: none
startos_managed_env_vars: none
actions:
  - configure
  - create-invitation
  - api-keys
  - reset-profile
```
