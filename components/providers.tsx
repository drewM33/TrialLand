"use client"

import type { ReactNode } from "react"
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core"
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum"
import { dynamicConfigured, dynamicEnvironmentId } from "@/lib/auth-config"

/**
 * Wraps the app in Dynamic's context when a real environment id is configured.
 * Dynamic powers the user's embedded wallet and the login flow. Without an env
 * id the app still runs end-to-end via the simulated demo paths.
 */
export function Providers({ children }: { children: ReactNode }) {
  if (!dynamicConfigured) return <>{children}</>

  return (
    <DynamicContextProvider
      settings={{
        environmentId: dynamicEnvironmentId,
        walletConnectors: [EthereumWalletConnectors],
      }}
    >
      {children}
    </DynamicContextProvider>
  )
}
