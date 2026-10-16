# create-visage

Scaffolding tool for [Visage](https://github.com/Epoch32/visage), a lightning-fast, zero-VDOM, fine-grained reactive UI library with full TypeScript support.

## Usage

### With Bun
```bash
bun create visage my-app
```

### With npm
```bash
npm create visage@latest my-app
```

### With pnpm
```bash
pnpm create visage my-app
```

### Non-interactive Mode

Pass the template directly via `--template` or `-t`:

```bash
# Single-Page Application (Vite + TypeScript)
bun create visage my-app --template spa

# Full-Stack RPC (Client signals + Server procedures)
bun create visage my-rpc-app --template fullstack-rpc

# Native Desktop Application (Zig desktop host)
bun create visage my-desktop-app --template desktop-native
```

## Available Templates

- `spa`: Minimal, high-performance single-page application using `@epoch32/visage`, Vite, and TypeScript.
- `fullstack-rpc`: End-to-end type-safe client/server application using `@epoch32/visage/rpc` with Vite dev server Connect middleware.
- `desktop-native`: Native desktop application leveraging Visage's Zig webview scaffold, single-file bundling, and strict Content Security Policy.

## License

Mozilla Public License 2.0 (MPL-2.0). See [LICENSE](LICENSE) for details.
