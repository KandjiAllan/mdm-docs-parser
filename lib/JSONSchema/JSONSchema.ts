import util from "node:util";

import {
  PayloadResponseKeys,
  PayloadResponseType,
} from "../../types/schema-definition/payload-response-keys";
import { TopLevel } from "../../types/schema-definition/top-level";
import { mdmTypeToSchemaType } from "./common";
import { BunFile } from "bun";

class JSONSchema {
  private schema = {};
  constructor() {}

  _evaluatePayloadKey(payloadKey: PayloadResponseKeys) {
    const {
      type,
      // title,
      content,
      rangelist,
      default: defaultValue,
      range,
      format,
      subkeys,
    } = payloadKey;
    const evaluatedType = mdmTypeToSchemaType[type];

    let props: any = {
      // ...(title && { title }),
      ...(content && { description: content }),
      additionalProperties: false,
      type: evaluatedType,
      ...(defaultValue && { default: defaultValue }),
    };

    // TODO: <Any>, <date>, <data>

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
      // The catch-all standard handling for all cases covers boolean for now.
    }

    if (type === "<array>") {
      if (subkeys) {
        props = {
          ...props,
          ...this._setupEvaluatePayloadKeys(subkeys, "<array>"),
        };
      }
    }

    if (type === "<dictionary>") {
      if (subkeys) {
        props = { ...props, ...this._setupEvaluatePayloadKeys(subkeys, type) };
      }
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
      properties: {},
      required: [],
    };

    if (payloadkeys) {
      root = {
        ...root,
        ...this._setupEvaluatePayloadKeys(payloadkeys),
      };
    }

    this.schema = root;
  }

  writeTo(file: BunFile) {
    // const out = util.inspect(this.schema, false, null, true);
    Bun.write(file, JSON.stringify(this.schema, null, 2));
  }
}

export default JSONSchema;
