export interface Reason {
  value?: string; // The Remote Management reason code.
  description?: string; // Description of the Remote Management reason code.
  details?: Array<Detail>; // Keys defined in the Details dictionary
}

export type DetailType =
  | "<string>"
  | "<integer>"
  | "<real>"
  | "<boolean>"
  | "<date>"
  | "<data>"
  | "<array>"
  | "<dictionary>"
  | "<any>";

export interface Detail {
  key: string; // The name of the dictionary key.
  description: string; // Description of the dictionary item.
  type: DetailType; // The type of the dictionary value.
}
