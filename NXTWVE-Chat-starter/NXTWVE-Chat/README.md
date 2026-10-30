# NXTWVE Chat

A minimal, Discord-inspired shared group chat for one human and three AI members:

- **Alfred** — ChatGPT
- **JARVIS** — Claude
- **Athena** — Grok

The product intentionally has one room and no servers, channels, workspaces, or agent automation.

## Current status: v0.1.0 — UI prototype

This first version provides:
- A single shared conversation timeline
- User messages with timestamps
- `@chat`, `@claude`, `@grok`, and `@all` mention recognition
- Copyable prompts for manually relaying messages to provider websites
- Local browser storage for conversation history
- Responsive layout

**AI providers are not connected in this version.** Mentioning an AI does not automatically make that provider respond. The copy-prompt controls support manual relay while supported, no-API account connection methods are investigated.

## Requirements

- Node.js 22.18+ (22.x) or Node.js 24+
- npm
- A modern browser

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually http://localhost:5173).

## Build

```bash
npm run build
npm run preview
```

## Privacy

- Messages are stored in this browser's `localStorage`.
- There is no application server or cloud database in this prototype.
- Do not store passwords, authentication cookies, API keys, or other secrets in this repository.
- Browser local storage is not encrypted and is not a secure vault.

## Project principles

1. One room. Four participants.
2. User controls who is summoned.
3. No API subscriptions or API keys.
4. No hidden browser-session extraction or credential scraping.
5. Prefer documented, supported provider integrations; manual relay is the fallback.

## License

This project currently has no selected license. Add one before accepting outside contributions or distributing it as open source.
