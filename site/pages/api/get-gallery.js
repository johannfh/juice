import { shipsTable } from '@/lib/airtable';

/** @type {import('next').NextApiHandler} */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
    });
  }

  try {
    const juiceStart = new Date(Date.now() - 1000000 * 60 * 60 * 1000).toISOString();

    const ships = await shipsTable
      .select({
        filterByFormula: `IS_AFTER({created_at}, '${juiceStart}')`,
        sort: [{ field: 'created_at', direction: 'desc' }]
      })
      .all();

    /**
     * 
     * @param {import('airtable').Record<import('@/lib/airtable/ships').ShipsFieldSet>} record 
     * @returns {string[]}
     */
    function getPlatforms(record) {
      // Get the Platforms field which is a multiple select
      const platforms = record.fields.Platforms || [];
      // Default to Web if no platforms specified
      return platforms.length > 0 ? platforms : ['Web'];
    }

    const games = await Promise.all(
      ships.map(async (record) => {
        return {
          email: record.fields.user,
          itchurl: record.fields.Link,
          gamename: record.fields.gameName,
          thumbnail: record.fields.gameImage,
          platforms: getPlatforms(record),
          description: record.fields.description || ''
        };
      })
    );

    res.status(200).json(games);
  } catch (error) {
    console.error('Error fetching gallery records:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching gallery records',
    });
  }
}