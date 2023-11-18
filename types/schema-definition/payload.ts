import { SupportedOS } from "./supported-os";

export type PayloadApply = "single" | "multiple" | "combined";

export interface Payload {
  payloadtype?: string; // Type of the profile payload
  requesttype?: string; // Type of the MDM command
  declarationtype?: string; // Type of the declaration payload
  statusitemtype?: string; // Type of the status payload
  credentialtype?: string; // Type of the credential asset data
  supportedOS?: SupportedOS; // Identifies the range of supported OS versions that support the entire payload
  /**
    Indicates how multiple configurations of the same type are applied.
    If set to 'single', then only one configuration will be applied.
    If set to 'multiple', then each configuration is applied separately.
    If set to 'combined', then all configurations are combined into a single effective configuration.
   */
  apply?: PayloadApply; // Indicates how multiple configurations of the same type are applied
  content?: string; // Description of the payload
}
