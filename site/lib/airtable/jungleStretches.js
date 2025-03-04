import base from "./base";

/** @typedef {import('airtable').FieldSet} FieldSet */

/**
 * @typedef {FieldSet & {
 * ID: string;
 * ["email (from Signups)"]: string;
 * startTime: string;
 * endTime: string;
 * omgMoments?: string[];
 * ["video (from omgMoments)"]: string;
 * ["description (from omgMoments)"]: string;
 * Signups: string;
 * pauseTimeStart: string;
 * totalPauseTimeSeconds: number;
 * isCanceled: boolean;
 * timeWorkedSeconds: number;
 * timeWorkedHours: number;
 * ["Slack ID"]: string;
 * kiwisCollected?: number;
 * lemonsCollected?: number;
 * orangesCollected?: number;
 * applesCollected?: number;
 * blueberriesCollected?: number;
 * lastCollectedFruitTime?: string;
 * moneyEarned?: number;
 * moneyEarnedPerHour?: number;
 * isRedeemed?: string;
 * countsForBoss: boolean;
 * jungleBossesFought?: string[]
 * jungleBossesFoughtFiltered?: string[]
 * }} JungleStretchesFieldSet
 */

/**
 * The 'jungleStretches' table.
 * @type {import('airtable').Table<JungleStretchesFieldSet>}
 */
export const jungleStretchesTable = base('jungleStretches');
