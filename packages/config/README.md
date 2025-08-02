# @mkvlrn/config

Custom, opinionated configurations for biome and typescript (tsconfig.json).

To be used in my node projects - aimed at modern, type-safe, non-spaghetti codebases.

## Installation

```bash
npm add @mkvlrn/config -D
```

## Usage

Obs: Both biome and typescript need to be installed separately and be available in the project.

### biome

Variants:

- biome-node: for regular node projects, without frontend
- biome-nest: for nest projects, without frontend
- biome-react: for react projects, without nextjs
- biome-next: for nextjs projects

Create your configuration file (`biome.json` or `biome.jsonc`):

<details>
<summary><code>biome.jsonc</code></summary>

```jsonc
{
  "$schema": "node_modules/@biomejs/biome/configuration_schema.json",
  "root": true, // if this is the root of your project, false otherwise
  "extends": ["@mkvlrn/config/biome-node"], // or one of the other variations
  "overrides": [
    // any overrides, see biome docs
  ]
}
```

</details>

### typescript (tsconfig.json)

Variants:

- tsconfig-node: for regular node projects, without frontend
- tsconfig-nest: for nest projects, without frontend
- tsconfig-react: for react projects, without nextjs
- tsconfig-next: for nextjs projects

Create your configuration file:

<details>
<summary><code>tsconfig.json</code></summary>

```jsonc
{
  "extends": "@mkvlrn/config/tsconfig-node", // or one of the other variants
  "compilerOptions": {
    // add your custom rules here
  }
}
```

</details>

Obs: anything related to files needs to be set: rootDir, outDir, baseUrl, paths, etc - this prevents path confusion because the "original" tsconfig will be in node_modules.

## License

MIT
