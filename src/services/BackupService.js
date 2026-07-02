/**
 * services/BackupService.js
 * ─────────────────────────────────────────────────────────────
 * Export and import JSON backups of all application data.
 *
 * Export: reads all groups + students → returns a structured JSON object.
 * Import: validates the JSON → writes all records in a single transaction.
 *
 * SAFETY: Import uses bulkPut (upsert) so existing records are updated,
 *         and new records are inserted — nothing is silently lost.
 *         The caller must ask for confirmation before calling importBackup().
 * ─────────────────────────────────────────────────────────────
 */

import db from '../database';
import { validateBackup } from '../utils/validators';

const BACKUP_VERSION = '2.0';

/**
 * Export all data as a structured JSON backup object.
 * @returns {Promise<BackupObject>}
 */
export async function exportBackup() {
  try {
    const [groups, students] = await Promise.all([
      db.groups.toArray(),
      db.students.toArray(),
    ]);

    return {
      version: BACKUP_VERSION,
      exportedAt: new Date().toISOString(),
      appName: 'TeacherSystem',
      data: { groups, students },
    };
  } catch (err) {
    console.error('[BackupService.exportBackup] Failed:', err);
    throw new Error('فشل تصدير النسخة الاحتياطية: ' + err.message);
  }
}

/**
 * Import data from a backup JSON object.
 * Uses a Dexie transaction → all records write or none do.
 * @param {BackupObject} backupJson
 * @returns {Promise<{groupsCount: number, studentsCount: number}>}
 */
export async function importBackup(backupJson) {
  // Structural validation first
  validateBackup(backupJson); // throws ValidationError if invalid

  const { groups, students } = backupJson.data;

  // Validate each individual record lightly (check id field exists)
  for (const g of groups) {
    if (!g.id) throw new Error('بيانات مجموعة غير صالحة — معرف مفقود');
  }
  for (const s of students) {
    if (!s.id) throw new Error('بيانات طالب غير صالحة — معرف مفقود');
  }

  try {
    await db.transaction('rw', db.groups, db.students, async () => {
      if (groups.length > 0) {
        await db.groups.bulkPut(groups);
      }
      if (students.length > 0) {
        await db.students.bulkPut(students);
      }
    });

    return {
      groupsCount: groups.length,
      studentsCount: students.length,
    };
  } catch (err) {
    console.error('[BackupService.importBackup] Transaction failed:', err);
    throw new Error('فشل استيراد النسخة الاحتياطية: ' + err.message);
  }
}
