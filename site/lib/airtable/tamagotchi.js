import base from "./base";

/** @typedef {import('airtable').FieldSet} FieldSet */

/**
 * @typedef {FieldSet & {
 * ID: number;
 * startDate: string;
 * endDate: string;
 * user?: string[]
 * streakNumber: number;
 * isAlive: boolean;
 * }} TamagotchiFieldSet
 */

/**
 * The 'Tamagotchi' table.
 * @type {import('airtable').Table<TamagotchiFieldSet>}
 */
export const tamagotchiTable = base('Tamagotchi');
