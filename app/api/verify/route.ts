import { NextResponse } from "next/server"
import type { IDKitResult } from "@worldcoin/idkit-core"

/**
 * Verifies a World ID proof server-side via the Developer Portal v4 endpoint.
 * The client never gets to assert its own uniqueness — the proof
 * is validated here against the app's `rp_id` before we let the human
 * register a wallet.
 */
export async function POST(req: Request) {
  const defaultRpId = process.env.NEXT_PUBLIC_WLD_RP_ID
  if (!defaultRpId?.startsWith("rp_")) {
    return NextResponse.json(
      { success: false, detail: "World ID RP ID is not configured on the server." },
      { status: 500 },
    )
  }

  let body: { rp_id?: string; idkitResponse?: IDKitResult }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json(
      { success: false, detail: "Invalid request body." },
      { status: 400 },
    )
  }

  const rpId = body.rp_id ?? defaultRpId
  if (!rpId.startsWith("rp_") && !rpId.startsWith("app_")) {
    return NextResponse.json(
      { success: false, detail: "Invalid RP ID." },
      { status: 400 },
    )
  }
  const { idkitResponse } = body
  if (!idkitResponse) {
    return NextResponse.json(
      { success: false, detail: "Missing IDKit response." },
      { status: 400 },
    )
  }

  let verifyRes: Response
  let verifyData: Record<string, unknown> = {}
  try {
    verifyRes = await fetch(`https://developer.world.org/api/v4/verify/${rpId}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(idkitResponse),
    })
    const rawBody = await verifyRes.text()
    if (rawBody) {
      verifyData = JSON.parse(rawBody) as Record<string, unknown>
    }
  } catch (error) {
    const detail =
      error instanceof Error
        ? error.message
        : "World verification request failed."
    return NextResponse.json({ success: false, detail }, { status: 400 })
  }

  if (!verifyRes.ok) {
    const detail =
      typeof verifyData.detail === "string"
        ? verifyData.detail
        : "World ID verification failed."
    return NextResponse.json(
      {
        success: false,
        code: typeof verifyData.code === "string" ? verifyData.code : undefined,
        detail,
        results: verifyData.results,
      },
      { status: 400 },
    )
  }

  const nullifier =
    (typeof verifyData.nullifier === "string" ? verifyData.nullifier : null) ??
    extractNullifier(idkitResponse)

  return NextResponse.json(
    {
      success: true,
      nullifier,
      results: verifyData.results,
      environment:
        typeof verifyData.environment === "string"
          ? verifyData.environment
          : undefined,
    },
    { status: 200 },
  )
}

function extractNullifier(result: IDKitResult): string | null {
  const firstResponse = result.responses[0]
  if (!firstResponse) return null
  if ("nullifier" in firstResponse && typeof firstResponse.nullifier === "string") {
    return firstResponse.nullifier
  }
  if (
    "session_nullifier" in firstResponse &&
    Array.isArray(firstResponse.session_nullifier)
  ) {
    return firstResponse.session_nullifier[0] ?? null
  }
  return null
}
