# Local Testing

Brief guide to test `sdd-studio` locally against temporary projects without publishing or installing globally.

## Requirements

- `Node.js 20+`
- `npm`

## 1. Local CLI build

The `bin/sdd-studio.js` binary loads `dist/cli.js`, so compile first:

```bash
cd /Users/jaredazcarate/Works/cli-sdd-workspace
npm install
npm run build
```

## 2. Run the local TUI from this repo

From the repo root:

```bash
npm start
```

or equivalent:

```bash
node bin/sdd-studio.js
```

This opens the TUI in the current directory.

## 3. Create a temporary foundation-only project

```bash
TEMP_DIR=$(mktemp -d /tmp/sdd-local-foundation-XXXXXX)
cd "$TEMP_DIR"

node /Users/jaredazcarate/Works/cli-sdd-workspace/bin/sdd-studio.js init --yes --assistant cursor
```

This generates:

- `.workspace/brief/business/`
- `.workspace/brief/technical/`
- `.cursor/skills/` and `.cursor/rules/`

It does not generate `spec/` or `workflow/`.

## 4. Create a temporary project with spec scaffold

```bash
TEMP_DIR=$(mktemp -d /tmp/sdd-local-spec-XXXXXX)
cd "$TEMP_DIR"

node /Users/jaredazcarate/Works/cli-sdd-workspace/bin/sdd-studio.js init --yes --assistant cursor --spec
```

This also adds:

- `.workspace/spec/business/`
- `.workspace/spec/technical/`

## 5. Test the greenfield TUI step by step

Use a foundation-only temporary project:

```bash
cd /tmp/sdd-local-foundation-XXXXXX
node /Users/jaredazcarate/Works/cli-sdd-workspace/bin/sdd-studio.js
```

Recommended flow to test:

1. `Create brief scaffold`
2. `Configure Engineering`
3. `Create spec scaffold`
4. `Configure Workflow`
5. `Sync Assistant Files`

Flow reference: `FLOW-GREENFIELD.md`

## 6. Test `configure` and `configure-workflow`

Both commands require an initialized workspace.

```bash
cd "$TEMP_DIR"

node /Users/jaredazcarate/Works/cli-sdd-workspace/bin/sdd-studio.js configure
node /Users/jaredazcarate/Works/cli-sdd-workspace/bin/sdd-studio.js configure-workflow
```

## 7. Test skills in Cursor

Open the temporary project in Cursor:

```bash
cursor "$TEMP_DIR"
```

Then try:

- `/sdd-idea`
- `/sdd-technical`
- `/sdd-spec`
- `/sdd-plan`
- `/sdd-review`

## 8. Useful notes

- To test scaffolding in a temporary project, always use the absolute path to the repo binary:

```bash
node /Users/jaredazcarate/Works/cli-sdd-workspace/bin/sdd-studio.js ...
```

- The canonical greenfield flow is:

```text
configure -> sdd-idea -> sdd-technical -> spec scaffold -> sdd-spec -> configure-workflow -> sdd-plan
```

- `init` creates foundation only by default.
- `--spec` adds spec scaffold.
- `--workflow` adds workflow scaffold.
- If you change CLI code, rebuild before testing again:

```bash
cd /Users/jaredazcarate/Works/cli-sdd-workspace
npm run build
```
