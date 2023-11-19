import { readdir } from "node:fs/promises";
import { join } from "node:path";

import yaml from "yaml";

const cycle = require("json-cycle");

export type SchemaProviderLoc = "repo";

export default class SchemaProvider<T> {
  constructor(private location: SchemaProviderLoc = "repo") {}

  // Assuming submodule is cloned and in root.
  static DEVICE_MANAGEMENT_REPO_LOC = "./device-management";
  static DEVICE_MANAGEMENT_REPO_MDM = `${this.DEVICE_MANAGEMENT_REPO_LOC}/mdm`;
  static DEVICE_MANAGEMENT_REPO_COMMANDS = `${this.DEVICE_MANAGEMENT_REPO_MDM}/commands`;
  static DEVICE_MANAGEMENT_REPO_PROFILES = `${this.DEVICE_MANAGEMENT_REPO_MDM}/profiles`;

  // Files to ignore as they are not actual mdm profiles.
  static DEVICE_MANAGEMENT_REPO_PROFILES_IGNORED = [
    "toplevel",
    "globalpreferences",
    "commonpayloadkeys",
    // TEMP
    "com.apple.homescreenlayout.yaml",
    "com.apple.applicationaccess.new.yaml",
  ];

  async getFiles(directoryPath: string) {
    try {
      const fileNames = await readdir(directoryPath);
      const filePaths = fileNames.map((fn) => join(directoryPath, fn));
      return filePaths;
    } catch (err) {
      console.error(err);
    }
  }

  async readYamlFile(filename: string = "./test-schemas/appaccessnew.yaml") {
    const TEST_FILE = Bun.file(filename);
    const yamlFileContent = await TEST_FILE.text();
    const parsedYaml: T = yaml.parse(yamlFileContent);

    // TODO:
    // A small hack to get out of circular references.
    // const y: T = JSON.parse(JSON.stringify(cycle.decycle(parsedYaml)));

    return parsedYaml;
  }

  async getMDMProfiles() {
    if (this.location === "repo") {
      const profiles = await this.getFiles(
        SchemaProvider.DEVICE_MANAGEMENT_REPO_PROFILES
      );
      return profiles?.filter(
        (file) =>
          !SchemaProvider.DEVICE_MANAGEMENT_REPO_PROFILES_IGNORED.includes(
            file.toLowerCase()
          )
      );
    }
  }

  async getMDMCommands() {
    if (this.location === "repo") {
      const commands = await this.getFiles(
        SchemaProvider.DEVICE_MANAGEMENT_REPO_COMMANDS
      );
      return commands;
    }
  }
}
