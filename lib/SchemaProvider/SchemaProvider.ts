import { readdir } from "node:fs/promises";
import { join } from "node:path";

import yaml from "yaml";

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

    /** Replaces circular references - dereferences one level  */
    // TODO: Currently sets subkeys, the typical circular reference field, to
    // undefined, so resulting type is usually unset, such as `unknown[]`.
    const dereferencer = () => {
      const cache = new WeakSet();
      const dereference = (val: any) => {
        if (val && typeof val == "object") {
          // TODO: Determines what subkeys gets replaced with.
          if (cache.has(val)) return;

          cache.add(val);

          const obj: any = Array.isArray(val) ? [] : {};
          for (let idx in val) {
            obj[idx] = dereference(val[idx]);
          }

          cache.delete(val);
          return obj;
        }

        return val;
      };

      return dereference;
    };

    return dereferencer()(parsedYaml);
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
