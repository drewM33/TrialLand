import { NextResponse } from "next/server"
import { signRequest } from "@worldcoin/idkit-core/signing"

/**
 * Generates a short-lived RP signature for an IDKit 4.x proof request.
 * The signing key must never be exposed to the client.
 */
export async function POST(req: Request) {
  const rawKey = process.env.WORLD_RP_SIGNING_KEY
  if (!rawKey) {
    return NextResponse.json(
      { success: false, detail: "World ID RP signing key is not configured." },
      { status: 500 },
    )
  }

  // Accept the key with or without a `0x` prefix / surrounding whitespace.
  const signingKey = rawKey.trim().replace(/^0x/i, "")
  if (!/^[0-9a-fA-F]+$/.test(signingKey)) {
    return NextResponse.json(
      {
        success: false,
        detail:
          "WORLD_RP_SIGNING_KEY must be a hex-encoded signing key. It looks like the RP ID (rp_...) was used instead of the secret signing key.",
      },
      { status: 500 },
    )
  }

  let action: string | undefined
  try {
    const body = (await req.json()) as { action?: string }
    action = body.action
  } catch {
    return NextResponse.json(
      { success: false, detail: "Invalid request body." },
      { status: 400 },
    )
  }

  if (!action) {
    return NextResponse.json(
      { success: false, detail: "Missing action." },
      { status: 400 },
    )
  }

  const { sig, nonce, createdAt, expiresAt } = signRequest({
    signingKeyHex: signingKey,
    action,
  })

  return NextResponse.json({
    sig,
    nonce,
    created_at: createdAt,
    expires_at: expiresAt,
  })
}
