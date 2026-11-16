"use client";

import { setNonce } from "get-nonce";
import { createContext, use, type ReactNode } from "react";

/**
 * Hands the per-request CSP nonce to client code that injects <style>
 * elements at runtime, which the policy would otherwise block:
 *
 * - react-remove-scroll (scroll lock behind the Sheet and the Select menu)
 *   reads it through `get-nonce`;
 * - the Radix Select viewport takes it as a prop (see components/ui/select.tsx).
 *
 * The nonce travels in the page's RSC payload. That does not weaken the
 * policy: markup injected by an attacker cannot read script text, and code
 * that could read it is already running.
 */
const NonceContext = createContext<string | undefined>(undefined);

export function NonceProvider({ nonce, children }: { nonce: string | undefined; children: ReactNode }) {
  // Set during render, before any child mounts and injects its styles.
  if (nonce) setNonce(nonce);
  return <NonceContext value={nonce}>{children}</NonceContext>;
}

export function useNonce(): string | undefined {
  return use(NonceContext);
}
