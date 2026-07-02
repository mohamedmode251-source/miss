/**
 * hooks/useDatabase.js
 * ─────────────────────────────────────────────────────────────
 * Tracks whether the Dexie database has opened successfully.
 * Use this at app startup to show an error screen if IndexedDB
 * is unavailable (very rare, but possible in private/incognito
 * mode on some older Safari versions).
 * ─────────────────────────────────────────────────────────────
 */

import { useState, useEffect } from 'react';
import db from '../database';

/**
 * @returns {{ ready: boolean, error: Error|null }}
 */
export function useDatabase() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    db.open()
      .then(() => {
        if (!cancelled) setReady(true);
      })
      .catch((err) => {
        console.error('[useDatabase] Failed to open database:', err);
        if (!cancelled) setError(err);
      });

    return () => { cancelled = true; };
  }, []);

  return { ready, error };
}
