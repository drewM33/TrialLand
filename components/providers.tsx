"use client"

import type { ReactNode } from "react"
import { DynamicContextProvider, mergeNetworks } from "@dynamic-labs/sdk-react-core"
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum"
import { dynamicConfigured, dynamicEnvironmentId } from "@/lib/auth-config"
import { trialCounterChain, trialCounterChainId } from "@/lib/trial-counter"

/**
 * Networks the embedded wallet must know about. Dynamic's WaaS connector throws
 * "EVM network not found" when asked for a chain that isn't registered here (or
 * enabled in the dashboard), so we explicitly register the contract's chain.
 */
const trialCounterRpcUrls = [
  process.env.NEXT_PUBLIC_RPC_URL,
  ...trialCounterChain.rpcUrls.default.http,
].filter((url): url is string => Boolean(url))

const evmNetworkOverrides = [
  {
    chainId: trialCounterChainId,
    networkId: trialCounterChainId,
    name: trialCounterChain.name,
    iconUrls: ["https://app.dynamic.xyz/assets/networks/eth.svg"],
    nativeCurrency: {
      name: trialCounterChain.nativeCurrency.name,
      symbol: trialCounterChain.nativeCurrency.symbol,
      decimals: trialCounterChain.nativeCurrency.decimals,
    },
    rpcUrls: trialCounterRpcUrls,
    blockExplorerUrls: [
      trialCounterChain.blockExplorers?.default.url ??
        "https://sepolia.etherscan.io",
    ],
  },
]

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
        overrides: {
          evmNetworks: (networks) =>
            mergeNetworks(evmNetworkOverrides, networks),
        },
        // Force Dynamic to surface its confirmation modal before the embedded
        // wallet signs a message or submits a transaction.
        transactionConfirmation: { required: false },
      }}
    >
      {children}
    </DynamicContextProvider>
  )
}
