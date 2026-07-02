/**
 * services/GroupService.js
 * ─────────────────────────────────────────────────────────────
 * All CRUD operations for the "groups" table.
 * All writes are validated and awaited before returning.
 * Deleting a group atomically removes its students too (transaction).
 * ─────────────────────────────────────────────────────────────
 */

import db from '../database';
import { validateGroup } from '../utils/validators';

/**
 * Fetch all groups from IndexedDB, sorted by name.
 * @returns {Promise<Group[]>}
 */
export async function getAll() {
  try {
    const groups = await db.groups.toArray();
    return groups.sort((a, b) => (a.name || '').localeCompare(b.name || '', 'ar'));
  } catch (err) {
    console.error('[GroupService.getAll] Failed:', err);
    throw new Error('فشل تحميل المجموعات من قاعدة البيانات');
  }
}

/**
 * Fetch a single group by ID.
 * @param {string} id
 * @returns {Promise<Group|undefined>}
 */
export async function getById(id) {
  try {
    return await db.groups.get(id);
  } catch (err) {
    console.error('[GroupService.getById] Failed:', err);
    throw new Error('فشل تحميل المجموعة');
  }
}

/**
 * Save (create or update) a group.
 * Validates the group before writing.
 * @param {Group} group
 * @returns {Promise<Group>} — the saved group
 */
export async function save(group) {
  validateGroup(group); // throws ValidationError if invalid

  try {
    await db.groups.put(group);
    return group;
  } catch (err) {
    console.error('[GroupService.save] Failed:', err);
    throw new Error('فشل حفظ المجموعة: ' + err.message);
  }
}

/**
 * Delete a group AND all of its students in a single transaction.
 * If anything fails, the transaction rolls back — no partial deletes.
 * @param {string} groupId
 * @returns {Promise<void>}
 */
export async function remove(groupId) {
  if (!groupId || typeof groupId !== 'string') {
    throw new Error('[GroupService.remove] Invalid groupId');
  }

  try {
    await db.transaction('rw', db.groups, db.students, async () => {
      // Delete all students belonging to this group
      await db.students.where('group_id').equals(groupId).delete();
      // Delete the group itself
      await db.groups.delete(groupId);
    });
  } catch (err) {
    console.error('[GroupService.remove] Transaction failed:', err);
    throw new Error('فشل حذف المجموعة: ' + err.message);
  }
}
