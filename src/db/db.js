/**
 * db/db.js  —  Backward-Compatible Shim
 * ─────────────────────────────────────────────────────────────
 * This file replaces the old Firebase + raw-IndexedDB implementation.
 *
 * It exports the EXACT same function signatures that App.js imports,
 * so zero changes are needed in App.js.
 *
 * All storage is now handled by Dexie.js through the service layer:
 *   GroupService   → src/services/GroupService.js
 *   StudentService → src/services/StudentService.js
 *   BackupService  → src/services/BackupService.js
 *
 * Firebase / cloud sync has been REMOVED.
 * This is a fully offline, local-first application.
 * ─────────────────────────────────────────────────────────────
 */

import * as GroupService from '../services/GroupService';
import * as StudentService from '../services/StudentService';
import * as BackupService from '../services/BackupService';

// ── Groups ────────────────────────────────────────────────────

/**
 * Fetch all groups.
 * @returns {Promise<Group[]>}
 */
export async function getGroups() {
  return GroupService.getAll();
}

/**
 * Save (create or update) a group.
 * @param {Group} group
 * @returns {Promise<Group>}
 */
export async function saveGroup(group) {
  return GroupService.save(group);
}

/**
 * Delete a group and all its students atomically.
 * @param {string} groupId
 * @returns {Promise<void>}
 */
export async function deleteGroup(groupId) {
  return GroupService.remove(groupId);
}

// ── Students ──────────────────────────────────────────────────

/**
 * Fetch students by group ID (uses index — fast).
 * @param {string} groupId
 * @returns {Promise<Student[]>}
 */
export async function getStudents(groupId) {
  return StudentService.getByGroup(groupId);
}

/**
 * Save (create or update) a student.
 * @param {Student} student
 * @returns {Promise<Student>}
 */
export async function saveStudent(student) {
  return StudentService.save(student);
}

/**
 * Delete a student by ID.
 * @param {string} studentId
 * @returns {Promise<void>}
 */
export async function deleteStudent(studentId) {
  return StudentService.remove(studentId);
}

// ── Backup ────────────────────────────────────────────────────

/**
 * Export all data as a JSON-serializable backup object.
 * @returns {Promise<BackupObject>}
 */
export async function exportBackupData() {
  return BackupService.exportBackup();
}

/**
 * Import data from a backup JSON object.
 * @param {BackupObject} backupJson
 * @returns {Promise<{groupsCount: number, studentsCount: number}>}
 */
export async function importBackupData(backupJson) {
  return BackupService.importBackup(backupJson);
}

// ── Cloud Mode (disabled — always local) ─────────────────────
// These stubs maintain API compatibility with App.js without
// doing anything cloud-related.

/** Always returns false — this app is offline-only. */
export function isCloudMode() {
  return false;
}

/** No-op — cloud sync is disabled. */
export async function syncLocalToCloud() {
  throw new Error('المزامنة السحابية غير متاحة — هذا التطبيق يعمل بالكامل دون اتصال بالإنترنت.');
}

/** No-op — cloud sync is disabled. */
export function disconnectCloud() {
  // nothing to disconnect
}

/** No-op — no Firebase config needed. */
export function getFirebaseConfig() {
  return null;
}

/** No-op — Firebase is not used. */
export function initFirebase() {
  return false;
}
