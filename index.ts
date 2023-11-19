import util from "node:util";
import fs from "node:fs";
import { exit } from "node:process";

import minimist from "minimist";
import logSymbols from "log-symbols";

import SchemaProvider from "./lib/SchemaProvider";
import JSONSchema from "./lib/JSONSchema";
import { TopLevel } from "./types/schema-definition/top-level";

type RunKind = "profiles" | "commands";
type OutKind = "file" | "stdout";
type CliArgs = {
  out: OutKind;
  kind: RunKind;
};
const run = async (kind: RunKind, out: OutKind, verbose: boolean = false) => {
  const schemaProvider = new SchemaProvider<TopLevel>("repo");
  const files = await (kind === "profiles"
    ? schemaProvider.getMDMProfiles()
    : schemaProvider.getMDMCommands());

  if (!files) {
    console.error("Failed to grab files from MDM.");
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

      if (out === "stdout") {
        jSchema.writeTo(Bun.stdout);
      } else if (out === "file") {
        jSchema.writeTo(
          Bun.file(
            `${dir}/${schema.title.toLowerCase().split(" ").join("_")}.jsonc`
          )
        );
      }

      results.push({ title: schema.title, status: 0 });
    } catch (e) {
      results.push({ title: schema.title, status: 1 });
    }
  }

  if (verbose) {
    results.map(({ title, status }) =>
      console.log(`${title}: ${status ? logSymbols.error : logSymbols.success}`)
    );
  }

  console.log(`${logSymbols.success} Task Completed ${logSymbols.success}`);
};

/** Main - Manages the cli interface and calls the run method according to args.
 * */
const cli = () => {
  const args = minimist<CliArgs>(Bun.argv);

  const { out, kind, verbose } = args;

  const EXPECTED_OUTS = ["file", "stdout"];
  if (!out || !EXPECTED_OUTS.includes(out)) {
    console.error("--out is required. ex. --out=file | --out=stdout");
    exit(1);
  }

  const EXPECTED_KINDS: Array<RunKind> = ["profiles", "commands"];
  if (!kind || !EXPECTED_KINDS.includes(kind)) {
    console.error("--kind is required. ex. --kind=profiles | --kind=commands");
    exit(1);
  }

  run(kind, out, verbose);
};

cli();
