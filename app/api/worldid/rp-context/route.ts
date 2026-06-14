import { NextResponse } from "next/server"
import { signRequest } from "@worldcoin/idkit-core/signing"

interface RpContextBody {
  action?: string
}

export async function POST(req: Request) {
  const rpId = process.env.NEXT_PUBLIC_WLD_RP_ID?.trim()
  const signingKey = process.env.WLD_SECURE_SIGNING_KEY?.trim()

  if (!rpId?.startsWith("rp_")) {
    return NextResponse.json(
      { success: false, detail: "World ID RP ID is not configured." },
      { status: 500 },
    )
  }
  if (!signingKey) {
    return NextResponse.json(
      { success: false, detail: "World ID signing key is not configured." },
      { status: 500 },
    )
  }

  let body: RpContextBody
  try {
    body = (await req.json()) as RpContextBody
  } catch {
    return NextResponse.json(
      { success: false, detail: "Invalid request body." },
      { status: 400 },
    )
  }

  const action = body.action?.trim()
  if (!action) {
    return NextResponse.json(
      { success: false, detail: "Missing action." },
      { status: 400 },
    )
  }

  try {
    const { sig, nonce, createdAt, expiresAt } = signRequest({
      signingKeyHex: signingKey,
      action,
    })
    return NextResponse.json({
      success: true,
      rp_id: rpId,
      signature: sig,
      nonce,
      created_at: createdAt,
      expires_at: expiresAt,
    })
  } catch (error) {
    const detail =
      error instanceof Error ? error.message : "Failed to generate RP context."
    return NextResponse.json({ success: false, detail }, { status: 500 })
  }
}
