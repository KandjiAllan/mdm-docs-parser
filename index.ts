import fs from "node:fs";
import util from "node:util";
import { exit } from "node:process";

import minimist from "minimist";
import logSymbols from "log-symbols";

import SchemaProvider from "./lib/SchemaProvider";
import JSONSchema from "./lib/JSONSchema";
import { TopLevel } from "./types/schema-definition/top-level";

/**
 * TODO:
 *
 * Important
 *  - Circular references - Currently HSL and App Access New are the only
 *    culprits -- Closer to done
 *  - Handle ResponseKeys for MDM Commands -- DONE
 *
 * Less Important:
 *  - CLI arg to run on only specific files/bundles
 *  - Hide _meta in json schema files based on CLI arg -- DONE
 */

type RunKind = "profiles" | "commands";
type OutKind = "file" | "stdout";
type CliArgs = {
  out: OutKind;
  kind: RunKind;
  verbose?: boolean;
  exclude_meta?: boolean;
};
type RunOpts = Pick<CliArgs, "verbose" | "exclude_meta">;

const run = async (
  kind: RunKind,
  out: OutKind,
  { verbose = false, exclude_meta }: RunOpts
) => {
  const schemaProvider = new SchemaProvider<TopLevel>("repo");
  const files = await (kind === "profiles"
    ? schemaProvider.getMDMProfiles()
    : schemaProvider.getMDMCommands());

  if (!files) {
    console.error("Failed to grab files from MDM.");
    exit(1);
  }

  const results: Array<{ title: string; status: number }> = [];

  for (let i = 0; i < files.length; i++) {
    const schema = await schemaProvider.readYamlFile(files[i]);
    if (!schema) {
      console.error(`Failed to read file ${files[i]}`);
      continue;
    }

    if (schema.title === "Home Screen Layout") {
      // const x = JSON.stringify(schema, getCircularReplacer());
      console.log(util.inspect(schema, false, null, true));
    }
    try {
      const jSchema = new JSONSchema(!exclude_meta);
      jSchema.convertMdmSchema(schema);

      if (out === "stdout") {
        jSchema.writeTo(Bun.stdout);
      } else if (out === "file") {
        // Create directory for output

        const dir = `./output/${kind}`;
        const outFileName = (schema.payload?.payloadtype || schema.title)
          .toLowerCase()
          .split(" ")
          .join("_");
        jSchema.writeTo(Bun.file(`${dir}/${outFileName}.jsonc`), dir);
      }

      results.push({ title: schema.title, status: 0 });
    } catch (e) {
      if (verbose) {
        console.error(`Failed to convert: ${schema.title} --- ${e}`);
      }
      results.push({ title: schema.title, status: 1 });
    }
  }

  if (verbose) {
    results.map(({ title, status }) =>
      console.log(`${title}: ${status ? logSymbols.error : logSymbols.success}`)
    );
  }

  console.log(`\n${logSymbols.success} Task Completed ${logSymbols.success}`);
};

/** Main - Manages the cli interface and calls the run method according to args.
 * */
const cli = () => {
  const args = minimist<CliArgs>(Bun.argv);

  const { out, kind, exclude_meta, verbose } = args;

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

  run(kind, out, { verbose, exclude_meta });
};

cli();
