# MDM Yaml Docs -> JSON Schema

The goal of this project is to convert all MDM Docs, specified in YAML, into
JSON Schema. The benefit to this conversion is the freedom to convert the
resulting JSON Schema into a sleu of different types, ex. TypeScript, Zod, etc.

The motivation for this, over manually writing the schemas is that in these schemas change fairly frequently and nobody wants to have to come back and manually go through this documentation.

### MDM Repository

https://github.com/apple/device-management

### Schema

https://github.com/apple/device-management/blob/release/docs/schema.yaml

### Instructions

After cloning, run `git submodule update --init` to initialize the `device-management` submodule.

Example run to generate JSON Schema files for all available MDM Profile schemas:

`bun run dev --out=file --kind=profiles`

Similarly, an example run to generate JSON Schema files for all available MDM Command schemas:

`bun run dev --out=file --kind=commands`

You can get the output to stdout instead:

`bun run dev --out=stdout --kind=profiles`

Verbose output can provide some more information if necessary:

`bun run dev --out=file --kind=commands --verbose`
