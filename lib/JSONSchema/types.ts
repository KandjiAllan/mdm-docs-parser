export type SchemaType = "object";
export type SchemaPropertyType =
  | "object"
  | "boolean"
  | "array"
  | "number"
  | "string"
  | "null";

export interface SchemaProperty
  extends StringTypeKeyword,
    NumberTypeKeyword,
    ObjectTypeKeyword,
    ArrayTypeKeyword,
    CommonTypeKeyword {}

export type SchemaStringTypeFormat =
  | "date"
  | "date-time"
  | "uri"
  | "email"
  | "hostname"
  | "ipv4"
  | "ipv6"
  | "regex";

export interface StringTypeKeyword {
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  format?: SchemaStringTypeFormat;
}

export interface NumberTypeKeyword {
  multipleOf?: number;
  exclusiveMinimum?: number;
  exclusiveMaximum?: number;
  minimum?: number;
  maximum?: number;
}

export interface ObjectTypeKeyword {
  minProperties?: number;
  maxProperties?: number;
  required?: Array<string>;
  properties?: SchemaProperty;
  additionalProperties?: boolean;
}

export interface ArrayTypeKeyword {
  minItems?: number;
  maxItems?: number;
  uniqueItems?: boolean;
  items?: Array<SchemaProperty>;
}

export interface CommonTypeKeyword {
  title?: string;
  description?: string;
  type?: SchemaPropertyType;
  enum?: Array<any>;
  const?: any;
  default?: any;
}
