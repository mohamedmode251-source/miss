/**
 * services/StudentService.js
 * ─────────────────────────────────────────────────────────────
 * All CRUD operations for the "students" table.
 *
 * Performance notes:
 *  - getByGroup() uses the group_id *index* (O(log n)), not getAll().
 *  - getAll() is used only for views that need cross-group data.
 * ─────────────────────────────────────────────────────────────
 */

import db from '../database';
import { validateStudent } from '../utils/validators';

/**
 * Fetch ALL students across all groups.
 * Use sparingly — prefer getByGroup() when group is known.
 * @returns {Promise<Student[]>}
 */
export async function getAll() {
  try {
    return await db.students.toArray();
  } catch (err) {
    console.error('[StudentService.getAll] Failed:', err);
    throw new Error('فشل تحميل الطلاب من قاعدة البيانات');
  }
}

/**
 * Fetch students belonging to a specific group.
 * Uses the group_id index for fast lookup.
 * @param {string} groupId
 * @returns {Promise<Student[]>}
 */
export async function getByGroup(groupId) {
  if (!groupId) return [];
  try {
    return await db.students.where('group_id').equals(groupId).toArray();
  } catch (err) {
    console.error('[StudentService.getByGroup] Failed:', err);
    throw new Error('فشل تحميل طلاب المجموعة');
  }
}

/**
 * Fetch a single student by ID.
 * @param {string} id
 * @returns {Promise<Student|undefined>}
 */
export async function getById(id) {
  try {
    return await db.students.get(id);
  } catch (err) {
    console.error('[StudentService.getById] Failed:', err);
    throw new Error('فشل تحميل بيانات الطالب');
  }
}

/**
 * Save (create or update) a student.
 * Validates the student object before writing.
 * @param {Student} student
 * @returns {Promise<Student>} — the saved student
 */
export async function save(student) {
  validateStudent(student); // throws ValidationError if invalid

  try {
    await db.students.put(student);
    return student;
  } catch (err) {
    console.error('[StudentService.save] Failed:', err);
    throw new Error('فشل حفظ بيانات الطالب: ' + err.message);
  }
}

/**
 * Delete a single student by ID.
 * @param {string} studentId
 * @returns {Promise<void>}
 */
export async function remove(studentId) {
  if (!studentId || typeof studentId !== 'string') {
    throw new Error('[StudentService.remove] Invalid studentId');
  }
  try {
    await db.students.delete(studentId);
  } catch (err) {
    console.error('[StudentService.remove] Failed:', err);
    throw new Error('فشل حذف الطالب: ' + err.message);
  }
}
