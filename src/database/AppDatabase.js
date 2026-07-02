/**
 * AppDatabase.js
 * ─────────────────────────────────────────────────────────────
 * Single Dexie database instance for the entire application.
 *
 * Naming: We deliberately keep the same IndexedDB name that the
 * previous raw-IndexedDB implementation used ("TeacherSystemLocalDB")
 * so that ALL existing user data is preserved automatically.
 *
 * Versioning strategy:
 *  - Version 1 → initial schema (raw IDB compat, no extra indexes)
 *  - Version 2 → adds the group_id index on students for O(log n) lookups
 *
 * Never remove or rename a version block — only add new ones.
 * ─────────────────────────────────────────────────────────────
 */

import Dexie from 'dexie';

const DB_NAME = 'TeacherSystemLocalDB';

class AppDatabase extends Dexie {
  constructor() {
    super(DB_NAME);

    /**
     * Version 1 — Mirrors the original raw IndexedDB schema.
     * Object stores: groups { id }, students { id }
     * No index on group_id yet (safe upgrade path).
     * We do NOT call .upgrade() here because the schema is
     * compatible with the existing data — Dexie will open the
     * existing store without touching any records.
     */
    this.version(1).stores({
      groups: 'id',
      students: 'id',
    });

    /**
     * Version 2 — Adds searchable indexes.
     * Dexie will automatically run the upgrade and build the
     * indexes from existing records. No data loss.
     *
     * groups:   id (PK), type, subject
     * students: id (PK), group_id (index), status (index)
     */
    this.version(2).stores({
      groups: 'id, type, subject',
      students: 'id, group_id, status',
    });

    // Typed table references for IDE auto-complete
    this.groups = this.table('groups');
    this.students = this.table('students');
  }
}

// ── Singleton ─────────────────────────────────────────────────
const db = new AppDatabase();

// Global error handler — never silently swallow DB errors
db.on('blocked', () => {
  console.warn('[AppDatabase] IndexedDB blocked. Another tab may be open with an older version.');
});

export default db;
