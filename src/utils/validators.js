/**
 * validators.js
 * ─────────────────────────────────────────────────────────────
 * Pure validation functions — no side effects, no DB access.
 * Called by services before every write operation.
 * ─────────────────────────────────────────────────────────────
 */

/**
 * Throw a typed validation error with a descriptive message.
 * @param {string} field
 * @param {string} reason
 */
function validationError(field, reason) {
  const err = new Error(`[Validation] ${field}: ${reason}`);
  err.name = 'ValidationError';
  err.field = field;
  throw err;
}

// ── Group Validators ──────────────────────────────────────────

/**
 * Validate a group object before saving to IndexedDB.
 * @param {object} group
 * @throws {ValidationError}
 */
export function validateGroup(group) {
  if (!group || typeof group !== 'object') {
    validationError('group', 'Must be a non-null object');
  }
  if (!group.id || typeof group.id !== 'string' || group.id.trim() === '') {
    validationError('id', 'Must be a non-empty string');
  }
  if (!group.name || typeof group.name !== 'string' || group.name.trim() === '') {
    validationError('name', 'اسم المجموعة مطلوب');
  }
  if (!['center', 'private'].includes(group.type)) {
    validationError('type', 'يجب أن يكون "center" أو "private"');
  }
  if (typeof group.price !== 'number' || group.price < 0 || isNaN(group.price)) {
    validationError('price', 'يجب أن يكون السعر رقماً موجباً');
  }
}

// ── Student Validators ────────────────────────────────────────

/**
 * Validate a student object before saving to IndexedDB.
 * @param {object} student
 * @throws {ValidationError}
 */
export function validateStudent(student) {
  if (!student || typeof student !== 'object') {
    validationError('student', 'Must be a non-null object');
  }
  if (!student.id || typeof student.id !== 'string' || student.id.trim() === '') {
    validationError('id', 'Must be a non-empty string');
  }
  if (!student.name || typeof student.name !== 'string' || student.name.trim() === '') {
    validationError('name', 'اسم الطالب مطلوب');
  }
  if (!student.group_id || typeof student.group_id !== 'string' || student.group_id.trim() === '') {
    validationError('group_id', 'يجب تحديد المجموعة');
  }

  // Validate nested arrays if present
  if (student.payments !== undefined && !Array.isArray(student.payments)) {
    validationError('payments', 'يجب أن تكون المدفوعات مصفوفة');
  }
  if (student.grades !== undefined && !Array.isArray(student.grades)) {
    validationError('grades', 'يجب أن تكون الدرجات مصفوفة');
  }
  if (student.attendance !== undefined && !Array.isArray(student.attendance)) {
    validationError('attendance', 'يجب أن تكون الحضور مصفوفة');
  }
}

// ── Backup Validator ──────────────────────────────────────────

/**
 * Validate an imported backup JSON object.
 * @param {any} backup
 * @throws {ValidationError}
 */
export function validateBackup(backup) {
  if (!backup || typeof backup !== 'object') {
    validationError('backup', 'ملف النسخة الاحتياطية غير صالح');
  }
  if (!backup.data || typeof backup.data !== 'object') {
    validationError('data', 'بنية الملف غير صحيحة — حقل data مفقود');
  }
  if (!Array.isArray(backup.data.groups)) {
    validationError('data.groups', 'بيانات المجموعات غير موجودة أو غير صالحة');
  }
  if (!Array.isArray(backup.data.students)) {
    validationError('data.students', 'بيانات الطلاب غير موجودة أو غير صالحة');
  }
}
