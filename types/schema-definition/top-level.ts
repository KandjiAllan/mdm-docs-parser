import { Payload } from "./payload";
import { PayloadResponseKeys } from "./payload-response-keys";
import { Reason } from "./reason";

export interface TopLevel {
  title: string; // Title for this schema object
  description?: string; // Description of this schema object
  payload?: Payload; // Information about the object as a whole
  payloadkeys?: Array<PayloadResponseKeys>; // A list of YAML objects representing the command request
  responsekeys?: Array<PayloadResponseKeys>; // A list of YAML objects representing the command response
  reasons?: Array<Reason>; // A list of YAML objects representing declarative device management status reason codes
}
