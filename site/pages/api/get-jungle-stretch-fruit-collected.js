import { jungleStretchesTable, signupsTable } from '@/lib/airtable';

/** @type {import('next').NextApiHandler} */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
    });
  }

  try {
    const { token, stretchId } = req.body;
    
    // Get user's email from Signups table
    const signupRecords = await signupsTable.select({
      filterByFormula: `{token} = '${token}'`,
      maxRecords: 1,
    }).firstPage();

    if (!signupRecords || signupRecords.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const records = await jungleStretchesTable.select({
      filterByFormula: `{ID} = '${stretchId}'`,
      maxRecords: 1,
    }).firstPage();

    if (!records || records.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'jungle stretch not found',
      });
    }

    const fruitsCollected = {
      kiwis: records[0].fields.kiwisCollected == undefined ? 0 : records[0].fields.kiwisCollected,
      lemons: records[0].fields.lemonsCollected == undefined ? 0 : records[0].fields.lemonsCollected,
      oranges: records[0].fields.orangesCollected == undefined ? 0 : records[0].fields.orangesCollected,
      apples: records[0].fields.applesCollected == undefined ? 0 : records[0].fields.applesCollected,
      blueberries: records[0].fields.blueberriesCollected == undefined ? 0 : records[0].fields.blueberriesCollected,
    }

    res.status(200).json({
      success: true,
      fruitCollected: fruitsCollected,
    });
  } catch (error) {
    console.error('Error resuming jungle stretch:', error);
    res.status(500).json({
      success: false,
      message: 'Error resuming jungle stretch',
    });
  }
} 