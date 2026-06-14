import { NextResponse } from "next/server"
import { signRequest } from "@worldcoin/idkit-core/signing"

/**
 * Generates a short-lived RP signature for an IDKit 4.x proof request.
 * The signing key must never be exposed to the client.
 */
export async function POST(req: Request) {
  const signingKey = process.env.WLD_SECURE_SIGNING_KEY?.trim()
  if (!signingKey) {
    return NextResponse.json(
      { success: false, detail: "World ID RP signing key is not configured." },
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
