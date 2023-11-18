/**
 * The supportedOS object is used in the payload object to indicate overall
//  * support for this object on each OS, as well as which enrollment modes are
//  * supported per OS. The supportedOS key may also appear on any payload key
//  * defined in payloadkeys or responsekeys array item objects. Each payload key
//  * is assumed to "inherit" the supportedOS values from the payload object, but
 * that is then updated with any items in the key's own supportedOS object if
 * present. This also overriding specific values in supportedOS on a per-key
 * basis without the need to duplicate the entire supportedOS value from the
 * payload.
 */
export interface SupportedOS {
  iOS?: OS; // Supported features on this iOS
  macOS?: OS; // Supported features on this macOS
  tvOS?: OS; // Supported features on this tvOS
  watchOS?: OS; // Supported features on this watchOS
}

export type Scope = "system" | "user";
export type Enrollment = "device" | "user" | "local";

/**
  Indicates whether a payload or payload key can used with or without shared iPad in effect.
  If set to 'allowed', then the payload or payload key can be used both with or without shared iPad in effect.
  If set to 'required', then the payload or payload key can only be used if shared iPad is in effect.
  If set to 'forbidden', then the payload or payload key cannot be used if shared iPad is in effect.
  If set to 'ignored', then the payload or payload key can be used, but is ignored if shared iPad is in effect.
 */
export type Mode = "allowed" | "required" | "forbidden" | "ignored";

export interface OS {
  introduced?: string; // OS version where feature was introduced
  deprecated?: string; // OS version where feature was deprecated
  removed?: string; // OS version where feature was removed
  accessrights?: string; // The MDM protocol access rights required on the device to execute the command
  multiple?: boolean; // Indicates whether multiple copies of the payload can be installed
  devicechannel?: boolean; // Indicates whether the command or profile is supported on the device channel
  userchannel?: boolean; // indicates whether the command or profile is supported on the user channel
  supervised?: boolean; // Indicates whether the command or profile can only be executed on supervised devices
  requiresdep?: boolean; // If True, the command can only be executed on devices provisioned in DEP
  userapprovedmdm?: boolean; // If True, the command can only be executed on devices with user-approved MDM enrollment
  allowmanualinstall?: boolean; // If True, the profile can be installed manually by a user on the device
  sharedipad?: SharedIpad; // Additional behavior specific to shared iPad devices
  userenrollment?: object; // Additional behavior when user enrollment is in effect
  "always-skippable"?: boolean; //	If True, indicates that the skip key's corresponding Setup pane is always skipped. If False, indicates that the skip key's corresponding Setup pane may be shown, depending on exactly when during the setup flow it occurs. This is only used in skipkeys.yaml.
  "allowed-enrollments"?: Array<Scope>; // Array of allowed enrollment types for declarative device management
  "allowed-scopes"?: Array<Scope>; // Array of allowed enrollment scopes for declarative device management
}

/**
 * The mode can have one of four values: allowed, required, forbidden, and
 * ignored. If set to allowed, then the payload or payload key can be used both
 * with or without shared iPad in effect. If set to required, then the payload
 * or payload key can only be used if shared iPad is in effect. If set to
 * forbidden, then the payload or payload key cannot be used if shared iPad is
 * in effect. If set to ignored, then the payload or payload key can be used,
 * but is ignored if shared iPad is in effect.
 */
export interface SharedIpad {
  // default: "allowed"
  mode?: Mode; // Indicates whether a payload or payload key can used with shared iPad
  devicechannel?: boolean; // Defines if the payload can be installed on the device MDM channel
  userchannel?: boolean; // Defines if the payload can be installed on the user MDM channel
  "allowed-scopes"?: Array<Scope>; // Array of allowed enrollment scopes for declarative device management
}

/**
 * The mode can have one of four values: allowed, required, forbidden, and
 * ignored. If set to allowed, then the payload or payload key can be used both
 * with or without user enrollment in effect. If set to required, then the
 * payload or payload key can only be used if user enrollment is in effect. If
 * set to forbidden, then the payload or payload key cannot be used if user
 * enrollment is in effect. If set to ignored, then the payload or payload key
 * can be used, but is ignored if user enrollment is in effect.
 */
export interface UserEnrollment {
  mode?: Mode; // Indicates how a payload or payload key can only be used if user enrollment is in effect
  behavior?: string; // Describes any special behavior for the payload or payload key if user enrollment is in effect
}
