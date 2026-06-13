/**
 * Central config for the registration + login flow.
 *
 * Registration is gated by World ID (World 3.0 / IDKit). Login + the user's
 * wallet are powered by Dynamic. Both read public env vars so the app can run
 * as a self-contained demo when they're absent and switch to the real SDKs
 * once configured.
 *
 *   NEXT_PUBLIC_WLD_APP_ID            World ID app id, e.g. "app_abc123"
 *   NEXT_PUBLIC_WLD_ACTION_REGISTER   World ID action for registration
 *   NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID  Dynamic environment id
 */

export const worldAppId = process.env.NEXT_PUBLIC_WLD_APP_ID ?? ""
export const worldActionRegister =
  process.env.NEXT_PUBLIC_WLD_ACTION_REGISTER ?? "register-trialland"
export const dynamicEnvironmentId =
  process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID ?? ""

/** True once a real World ID app id (`app_…`) is present. */
export const worldIdConfigured = worldAppId.startsWith("app_")

/** True once a real Dynamic environment id is present. */
export const dynamicConfigured = dynamicEnvironmentId.length > 0

/** The simulated chain we "register" wallets to when there's no real contract. */
export const registryChain = { name: "World Chain", chainId: 480 }
