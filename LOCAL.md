# Pruebas locales

Guía breve para probar `sdd-studio` localmente contra proyectos temporales sin publicarlo ni instalarlo globalmente.

## Requisitos

- `Node.js 20+`
- `npm`

## 1. Build local del CLI

El binario `bin/sdd-studio.js` carga `dist/cli.js`, así que primero hay que compilar:

```bash
cd /Users/jaredazcarate/Works/cli-sdd-workspace
npm install
npm run build
```

## 2. Ejecutar la TUI local desde este repo

Desde la raíz del repo:

```bash
npm start
```

o equivalente:

```bash
node bin/sdd-studio.js
```

Esto abre la TUI en el directorio actual.

## 3. Crear un proyecto temporal foundation only

```bash
TEMP_DIR=$(mktemp -d /tmp/sdd-local-foundation-XXXXXX)
cd "$TEMP_DIR"

node /Users/jaredazcarate/Works/cli-sdd-workspace/bin/sdd-studio.js init --yes --assistant cursor
```

Esto genera:

- `.workspace/brief/business/`
- `.workspace/brief/technical/`
- `.cursor/skills/` y `.cursor/rules/`

No genera `spec/` ni `workflow/`.

## 4. Crear un proyecto temporal con spec scaffold

```bash
TEMP_DIR=$(mktemp -d /tmp/sdd-local-spec-XXXXXX)
cd "$TEMP_DIR"

node /Users/jaredazcarate/Works/cli-sdd-workspace/bin/sdd-studio.js init --yes --assistant cursor --spec
```

Esto agrega también:

- `.workspace/spec/business/`
- `.workspace/spec/technical/`

## 5. Probar la TUI greenfield paso a paso

Usa un proyecto temporal foundation only:

```bash
cd /tmp/sdd-local-foundation-XXXXXX
node /Users/jaredazcarate/Works/cli-sdd-workspace/bin/sdd-studio.js
```

Flujo recomendado para probar:

1. `Create Business & Technical foundation`
2. `Configure Engineering`
3. `Create spec scaffold`
4. `Configure Workflow`
5. `Sync Assistant Files`

Referencia del flujo: `FLOW-GREENFIELD.md`

## 6. Probar `configure` y `configure-workflow`

Ambos comandos requieren un workspace ya inicializado.

```bash
cd "$TEMP_DIR"

node /Users/jaredazcarate/Works/cli-sdd-workspace/bin/sdd-studio.js configure
node /Users/jaredazcarate/Works/cli-sdd-workspace/bin/sdd-studio.js configure-workflow
```

## 7. Probar skills en Cursor

Abre el proyecto temporal en Cursor:

```bash
cursor "$TEMP_DIR"
```

Luego prueba:

- `/sdd-idea`
- `/sdd-technical`
- `/sdd-spec`
- `/sdd-plan`
- `/sdd-review`

## 8. Notas útiles

- Para probar scaffolding en un proyecto temporal, usa siempre la ruta absoluta al binario del repo:

```bash
node /Users/jaredazcarate/Works/cli-sdd-workspace/bin/sdd-studio.js ...
```

- El flujo greenfield canónico es:

```text
configure -> sdd-idea -> sdd-technical -> spec scaffold -> sdd-spec -> configure-workflow -> sdd-plan
```

- `init` por defecto crea solo la foundation.
- `--spec` agrega scaffold de spec.
- `--workflow` agrega scaffold de workflow.
- Si cambias código del CLI, recompila antes de volver a probar:

```bash
cd /Users/jaredazcarate/Works/cli-sdd-workspace
npm run build
```
