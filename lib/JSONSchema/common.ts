import { PayloadResponseType } from "../../types/schema-definition/payload-response-keys";
import { SchemaPropertyType } from "./types";

export const mdmTypeToSchemaType: Record<
  PayloadResponseType,
  Exclude<SchemaPropertyType, "null">
> = {
  "<string>": "string",
  "<integer>": "number",
  "<real>": "number",
  "<boolean>": "boolean",
  "<date>": "string",
  "<data>": "string",
  "<array>": "array",
  "<dictionary>": "object",
  "<any>": "string",
};
