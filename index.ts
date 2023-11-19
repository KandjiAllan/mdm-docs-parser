import util from "node:util";
import fs from "node:fs";
import { exit } from "node:process";

import minimist from "minimist";
import logSymbols from "log-symbols";

import SchemaProvider from "./lib/SchemaProvider";
import JSONSchema from "./lib/JSONSchema";
import { TopLevel } from "./types/schema-definition/top-level";

const run = async (kind: "profiles" | "commands") => {
  const schemaProvider = new SchemaProvider<TopLevel>("repo");
  const files = await (kind === "profiles"
    ? schemaProvider.getMDMProfiles()
    : schemaProvider.getMDMCommands());

  if (!files) {
    exit(1);
  }

  // Create directory for output
  const dir = `./output/${kind}`;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const results: Array<{ title: string; status: number }> = [];

  for (let i = 0; i < files.length; i++) {
    const schema = await schemaProvider.readYamlFile(files[i]);
    try {
      const jSchema = new JSONSchema();
      jSchema.convertMdmSchema(schema);

      jSchema.writeTo(Bun.file(`${dir}/${schema.title}`));
      results.push({ title: schema.title, status: 0 });
    } catch (e) {
      results.push({ title: schema.title, status: 1 });
    }
  }

  results.map(({ title, status }) =>
    console.log(`${title}: ${status ? logSymbols.error : logSymbols.success}`)
  );
};

run("commands");
