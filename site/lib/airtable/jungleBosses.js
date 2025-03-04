import base from "./base";

/** @typedef {import('airtable').FieldSet} FieldSet */

/**
 * Every field of the 'jungleBosses' table.
 * @typedef {FieldSet & {
 * Name: string;
 * hours: number;
 * jungleBossesFought?: string[];
 * imageUrl: string;
 * features: string;
 * }} JungleBossesFieldSet
 */

/**
 * The 'jungleBosses' table.
 * @type {import('airtable').Table<JungleBossesFieldSet>}
 */
export const jungleBossesTable = base('jungleBosses');
