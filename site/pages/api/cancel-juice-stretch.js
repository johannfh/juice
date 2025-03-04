import { juiceStretchesTable, signupsTable } from "@/lib/airtable";

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

    const records = await juiceStretchesTable.select({
      filterByFormula: `{ID} = '${stretchId}'`,
      maxRecords: 1
    }).firstPage();

    if (!records || records.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Juice stretch not found',
      });
    }

    await juiceStretchesTable.update([
      {
        id: records[0].id,
        fields: {
          isCanceled: true,
        },
      }
    ]);

    res.status(200).json({
      success: true,
      message: 'Juice stretch canceled',
    });
  } catch (error) {
    console.error('Error canceling juice stretch:', error);
    res.status(500).json({
      success: false,
      message: 'Error canceling juice stretch',
    });
  }
} 