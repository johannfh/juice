import base from "./base";

/** @typedef {import('airtable').FieldSet} FieldSet */

export const approved = 'Approved';
export const rejected = 'Rejected';

/**
 * **WARN**: currently there is no "Pending" or anything in the staging Airtable.
 * Once it is added, add a pending option here or use the type from
 * ./juiceStretches.js instead (import(...).ReviewStatus)
 * 
 * @typedef {""
 * | typeof approved
 * | typeof rejected
 * } ReviewStatus
 * */

/**
 * @typedef {FieldSet & {
 * ID: string;
 * githubLink: string;
 * itchLink: string;
 * Status: ReviewStatus;
 * user?: string[];
 * timeFought: string;
 * jungleStretches?: string[];
 * validStretches?: string[];
 * jungleBoss?: string[];
 * hoursCounted: number;
 * }} JungleBossesFoughtFieldSet
 */

/**
 * The 'jungleBossesFought' table.
 * @type {import('airtable').Table<JungleBossesFoughtFieldSet>}
 */
export const jungleBossesFoughtTable = base('jungleBossesFought');
