import { NextResponse } from "next/server"
import type { IDKitResult } from "@worldcoin/idkit-core"

const VERIFY_URL = "https://developer.world.org/api/v4/verify"

/**
 * Verifies a World ID proof server-side via the Developer Portal v4 API.
 * The client forwards the raw IDKit result payload — no remapping required.
 */
export async function POST(req: Request) {
  const rpId = process.env.NEXT_PUBLIC_WLD_RP_ID?.trim()
  if (!rpId?.startsWith("rp_") && !rpId?.startsWith("app_")) {
    return NextResponse.json(
      { success: false, detail: "World ID RP id is not configured on the server." },
      { status: 500 },
    )
  }

  let proof: IDKitResult
  try {
    proof = (await req.json()) as IDKitResult
  } catch {
    return NextResponse.json(
      { success: false, detail: "Invalid request body." },
      { status: 400 },
    )
  }

  if (!proof?.protocol_version || !proof.responses?.length) {
    return NextResponse.json(
      { success: false, detail: "Missing proof payload." },
      { status: 400 },
    )
  }

  const verifyRes = await fetch(`${VERIFY_URL}/${rpId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(proof),
  })

  const data = (await verifyRes.json().catch(() => ({}))) as {
    success?: boolean
    detail?: string
    code?: string
    nullifier?: string
  }

  if (verifyRes.ok && data.success) {
    return NextResponse.json({ success: true, nullifier: data.nullifier }, { status: 200 })
  }

  return NextResponse.json(
    { ...data, success: false },
    { status: verifyRes.ok ? 400 : verifyRes.status },
  )
}
