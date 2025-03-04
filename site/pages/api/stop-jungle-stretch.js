import { jungleStretchesTable } from "@/lib/airtable";

/** @type {import('next').NextApiHandler} */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
    });
  }

  try {
    const { stretchId } = req.body;
    
    // Find the record with matching ID
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

    // Update the record with end time
    await jungleStretchesTable.update(
      records[0].id,
      { endTime: new Date().toISOString() },
    );

    res.status(200).json({
      success: true,
      message: 'jungle stretch ended',
    });

  } catch (error) {
    console.error('Error stopping jungle stretch:', error);
    res.status(500).json({
      success: false,
      message: 'Error stopping jungle stretch',
    });
  }
} 