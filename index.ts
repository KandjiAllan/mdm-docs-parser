import util from "node:util";
import yaml from "yaml";
import { TopLevel } from "./types/schema-definition/top-level";
import JSONSchema from "./lib/JSONSchema/JSONSchema";

// Read test file and extract string content
const extractYaml = async () => {
  const TEST_FILE = Bun.file("./wifi.yaml");
  const yamlFileContent = await TEST_FILE.text();

  const parsedYaml: TopLevel = yaml.parse(yamlFileContent);

  return parsedYaml;
};

const parsedSchema = await extractYaml();

const jSchema = new JSONSchema();
console.log(
  util.inspect(
    jSchema.convertMdmSchema(parsedSchema),
    false,
    null,
    true /* enable colors */
  )
);
