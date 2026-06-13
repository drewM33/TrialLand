import { NextResponse } from "next/server"
import {
  verifyCloudProof,
  type IVerifyResponse,
} from "@worldcoin/idkit-core/backend"
import type { ISuccessResult } from "@worldcoin/idkit-core"

/**
 * Verifies a World ID (World 3.0) proof server-side via the Developer Portal's
 * cloud verify. The client never gets to assert its own uniqueness — the proof
 * is validated here against the app's `app_id` + action before we let the human
 * register a wallet.
 */
export async function POST(req: Request) {
  const appId = process.env.NEXT_PUBLIC_WLD_APP_ID as `app_${string}` | undefined
  if (!appId?.startsWith("app_")) {
    return NextResponse.json(
      { success: false, detail: "World ID is not configured on the server." },
      { status: 500 },
    )
  }

  let body: { proof?: ISuccessResult; action?: string; signal?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json(
      { success: false, detail: "Invalid request body." },
      { status: 400 },
    )
  }

  const { proof, action, signal } = body
  if (!proof || !action) {
    return NextResponse.json(
      { success: false, detail: "Missing proof or action." },
      { status: 400 },
    )
  }

  const verifyRes = (await verifyCloudProof(
    proof,
    appId,
    action,
    signal,
  )) as IVerifyResponse

  if (verifyRes.success) {
    // Proof is valid. The per-human, per-action nullifier is in
    // `proof.nullifier_hash` and is what the client binds to the wallet.
    return NextResponse.json({ success: true }, { status: 200 })
  }

  return NextResponse.json(
    { ...verifyRes, success: false },
    { status: 400 },
  )
}
