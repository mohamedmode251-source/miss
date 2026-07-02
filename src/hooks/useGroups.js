/**
 * hooks/useGroups.js
 * ─────────────────────────────────────────────────────────────
 * Reusable React hook for group data and CRUD operations.
 * Encapsulates all state management and service calls.
 *
 * Usage:
 *   const { groups, loading, error, refresh, createGroup, updateGroup, removeGroup } = useGroups();
 * ─────────────────────────────────────────────────────────────
 */

import { useState, useEffect, useCallback } from 'react';
import * as GroupService from '../services/GroupService';

/**
 * @returns {{
 *   groups: Group[],
 *   loading: boolean,
 *   error: Error|null,
 *   refresh: () => Promise<void>,
 *   createGroup: (group: Group) => Promise<Group>,
 *   updateGroup: (group: Group) => Promise<Group>,
 *   removeGroup: (groupId: string) => Promise<void>,
 * }}
 */
export function useGroups() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await GroupService.getAll();
      setGroups(data);
    } catch (err) {
      console.error('[useGroups.refresh]', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createGroup = useCallback(async (group) => {
    const saved = await GroupService.save(group);
    await refresh();
    return saved;
  }, [refresh]);

  const updateGroup = useCallback(async (group) => {
    const saved = await GroupService.save(group);
    await refresh();
    return saved;
  }, [refresh]);

  const removeGroup = useCallback(async (groupId) => {
    await GroupService.remove(groupId);
    await refresh();
  }, [refresh]);

  return { groups, loading, error, refresh, createGroup, updateGroup, removeGroup };
}
