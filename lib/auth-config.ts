/**
 * Central config for the registration + login flow.
 *
 * Registration is gated by World ID (IDKit 4.x). Login + the user's
 * wallet are powered by Dynamic. Both read public env vars so the app can run
 * as a self-contained demo when they're absent and switch to the real SDKs
 * once configured.
 *
 *   NEXT_PUBLIC_WLD_APP_ID              World ID app id, e.g. "app_abc123"
 *   NEXT_PUBLIC_WLD_RP_ID               World ID relying-party id, e.g. "rp_abc123"
 *   NEXT_PUBLIC_WLD_ACTION_REGISTER     World ID action for registration
 *   NEXT_PUBLIC_WLD_ALLOW_LEGACY_PROOFS "true" (default) or "false"
 *   NEXT_PUBLIC_WLD_ENVIRONMENT         "production" (default) or "staging"
 *   WLD_SECURE_SIGNING_KEY              RP signing key (server-side only)
 *   NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID  Dynamic environment id
 */

export const worldAppId = process.env.NEXT_PUBLIC_WLD_APP_ID ?? ""
export const worldRpId = process.env.NEXT_PUBLIC_WLD_RP_ID ?? ""
export const worldActionRegister =
  process.env.NEXT_PUBLIC_WLD_ACTION_REGISTER ?? "register-wallet"
const worldAllowLegacyProofsRaw =
  process.env.NEXT_PUBLIC_WLD_ALLOW_LEGACY_PROOFS ?? "true"
/** Accept 3.0 fallback proofs during migration when true. */
export const worldAllowLegacyProofs =
  worldAllowLegacyProofsRaw.toLowerCase() !== "false"
const worldEnvironmentRaw = process.env.NEXT_PUBLIC_WLD_ENVIRONMENT ?? "production"
/** IDKit environment ("production" unless explicitly set to "staging"). */
export const worldEnvironment =
  worldEnvironmentRaw.toLowerCase() === "staging" ? "staging" : "production"
export const dynamicEnvironmentId =
  process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID ?? ""

/** True once the app has both World ID app + RP ids (`app_…` + `rp_…`). */
export const worldIdConfigured =
  worldAppId.startsWith("app_") && worldRpId.startsWith("rp_")

/** True once a real Dynamic environment id is present. */
export const dynamicConfigured = dynamicEnvironmentId.length > 0

/** The simulated chain we "register" wallets to when there's no real contract. */
export const registryChain = { name: "World Chain", chainId: 480 }
