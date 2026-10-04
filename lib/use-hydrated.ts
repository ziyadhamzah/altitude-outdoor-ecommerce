'use client';

import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

/**
 * Returns true only after the first client render. Persisted stores start empty
 * on the server, so any UI that depends on stored state must wait for this flag
 * to avoid a hydration mismatch.
 */
export const useHydrated = (): boolean =>
  useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );