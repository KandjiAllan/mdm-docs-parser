import { SupportedOS } from "./supported-os";

export type PayloadResponseType =
  | "<string>"
  | "<integer>"
  | "<real>"
  | "<boolean>"
  | "<date>"
  | "<data>"
  | "<array>"
  | "<dictionary>"
  | "<any>";

export type PayloadResponseSubType = "<url>" | "<hostname>" | "<email>";

export type PayloadResponsePresence = "required" | "optional";

export type PayloadResponseDefault = "string" | "number" | "boolean";

export type PayloadResponseCombineType =
  | "boolean-or"
  | "boolean-and"
  | "number-min"
  | "number-max"
  | "enum-lowest"
  | "enum-highest"
  | "first"
  | "array-append"
  | "set-union"
  | "set-intersection";

/**
    The type value can be one of: <string>, <integer>, <real>, <boolean>,
    <date>, <data>, <array>, <dictionary>, or <any>. The value <any> may be used
    to indicate that any of the standard values can be used without any
    expectation that the value will be validated.

    The subtype value can be one of: <url>, <hostname>, or <email>, to indicate
    the expected value of a string.

    The presence value can be one of: required or optional.
 */
export interface PayloadResponseKeys {
  key: string; // The name of the key
  title?: string; // The title of the key
  supportedOS?: SupportedOS; // Identifies the range of supported OS versions that support the key
  type: PayloadResponseType; // The type of key
  subtype?: PayloadResponseSubType; // Indicates the expected format of the string value of the key
  assettypes?: Array<string>; // Indicates the set of allowed asset types
  presence?: PayloadResponsePresence; //	Whether the key is required or optional
  rangelist?: Array<string | number>; // List of allowed values for this key
  range?: Range; //	Bounds for the value of this key
  default?: PayloadResponseDefault; // The default value for the key
  format?: string; // The format for the value expressed as a regular expression
  repetition?: Repetition; // Cardinality for this value
  /**
    For a configuration that will be combined, indicates how this key is combined with ones from other configurations.
        * boolean-or - multiple <boolean> values are combined using a logical OR operation
        * boolean-and - multiple <boolean> values are combined using a logical AND operation
        * number-min - multiple <integer> or <real> values are combined by using the smallest value
        * number-max - multiple <integer> or <real> values are combined by using the largest value
        * enum-lowest - multiple <string> values with a rangelist are combined by using the value whose position is lowest in the range list
        * enum-highest - multiple <string> values with a rangelist are combined by using the value whose position is highest in the range list
        * first - multiple values are combined by using the first value that is processed
        * array-append - multiple <array> values are combined by concatenating the values in each array into a new array
        * set-union - multiple <array> values are combined by returning the unique union of all values in each array
        * set-intersection - multiple <array> values are combined by returning the unique intersection of all values in each array
   */
  combinetype?: PayloadResponseCombineType; // Indicates how this key is combined with ones from other configurations
  content?: string; // Description of the payload key
  subkeytype?: string; // A name that uniquely represents the structured subkey object
  subkeys?: Array<PayloadResponseKeys>; // An array of payload keys
}

export interface Range {
  min?: number; // Lower bound of range
  max?: number; // Upper bound of range
}

export interface Repetition {
  min: number; // Lower bound of repetition
  max: number; // Upper bound of repetition
}
