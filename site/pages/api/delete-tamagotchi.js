import { signupsTable, tamagotchiTable } from "@/lib/airtable";

/** @type {import('next').NextApiHandler} */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
    });
  }

  try {
    const { token } = req.body;
    
    // Get user's email from Signups table
    const signupRecords = signupsTable.select({
      filterByFormula: `{token} = '${token}'`,
      maxRecords: 1,
    }).firstPage();

    if (!signupRecords || signupRecords.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const signupRecord = signupRecords[0];

    // Find user's Tamagotchi
    const tamagotchiRecords = await tamagotchiTable.select({
      filterByFormula: `{user} = '${signupRecord.fields.email}'`,
      maxRecords: 1,
    }).firstPage();

    if (!tamagotchiRecords || tamagotchiRecords.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Tamagotchi not found',
      });
    }

    // Delete the Tamagotchi record
    await tamagotchiTable.destroy(tamagotchiRecords[0].id);

    res.status(200).json({
      success: true,
      message: 'Tamagotchi has been deleted',
    });
  } catch (error) {
    console.error('Error deleting Tamagotchi:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting Tamagotchi',
    });
  }
} 