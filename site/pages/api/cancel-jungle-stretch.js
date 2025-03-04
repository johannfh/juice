import { signupsTable, jungleStretchesTable } from "@/lib/airtable";

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

    await jungleStretchesTable.update([
      {
        id: records[0].id,
        fields: {
          isCanceled: true,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      message: 'Jungle stretch canceled',
    });
  } catch (error) {
    console.error('Error canceling jungle stretch:', error);
    res.status(500).json({
      success: false,
      message: 'Error canceling jungle stretch',
    });
  }
} 