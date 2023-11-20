import fs from "node:fs";
import { BunFile } from "bun";

import {
  PayloadResponseKeys,
  PayloadResponseType,
} from "../../types/schema-definition/payload-response-keys";
import { TopLevel } from "../../types/schema-definition/top-level";
import { mdmTypeToSchemaType } from "./common";

class JSONSchema {
  private schema = {};
  constructor(private includeMeta: boolean = false) {}

  _evaluatePayloadKey(payloadKey: PayloadResponseKeys) {
    const {
      // Taken out, but unused..
      title,
      presence,
      key,

      type,
      content,
      rangelist,
      default: defaultValue,
      range,
      format,
      subkeys,

      // Used as _meta
      ...rest
    } = payloadKey;

    const evaluatedType = mdmTypeToSchemaType[type];
    let props: any = {
      type: evaluatedType,
      ...(this.includeMeta && { _meta: rest }),
      ...(content && { description: content }),
      ...(type !== "<array>" && { additionalProperties: false }),
      ...(defaultValue && { default: defaultValue }),
    };

    // TODO: <Any>, <date>, <data> - Data treated as string

    if (type === "<string>") {
      props = {
        ...props,
        ...(rangelist && { enum: rangelist }),
        ...(range?.min && { minLength: range.min }),
        ...(range?.max && { maxLength: range.max }),
        ...(format && { pattern: format, format: "regex" }),
      };
    }

    if (type === "<boolean>") {
    }

    if (type === "<array>" && subkeys) {
      props = {
        ...props,
        ...this._setupEvaluatePayloadKeys(subkeys, "<array>"),
      };
    }

    if (type === "<dictionary>" && subkeys) {
      props = { ...props, ...this._setupEvaluatePayloadKeys(subkeys, type) };
    }

    if (type === "<integer>" || type === "<real>") {
      props = {
        ...props,
        ...(rangelist && { enum: rangelist }),
      };
    }

    return props;
  }

  _setupEvaluatePayloadKeys(
    payloadKeys: Array<PayloadResponseKeys>,
    rootIs: Extract<
      PayloadResponseType,
      "<array>" | "<dictionary>"
    > = "<dictionary>"
  ) {
    let arrayProps: any = {
      items: {},
    };

    let props: any = {
      properties: {},
      required: [],
    };

    payloadKeys?.map((payloadKey) => {
      if (rootIs === "<array>") {
        arrayProps.items = {
          ...this._evaluatePayloadKey(payloadKey),
        };
      } else {
        props.properties[payloadKey.key] = {
          ...this._evaluatePayloadKey(payloadKey),
        };
        if (payloadKey.presence === "required") {
          props.required.push(payloadKey.key);
        }
      }
    });

    return rootIs === "<array>" ? arrayProps : props;
  }

  convertMdmSchema(schema: TopLevel) {
    const { title, description, payload, payloadkeys, responsekeys, reasons } =
      schema;

    let root: any = {
      title,
      description,
      type: "object",
      additionalProperties: false,
      ...(this.includeMeta && { _meta: { payload, reasons } }),
      properties: {},
      required: [],
    };

    if (payloadkeys) {
      root = {
        ...root,
        ...this._setupEvaluatePayloadKeys(payloadkeys),
      };
    }

    // If responsekeys exist, change the schema to have two top level
    // properties.
    if (responsekeys) {
      root = {
        ...root,
        properties: {
          PayloadKeys: {
            type: "object",
            additionalProperties: false,
            properties: {
              ...root.properties,
            },
          },
          ResponseKeys: {
            type: "object",
            additionalProperties: false,
            ...this._setupEvaluatePayloadKeys(responsekeys),
          },
        },
      };
    }

    this.schema = root;
  }

  writeTo(file: BunFile, dir?: string) {
    if (dir && !fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    Bun.write(file, JSON.stringify(this.schema, null, 2));
  }
}

export default JSONSchema;
