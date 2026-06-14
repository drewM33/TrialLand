const test = require("node:test")
const assert = require("node:assert/strict")
const fs = require("node:fs")
const path = require("node:path")

const rootDir = path.resolve(__dirname, "..")

const deprecatedWorldIdValues = [
  "register-trialland",
  "app_2cbc42a8ce3b619da56e06b5079b5558",
  "rp_360e04a1542a31be",
  "0x57c93126e9ed9371aea1e1bc25331a1e4a3cba73d23048b73517ad4607bc170c",
]

const filesToScan = [".env.example", "lib/auth-config.ts"]
if (fs.existsSync(path.join(rootDir, ".env.local"))) {
  filesToScan.push(".env.local")
}

const expectedCurrentValues = {
  NEXT_PUBLIC_WLD_APP_ID: "app_5e22b7aeace5c59e5217ad7e6c928324",
  NEXT_PUBLIC_WLD_RP_ID: "rp_125083d98f54ac84",
  NEXT_PUBLIC_WLD_ACTION_REGISTER: "register-wallet",
}

test("World ID config files do not contain deprecated values", () => {
  for (const relativeFilePath of filesToScan) {
    const absoluteFilePath = path.join(rootDir, relativeFilePath)
    const content = fs.readFileSync(absoluteFilePath, "utf8")

    for (const deprecatedValue of deprecatedWorldIdValues) {
      assert.ok(
        !content.includes(deprecatedValue),
        `${relativeFilePath} still contains deprecated value: ${deprecatedValue}`,
      )
    }
  }
})

test("World ID action uses register-wallet in checked config files", () => {
  const worldIdActionPattern = /NEXT_PUBLIC_WLD_ACTION_REGISTER.*register-wallet/

  for (const relativeFilePath of filesToScan) {
    const absoluteFilePath = path.join(rootDir, relativeFilePath)
    const content = fs.readFileSync(absoluteFilePath, "utf8")
    assert.match(
      content,
      worldIdActionPattern,
      `${relativeFilePath} is missing register-wallet action`,
    )
  }
})

test("Local World ID env values match current canonical IDs", () => {
  const localEnvPath = path.join(rootDir, ".env.local")
  if (!fs.existsSync(localEnvPath)) {
    return
  }

  const localEnv = fs.readFileSync(localEnvPath, "utf8")

  for (const [envKey, expectedValue] of Object.entries(expectedCurrentValues)) {
    assert.match(
      localEnv,
      new RegExp(`^${envKey}=${expectedValue}$`, "m"),
      `.env.local ${envKey} is not set to expected value`,
    )
  }
})
