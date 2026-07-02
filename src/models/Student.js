/**
 * models/Student.js
 * ─────────────────────────────────────────────────────────────
 * Student data model — canonical shape for a Student record.
 * ─────────────────────────────────────────────────────────────
 *
 * Shape:
 * {
 *   id:           string
 *   name:         string    — required
 *   group_id:     string    — FK to groups.id (required)
 *   phone:        string
 *   parent_phone: string
 *   status:       'active' | 'inactive'
 *   notes:        string
 *   payments:     Payment[]
 *   grades:       Grade[]
 *   attendance:   AttendanceRecord[]
 * }
 *
 * Payment shape:
 * {
 *   id:     string
 *   month:  string  — "YYYY-MM"
 *   amount: number
 *   status: 'paid' | 'partial' | 'unpaid'
 *   note:   string
 * }
 *
 * Grade shape:
 * {
 *   id:    string
 *   exam:  string
 *   score: number
 *   total: number
 *   date:  string  — ISO date
 * }
 *
 * AttendanceRecord shape:
 * {
 *   id:     string
 *   date:   string  — ISO date
 *   status: 'present' | 'absent' | 'late'
 * }
 */

/**
 * Create a new Student object with safe defaults.
 * @param {Partial<Student>} overrides
 * @returns {Student}
 */
export function createStudent(overrides = {}) {
  return {
    id: '',
    name: '',
    group_id: '',
    phone: '',
    parent_phone: '',
    status: 'active',
    notes: '',
    payments: [],
    grades: [],
    attendance: [],
    ...overrides,
  };
}
