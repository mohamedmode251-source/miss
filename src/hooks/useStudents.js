/**
 * hooks/useStudents.js
 * ─────────────────────────────────────────────────────────────
 * Reusable React hook for student data and CRUD operations.
 * Can load all students or filter by group.
 *
 * Usage (all students):
 *   const { students, loading, refresh, saveStudent, removeStudent } = useStudents();
 *
 * Usage (by group):
 *   const { students, loading, refresh, saveStudent, removeStudent } = useStudents({ groupId: 'abc' });
 * ─────────────────────────────────────────────────────────────
 */

import { useState, useEffect, useCallback } from 'react';
import * as StudentService from '../services/StudentService';

/**
 * @param {{ groupId?: string }} options
 */
export function useStudents({ groupId } = {}) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = groupId
        ? await StudentService.getByGroup(groupId)
        : await StudentService.getAll();
      setStudents(data);
    } catch (err) {
      console.error('[useStudents.refresh]', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const saveStudent = useCallback(async (student) => {
    const saved = await StudentService.save(student);
    await refresh();
    return saved;
  }, [refresh]);

  const removeStudent = useCallback(async (studentId) => {
    await StudentService.remove(studentId);
    await refresh();
  }, [refresh]);

  return { students, loading, error, refresh, saveStudent, removeStudent };
}
