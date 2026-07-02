/**
 * models/Group.js
 * ─────────────────────────────────────────────────────────────
 * Group data model — defines the canonical shape of a Group
 * record stored in IndexedDB. Used for documentation and for
 * creating new groups with guaranteed default values.
 * ─────────────────────────────────────────────────────────────
 *
 * Shape:
 * {
 *   id:       string    — unique identifier (genId)
 *   name:     string    — display name (required)
 *   type:     'center' | 'private'
 *   subject:  string    — e.g. "English"
 *   price:    number    — monthly fee in EGP
 *   schedule: string    — human-readable schedule, e.g. "السبت - الاثنين (الساعة 4:00 م)"
 * }
 */

/**
 * Create a new Group object with safe defaults.
 * @param {Partial<Group>} overrides
 * @returns {Group}
 */
export function createGroup(overrides = {}) {
  return {
    id: '',
    name: '',
    type: 'center',
    subject: 'English',
    price: 0,
    schedule: '',
    ...overrides,
  };
}
